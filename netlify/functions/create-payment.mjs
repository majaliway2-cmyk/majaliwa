import {
    PaymentError,
    PAYMENTS_ENABLED,
    corsHeaders,
    createIdempotencyKey,
    createTransactionReference,
    fetchFlutterwave,
    getPaymentConfig,
    jsonResponse,
    paymentStore,
    paymentUnavailableResponse,
    readJsonBody,
    updatePayment,
    validatePaymentInput
} from "./_payments.mjs";

function errorResponse(error, headers = {}) {
    const status = error instanceof PaymentError ? error.status : 502;
    const timedOut = error.name === "AbortError" || error.name === "TimeoutError" || error.code === "ABORT_ERR";
    const code = error instanceof PaymentError ? error.code : timedOut ? "gateway_timeout" : error.providerRejection ? "gateway_rejected" : "gateway_unavailable";
    return jsonResponse({ error: { code } }, status, headers);
}

function diagnosticText(value, sensitiveValues) {
    if (typeof value !== "string" && typeof value !== "number") return null;
    let text = String(value).replace(/[\r\n\t]/g, " ").slice(0, 300);
    text = text
        .replace(/\bAuthorization\s*:\s*Bearer\s+\S+/gi, "[redacted-authorization]")
        .replace(/\bBearer\s+\S+/gi, "[redacted-authorization]")
        .replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, "[redacted-email]")
        .replace(/\+?255(?:[\s()-]*\d){9}/g, "[redacted-phone]")
        .replace(/0[1-9](?:[\s()-]*\d){8}/g, "[redacted-phone]");
    for (const sensitiveValue of sensitiveValues) {
        if (typeof sensitiveValue === "string" && sensitiveValue) {
            text = text.split(sensitiveValue).join("[redacted]");
        }
    }
    return text;
}

function logGatewayFailure(error, txRef, config, order, logger) {
    const timedOut = error.name === "AbortError" || error.name === "TimeoutError" || error.code === "ABORT_ERR";
    const sensitiveValues = [config.secretKey, config.webhookSecret, order.email, order.phone];
    const diagnostic = {
        event: "flutterwave_request_failed",
        endpoint: diagnosticText(error.endpoint || "https://api.flutterwave.com/v3/payments", sensitiveValues),
        transactionReference: txRef,
        httpStatus: Number.isInteger(error.status) ? error.status : null,
        providerError: diagnosticText(error.providerError, sensitiveValues),
        providerMessage: diagnosticText(error.providerMessage, sensitiveValues),
        providerCode: diagnosticText(error.providerCode, sensitiveValues),
        internalErrorName: diagnosticText(error.name || "Error", sensitiveValues),
        timeout: timedOut,
        providerRejection: error.providerRejection === true
    };
    logger(JSON.stringify(diagnostic));
}

export async function createPayment(request, dependencies = {}) {
    if (!PAYMENTS_ENABLED) return paymentUnavailableResponse();
    let headers = {};
    try {
        headers = corsHeaders(request, dependencies.env);
        if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
        if (request.method !== "POST") return jsonResponse({ error: { code: "method_not_allowed" } }, 405, headers);

        const env = dependencies.env || process.env;
        const config = getPaymentConfig(env);
        const idempotencyHash = createIdempotencyKey(request.headers.get("idempotency-key"));
        const order = validatePaymentInput(await readJsonBody(request));
        const store = dependencies.store || paymentStore();
        const idempotencyKey = `idempotency:${idempotencyHash}`;
        const existingIdempotency = await store.get(idempotencyKey, { type: "json", consistency: "strong" });
        if (existingIdempotency) {
            const existingPayment = await store.get(`payment:${existingIdempotency.txRef}`, { type: "json", consistency: "strong" });
            if (existingPayment?.checkoutUrl && existingPayment.status === "pending") {
                return jsonResponse({ checkoutUrl: existingPayment.checkoutUrl, tx_ref: existingPayment.txRef, reused: true }, 200, headers);
            }
            return jsonResponse({ tx_ref: existingIdempotency.txRef, status: existingPayment?.status || "processing", error: { code: "duplicate_request" } }, 409, headers);
        }

        const txRef = createTransactionReference();
        const idempotencyReservation = await store.setJSON(idempotencyKey, { txRef }, { onlyIfNew: true });
        if (!idempotencyReservation.modified) {
            return jsonResponse({ error: { code: "duplicate_request" } }, 409, headers);
        }

        const payment = {
            txRef,
            ...order,
            currency: "TZS",
            status: "pending",
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString()
        };
        const created = await store.setJSON(`payment:${txRef}`, payment, { onlyIfNew: true });
        if (!created.modified) throw new Error("payment_reference_collision");

        const redirectUrl = new URL("/contact.html#payment", config.siteUrl).href;
        const providerOptions = order.paymentMethod === "mobile_money" ? "mobilemoneytanzania" : "card";
        try {
            const result = await (dependencies.fetchFlutterwave || fetchFlutterwave)("/payments", {
                secretKey: config.secretKey,
                method: "POST",
                fetcher: dependencies.fetcher,
                body: {
                    tx_ref: txRef,
                    amount: order.amount,
                    currency: "TZS",
                    redirect_url: redirectUrl,
                    customer: {
                        name: order.customerName,
                        email: order.email,
                        phone_number: order.phone
                    },
                    payment_options: providerOptions,
                    customizations: {
                        title: "Majaliwa Yahaya",
                        description: "Website services"
                    },
                    configuration: {
                        session_duration: 30,
                        max_retry_attempt: 3
                    }
                }
            });
            const checkoutUrl = new URL(result?.link || "");
            if (checkoutUrl.protocol !== "https:" || checkoutUrl.hostname !== "checkout.flutterwave.com") {
                throw new Error("invalid_flutterwave_checkout_url");
            }
            await updatePayment(store, txRef, (current) => {
                const { email, phone, ...receiptRecord } = current;
                return { ...receiptRecord, checkoutUrl: checkoutUrl.href };
            });
            return jsonResponse({ checkoutUrl: checkoutUrl.href, tx_ref: txRef }, 201, headers);
        } catch (error) {
            const logger = dependencies.logger || ((entry) => console.error(entry));
            logGatewayFailure(error, txRef, config, order, logger);
            const timedOut = error.name === "AbortError" || error.name === "TimeoutError" || error.code === "ABORT_ERR";
            const uncertain = !error.providerRejection && (timedOut || error.status >= 500 || error.status === undefined);
            await updatePayment(store, txRef, (current) => {
                const { email, phone, ...receiptRecord } = current;
                return {
                    ...receiptRecord,
                    status: uncertain ? "processing" : "failed",
                    lastError: uncertain ? "gateway_result_unknown" : "gateway_rejected",
                    updatedAt: new Date().toISOString()
                };
            });
            throw error;
        }
    } catch (error) {
        return errorResponse(error, headers);
    }
}

export default async (request) => createPayment(request);
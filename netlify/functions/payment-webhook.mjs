import {
    PaymentError,
    PAYMENTS_ENABLED,
    fetchFlutterwave,
    getPaymentConfig,
    getTransactionId,
    jsonResponse,
    normalizeFlutterwaveStatus,
    paymentStore,
    paymentUnavailableResponse,
    updatePayment,
    validTransactionReference,
    verifiedTransactionMatches,
    webhookSecretMatches
} from "./_payments.mjs";

export async function handlePaymentWebhook(request, dependencies = {}) {
    if (!PAYMENTS_ENABLED) return paymentUnavailableResponse();
    try {
        if (request.method !== "POST") return jsonResponse({ error: { code: "method_not_allowed" } }, 405);
        const config = getPaymentConfig(dependencies.env || process.env);
        const signature = request.headers.get("verif-hash");
        if (!webhookSecretMatches(signature, config.webhookSecret)) {
            return jsonResponse({ error: { code: "invalid_webhook_signature" } }, 401);
        }

        const contentLength = Number(request.headers.get("content-length") || 0);
        if (contentLength > 16_384) throw new PaymentError("request_too_large", 413);
        const bodyText = await request.text();
        if (bodyText.length > 16_384) throw new PaymentError("request_too_large", 413);
        let payload;
        try {
            payload = JSON.parse(bodyText);
        } catch {
            throw new PaymentError("invalid_json", 400);
        }

        const txRef = payload?.data?.tx_ref;
        const transactionId = getTransactionId(String(payload?.data?.id ?? ""));
        if (!validTransactionReference(txRef) || !transactionId) {
            throw new PaymentError("invalid_webhook_payload", 400);
        }

        const store = dependencies.store || paymentStore();
        const payment = await store.get(`payment:${txRef}`, { type: "json", consistency: "strong" });
        if (!payment) return jsonResponse({ received: true, ignored: true }, 200);

        const data = await (dependencies.fetchFlutterwave || fetchFlutterwave)(`/transactions/${transactionId}/verify`, {
            secretKey: config.secretKey,
            fetcher: dependencies.fetcher
        });
        if (!data || data.tx_ref !== txRef) throw new PaymentError("verification_mismatch", 409);
        let status = normalizeFlutterwaveStatus(data.status);
        let verified = false;
        if (status === "successful") {
            verified = verifiedTransactionMatches(data, payment);
            if (!verified) throw new PaymentError("verification_mismatch", 409);
        }
        if (status === "unknown") status = "processing";

        await updatePayment(store, txRef, (current) => {
            if (current.status === "successful") return current;
            return {
                ...current,
                status,
                providerTransactionId: String(data.id),
                providerReference: data.flw_ref || current.providerReference || "",
                paymentDate: data.created_at || current.paymentDate || current.createdAt,
                verifiedAt: verified ? new Date().toISOString() : current.verifiedAt
            };
        });
        return jsonResponse({ received: true }, 200);
    } catch (error) {
        const status = error instanceof PaymentError ? error.status : error.name === "AbortError" ? 503 : 502;
        const code = error instanceof PaymentError ? error.code : error.name === "AbortError" ? "gateway_timeout" : "webhook_processing_failed";
        return jsonResponse({ error: { code } }, status);
    }
}

export default async (request) => handlePaymentWebhook(request);
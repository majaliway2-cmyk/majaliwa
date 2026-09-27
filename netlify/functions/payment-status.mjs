import {
    PaymentError,
    PAYMENTS_ENABLED,
    corsHeaders,
    fetchFlutterwave,
    getPaymentConfig,
    getTransactionId,
    jsonResponse,
    normalizeFlutterwaveStatus,
    paymentStore,
    paymentUnavailableResponse,
    publicPaymentResult,
    updatePayment,
    validTransactionReference,
    verifiedTransactionMatches
} from "./_payments.mjs";

function errorResponse(error, headers = {}) {
    const status = error instanceof PaymentError ? error.status : error.name === "AbortError" ? 504 : 502;
    const code = error instanceof PaymentError ? error.code : error.name === "AbortError" ? "gateway_timeout" : "verification_unavailable";
    return jsonResponse({ error: { code } }, status, headers);
}

export async function getPaymentStatus(request, dependencies = {}) {
    if (!PAYMENTS_ENABLED) return paymentUnavailableResponse();
    let headers = {};
    try {
        headers = corsHeaders(request, dependencies.env);
        if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
        if (request.method !== "GET") return jsonResponse({ error: { code: "method_not_allowed" } }, 405, headers);

        const config = getPaymentConfig(dependencies.env || process.env);
        const url = new URL(request.url);
        const txRef = url.searchParams.get("tx_ref");
        if (!validTransactionReference(txRef)) throw new PaymentError("invalid_reference", 400);
        const store = dependencies.store || paymentStore();
        const payment = await store.get(`payment:${txRef}`, { type: "json", consistency: "strong" });
        if (!payment) throw new PaymentError("transaction_not_found", 404);

        const id = getTransactionId(url.searchParams.get("transaction_id"));
        const path = id
            ? `/transactions/${encodeURIComponent(id)}/verify`
            : `/transactions/verify_by_reference?tx_ref=${encodeURIComponent(txRef)}`;
        const data = await (dependencies.fetchFlutterwave || fetchFlutterwave)(path, {
            secretKey: config.secretKey,
            fetcher: dependencies.fetcher
        });
        if (!data || data.tx_ref !== txRef) throw new PaymentError("verification_mismatch", 409);

        let state = normalizeFlutterwaveStatus(data.status);
        let verified = false;
        if (state === "successful") {
            verified = verifiedTransactionMatches(data, payment);
            if (!verified) throw new PaymentError("verification_mismatch", 409);
        }
        if (state === "unknown") throw new PaymentError("unknown_transaction_status", 409);

        const updated = await updatePayment(store, txRef, (current) => {
            if (current.status === "successful") return current;
            return {
                ...current,
                status: state,
                providerTransactionId: String(data.id || id || ""),
                providerReference: data.flw_ref || current.providerReference || "",
                paymentDate: data.created_at || current.paymentDate || current.createdAt,
                verifiedAt: verified ? new Date().toISOString() : current.verifiedAt
            };
        });
        if (!updated) throw new PaymentError("transaction_not_found", 404);
        return jsonResponse(publicPaymentResult(updated), 200, headers);
    } catch (error) {
        return errorResponse(error, headers);
    }
}

export default async (request) => getPaymentStatus(request);
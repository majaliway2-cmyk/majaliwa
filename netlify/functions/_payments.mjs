import { createHash, randomUUID, timingSafeEqual } from "node:crypto";
import { getStore } from "@netlify/blobs";

const PAYMENT_STORE = "majaliwa-payments";
const SERVICE_NAMES = new Set(["business", "personal", "company"]);
const PAYMENT_METHODS = new Set(["mobile_money", "card"]);
const TX_REF_PATTERN = /^MY-[0-9a-f-]{36}$/i;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+255[1-9]\d{8}$/;
const MAX_BODY_SIZE = 16_384;

export class PaymentError extends Error {
    constructor(code, status = 400) {
        super(code);
        this.name = "PaymentError";
        this.code = code;
        this.status = status;
    }
}

export function jsonResponse(body, status = 200, headers = {}) {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "no-store",
            "X-Content-Type-Options": "nosniff",
            ...headers
        }
    });
}

export function corsHeaders(request, env = process.env) {
    const origin = request.headers.get("origin");
    if (!origin) return { Vary: "Origin" };
    const origins = [env.SITE_URL, env.URL];
    if ((env.FLW_MODE || "sandbox") === "sandbox") origins.push(env.DEPLOY_PRIME_URL);
    const allowed = origins.filter(Boolean).some((candidate) => {
        try {
            return new URL(candidate).origin === origin;
        } catch {
            return false;
        }
    });
    if (!allowed) throw new PaymentError("origin_not_allowed", 403);
    return {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Idempotency-Key",
        "Access-Control-Max-Age": "600",
        Vary: "Origin"
    };
}

export async function readJsonBody(request) {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("application/json")) {
        throw new PaymentError("invalid_content_type", 415);
    }
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > MAX_BODY_SIZE) throw new PaymentError("request_too_large", 413);
    const text = await request.text();
    if (text.length > MAX_BODY_SIZE) throw new PaymentError("request_too_large", 413);
    try {
        return JSON.parse(text);
    } catch {
        throw new PaymentError("invalid_json", 400);
    }
}

export function normalizeTanzanianPhone(value) {
    if (typeof value !== "string") return null;
    const compact = value.trim().replace(/[\s()-]/g, "");
    if (/^0[1-9]\d{8}$/.test(compact)) return `+255${compact.slice(1)}`;
    if (/^255[1-9]\d{8}$/.test(compact)) return `+${compact}`;
    if (PHONE_PATTERN.test(compact)) return compact;
    return null;
}

export function validatePaymentInput(input) {
    if (!input || typeof input !== "object" || Array.isArray(input)) {
        throw new PaymentError("invalid_request", 400);
    }
    const service = typeof input.service === "string" ? input.service : "";
    if (!SERVICE_NAMES.has(service)) throw new PaymentError("invalid_service", 400);

    const amount = typeof input.amount === "number" ? input.amount : Number(input.amount);
    if (!Number.isSafeInteger(amount) || amount <= 0 || amount > 100_000_000) {
        throw new PaymentError("invalid_amount", 400);
    }

    const customerName = typeof input.name === "string" ? input.name.trim() : "";
    if (customerName.length < 2 || customerName.length > 100 || /[\u0000-\u001f]/.test(customerName)) {
        throw new PaymentError("invalid_name", 400);
    }

    const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
    if (email.length > 254 || !EMAIL_PATTERN.test(email)) throw new PaymentError("invalid_email", 400);

    const phone = normalizeTanzanianPhone(input.phone);
    if (!phone) throw new PaymentError("invalid_phone", 400);

    const paymentMethod = typeof input.paymentMethod === "string" ? input.paymentMethod : "";
    if (!PAYMENT_METHODS.has(paymentMethod)) throw new PaymentError("invalid_payment_method", 400);

    return { service, amount, customerName, email, phone, paymentMethod };
}

export function getPaymentConfig(env = process.env) {
    const mode = env.FLW_MODE || "sandbox";
    const secretKey = env.FLW_SECRET_KEY || "";
    const webhookSecret = env.FLW_SECRET_HASH || "";
    const siteUrl = env.SITE_URL || env.URL || "";
    const hasPlaceholder = /REPLACE_WITH|YOUR_|CHANGE_ME/i.test(`${secretKey} ${webhookSecret}`);
    if (mode !== "sandbox" && mode !== "production") throw new PaymentError("payment_not_configured", 503);
    if (hasPlaceholder) throw new PaymentError("payment_not_configured", 503);
    if (mode === "sandbox" && !secretKey.startsWith("FLWSECK_TEST-")) {
        throw new PaymentError("payment_not_configured", 503);
    }
    if (mode === "production" && (!secretKey.startsWith("FLWSECK-") || secretKey.startsWith("FLWSECK_TEST-"))) {
        throw new PaymentError("payment_not_configured", 503);
    }
    if (!webhookSecret || webhookSecret.length < 16 || !siteUrl) {
        throw new PaymentError("payment_not_configured", 503);
    }
    let parsedSiteUrl;
    try {
        parsedSiteUrl = new URL(siteUrl);
    } catch {
        throw new PaymentError("payment_not_configured", 503);
    }
    const isLocal = ["localhost", "127.0.0.1"].includes(parsedSiteUrl.hostname);
    if (parsedSiteUrl.origin !== siteUrl.replace(/\/$/, "") || (mode === "production" && parsedSiteUrl.protocol !== "https:") || (mode === "sandbox" && parsedSiteUrl.protocol !== "https:" && !isLocal)) {
        throw new PaymentError("payment_not_configured", 503);
    }
    return { mode, secretKey, webhookSecret, siteUrl: parsedSiteUrl.origin };
}

export function createTransactionReference() {
    return `MY-${randomUUID()}`;
}

export function normalizeFlutterwaveStatus(status) {
    const value = typeof status === "string" ? status.toLowerCase() : "";
    if (value === "successful") return "successful";
    if (value === "failed" || value === "error" || value === "rejected") return "failed";
    if (value === "cancelled" || value === "canceled") return "cancelled";
    if (value === "pending" || value === "new" || value === "incomplete") return "pending";
    if (value === "processing" || value === "ongoing" || value === "queued") return "processing";
    return "unknown";
}

export function verifiedTransactionMatches(data, payment) {
    if (!data || typeof data !== "object") return false;
    if (data.status !== "successful" || data.tx_ref !== payment.txRef || data.currency !== "TZS") return false;
    if (Number(data.amount) !== payment.amount) return false;
    const paymentType = typeof data.payment_type === "string" ? data.payment_type.toLowerCase() : "";
    if (payment.paymentMethod === "mobile_money" && paymentType !== "mobilemoneytz") return false;
    if (payment.paymentMethod === "card" && paymentType !== "card") return false;
    return true;
}

export function webhookSecretMatches(received, expected) {
    if (typeof received !== "string" || typeof expected !== "string" || !expected) return false;
    const receivedBytes = Buffer.from(received);
    const expectedBytes = Buffer.from(expected);
    return receivedBytes.length === expectedBytes.length && timingSafeEqual(receivedBytes, expectedBytes);
}

export function createIdempotencyKey(value) {
    if (typeof value !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) {
        throw new PaymentError("invalid_idempotency_key", 400);
    }
    return createHash("sha256").update(value).digest("hex");
}

export function paymentStore() {
    return getStore({ name: PAYMENT_STORE, consistency: "strong" });
}

export async function fetchFlutterwave(path, { secretKey, method = "GET", body, fetcher = fetch } = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);
    const endpoint = `https://api.flutterwave.com/v3${path}`;
    try {
        let response;
        try {
            response = await fetcher(endpoint, {
                method,
                headers: {
                    Authorization: `Bearer ${secretKey}`,
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                ...(body ? { body: JSON.stringify(body) } : {}),
                signal: controller.signal
            });
        } catch (error) {
            if (error && typeof error === "object") error.endpoint = endpoint;
            throw error;
        }
        const result = await response.json().catch(() => null);
        if (!response.ok || result?.status !== "success") {
            const error = new Error("flutterwave_request_failed");
            error.name = "FlutterwaveRequestError";
            error.status = response.status;
            error.endpoint = endpoint;
            error.providerRejection = (response.status >= 400 && response.status < 500) || result?.status === "error";
            error.providerError = typeof result?.error === "string" ? result.error : result?.error?.message;
            error.providerMessage = result?.message;
            error.providerCode = result?.code ?? result?.error?.code ?? result?.data?.code;
            throw error;
        }
        return result.data;
    } finally {
        clearTimeout(timeout);
    }
}

export async function updatePayment(store, txRef, update) {
    const key = `payment:${txRef}`;
    for (let attempt = 0; attempt < 5; attempt += 1) {
        const entry = await store.getWithMetadata(key, { type: "json", consistency: "strong" });
        if (!entry) return null;
        const next = update(entry.data);
        const result = await store.setJSON(key, next, { onlyIfMatch: entry.etag });
        if (result.modified) return next;
    }
    throw new Error("payment_record_conflict");
}

export function publicPaymentResult(payment) {
    return {
        status: payment.status,
        customerName: payment.customerName,
        service: payment.service,
        amount: payment.amount,
        transactionReference: payment.txRef,
        paymentMethod: payment.paymentMethod,
        paymentDate: payment.paymentDate || payment.createdAt,
        providerReference: payment.providerReference || null
    };
}

export function getTransactionId(value) {
    return typeof value === "string" && /^\d{1,30}$/.test(value) ? value : null;
}

export function validTransactionReference(value) {
    return typeof value === "string" && TX_REF_PATTERN.test(value);
}
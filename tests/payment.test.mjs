import test from "node:test";
import assert from "node:assert/strict";
import { createPayment } from "../netlify/functions/create-payment.mjs";
import { getPaymentStatus } from "../netlify/functions/payment-status.mjs";
import { handlePaymentWebhook } from "../netlify/functions/payment-webhook.mjs";
import {
    createIdempotencyKey,
    getPaymentConfig,
    normalizeFlutterwaveStatus,
    normalizeTanzanianPhone,
    validatePaymentInput,
    verifiedTransactionMatches,
    webhookSecretMatches
} from "../netlify/functions/_payments.mjs";

const env = {
    FLW_MODE: "sandbox",
    FLW_SECRET_KEY: "FLWSECK_TEST-NOT-A-REAL-CREDENTIAL",
    FLW_SECRET_HASH: "test-only-webhook-secret-value",
    SITE_URL: "https://majaliwa.example"
};

const validPayment = {
    service: "business",
    amount: "500000",
    name: "John Doe",
    phone: "+255 761 932 342",
    email: "john@example.com",
    paymentMethod: "mobile_money"
};

class MemoryStore {
    entries = new Map();
    sequence = 0;

    async get(key) {
        return this.entries.get(key)?.value ?? null;
    }

    async setJSON(key, value, options = {}) {
        const existing = this.entries.get(key);
        if (options.onlyIfNew && existing) return { modified: false };
        if (options.onlyIfMatch && existing?.etag !== options.onlyIfMatch) return { modified: false };
        this.sequence += 1;
        this.entries.set(key, { value: structuredClone(value), etag: `etag-${this.sequence}` });
        return { modified: true, etag: `etag-${this.sequence}` };
    }

    async getWithMetadata(key) {
        const entry = this.entries.get(key);
        return entry ? { data: structuredClone(entry.value), etag: entry.etag } : null;
    }
}

function createRequest(body, idempotencyKey = crypto.randomUUID()) {
    return new Request("https://majaliwa.example/api/create-payment", {
        method: "POST",
        headers: {
            Origin: env.SITE_URL,
            "Content-Type": "application/json",
            "Idempotency-Key": idempotencyKey
        },
        body: JSON.stringify(body)
    });
}

test("normalizes Tanzanian mobile numbers without accepting another country", () => {
    assert.equal(normalizeTanzanianPhone("0761 932 342"), "+255761932342");
    assert.equal(normalizeTanzanianPhone("255761932342"), "+255761932342");
    assert.equal(normalizeTanzanianPhone("+255 761 932 342"), "+255761932342");
    assert.equal(normalizeTanzanianPhone("+254 761 932 342"), null);
});

test("validates whole TZS amounts and supported payment choices", () => {
    assert.equal(validatePaymentInput(validPayment).amount, 500000);
    assert.throws(() => validatePaymentInput({ ...validPayment, amount: "10.5" }), { code: "invalid_amount" });
    assert.throws(() => validatePaymentInput({ ...validPayment, amount: "0" }), { code: "invalid_amount" });
    assert.throws(() => validatePaymentInput({ ...validPayment, paymentMethod: "unknown" }), { code: "invalid_payment_method" });
    assert.throws(() => validatePaymentInput({ ...validPayment, phone: "+254700000000" }), { code: "invalid_phone" });
});

test("maps provider processing states without promoting them to success", () => {
    assert.equal(normalizeFlutterwaveStatus("pending"), "pending");
    assert.equal(normalizeFlutterwaveStatus("ongoing"), "processing");
    assert.equal(normalizeFlutterwaveStatus("failed"), "failed");
    assert.equal(normalizeFlutterwaveStatus("cancelled"), "cancelled");
    assert.equal(normalizeFlutterwaveStatus("unexpected"), "unknown");
});

test("requires every stored transaction field to match before accepting provider success", () => {
    const payment = { txRef: "MY-12345678-1234-4123-8123-123456789abc", amount: 500000, paymentMethod: "mobile_money" };
    const untrusted = { tx_ref: payment.txRef, amount: 500000, currency: "TZS", status: "pending", payment_type: "mobilemoneytz" };
    assert.equal(verifiedTransactionMatches(untrusted, payment), false);
    assert.equal(verifiedTransactionMatches({ ...untrusted, status: "successful", tx_ref: "MY-other" }, payment), false);
    assert.equal(verifiedTransactionMatches({ ...untrusted, status: "successful", amount: 500001 }, payment), false);
    assert.equal(verifiedTransactionMatches({ ...untrusted, status: "successful", payment_type: "card" }, payment), false);
});

test("validates idempotency identifiers and compares webhook secrets in constant time", () => {
    assert.match(createIdempotencyKey("123e4567-e89b-42d3-a456-426614174000"), /^[a-f0-9]{64}$/);
    assert.throws(() => createIdempotencyKey("not-a-uuid"), { code: "invalid_idempotency_key" });
    assert.equal(webhookSecretMatches("test-only-webhook-secret-value", env.FLW_SECRET_HASH), true);
    assert.equal(webhookSecretMatches("wrong-secret", env.FLW_SECRET_HASH), false);
});

test("does not allow deploy-preview origins to initiate production payments", async () => {
    const request = new Request("https://majaliwa.example/api/create-payment", {
        method: "POST",
        headers: {
            Origin: "https://preview--majaliwa.netlify.app",
            "Content-Type": "application/json",
            "Idempotency-Key": "123e4567-e89b-42d3-a456-426614174000"
        },
        body: JSON.stringify(validPayment)
    });
    const response = await createPayment(request, {
        env: { ...env, FLW_MODE: "production", FLW_SECRET_KEY: "FLWSECK-LIVE-FAKE-TEST-ONLY", DEPLOY_PRIME_URL: "https://preview--majaliwa.netlify.app" },
        store: new MemoryStore(),
        fetchFlutterwave: async () => ({ link: "https://checkout.flutterwave.com/v3/hosted/pay/unused" })
    });
    assert.equal(response.status, 403);
});

test("creates only a hosted checkout and reuses it for a duplicate idempotency key", async () => {
    const store = new MemoryStore();
    let providerRequests = 0;
    const fetchFlutterwave = async (path, options) => {
        providerRequests += 1;
        assert.equal(path, "/payments");
        assert.equal(options.method, "POST");
        assert.equal(options.body.amount, 500000);
        assert.equal(options.body.currency, "TZS");
        assert.equal(options.body.redirect_url, "https://majaliwa.example/contact.html#payment");
        assert.equal(options.body.payment_options, "mobilemoneytanzania");
        assert.equal(options.body.customer.phone_number, "+255761932342");
        assert.equal(options.body.customer.phonenumber, undefined);
        assert.deepEqual(options.body.configuration, { session_duration: 30, max_retry_attempt: 3 });
        return { link: "https://checkout.flutterwave.com/v3/hosted/pay/sandbox-link" };
    };
    const key = "123e4567-e89b-42d3-a456-426614174000";
    const dependencies = { env, store, fetchFlutterwave };
    const first = await createPayment(createRequest(validPayment, key), dependencies);
    const firstBody = await first.json();
    assert.equal(first.status, 201);
    assert.equal(firstBody.checkoutUrl, "https://checkout.flutterwave.com/v3/hosted/pay/sandbox-link");
    assert.match(firstBody.tx_ref, /^MY-/);
    const storedPayment = await store.get(`payment:${firstBody.tx_ref}`);
    assert.equal(storedPayment.status, "pending");
    assert.equal(storedPayment.phone, undefined);
    assert.equal(storedPayment.email, undefined);

    const second = await createPayment(createRequest(validPayment, key), dependencies);
    const secondBody = await second.json();
    assert.equal(second.status, 200);
    assert.equal(secondBody.tx_ref, firstBody.tx_ref);
    assert.equal(providerRequests, 1);
});

test("logs safe Flutterwave rejection details and returns a diagnostic gateway code", async () => {
    const store = new MemoryStore();
    const logs = [];
    let submittedBody;
    const response = await createPayment(createRequest(validPayment), {
        env,
        store,
        logger: (entry) => logs.push(entry),
        fetcher: async (endpoint, options) => {
            assert.equal(endpoint, "https://api.flutterwave.com/v3/payments");
            assert.equal(options.method, "POST");
            submittedBody = JSON.parse(options.body);
            return new Response(JSON.stringify({
                status: "error",
                message: `Rejected ${validPayment.email} ${validPayment.phone} Authorization: Bearer ${env.FLW_SECRET_KEY} ${env.FLW_SECRET_HASH}`,
                code: "validation_error",
                error: "invalid_customer"
            }), { status: 400, headers: { "Content-Type": "application/json" } });
        }
    });

    const responseBody = await response.json();
    assert.equal(response.status, 502);
    assert.equal(responseBody.error.code, "gateway_rejected");
    assert.equal(submittedBody.customer.phone_number, "+255761932342");
    assert.equal(submittedBody.customer.email, validPayment.email);
    assert.equal(submittedBody.currency, "TZS");
    assert.equal(submittedBody.payment_options, "mobilemoneytanzania");
    assert.equal(logs.length, 1);

    const diagnostic = JSON.parse(logs[0]);
    assert.equal(diagnostic.endpoint, "https://api.flutterwave.com/v3/payments");
    assert.equal(diagnostic.transactionReference, submittedBody.tx_ref);
    assert.equal(diagnostic.httpStatus, 400);
    assert.equal(diagnostic.providerError, "invalid_customer");
    assert.equal(diagnostic.providerCode, "validation_error");
    assert.equal(diagnostic.internalErrorName, "FlutterwaveRequestError");
    assert.equal(diagnostic.timeout, false);
    assert.equal(diagnostic.providerRejection, true);
    assert.match(diagnostic.providerMessage, /\[redacted-email\]/);
    assert.match(diagnostic.providerMessage, /\[redacted-phone\]/);
    assert.doesNotMatch(logs[0], new RegExp(env.FLW_SECRET_KEY));
    assert.doesNotMatch(logs[0], new RegExp(env.FLW_SECRET_HASH));
    assert.doesNotMatch(logs[0], new RegExp(validPayment.email));
    assert.doesNotMatch(logs[0], /\+255761932342/);
    assert.doesNotMatch(logs[0], /Authorization:|Bearer\s/i);
    assert.doesNotMatch(JSON.stringify(responseBody), /validation_error|invalid_customer|john@example\.com|\+255761932342/);
});

test("rejects a success-looking provider result when amount verification differs", async () => {
    const store = new MemoryStore();
    const txRef = "MY-12345678-1234-4123-8123-123456789abc";
    await store.setJSON(`payment:${txRef}`, {
        txRef,
        service: "business",
        amount: 500000,
        customerName: "John Doe",
        paymentMethod: "mobile_money",
        status: "pending",
        createdAt: "2026-09-26T10:00:00.000Z"
    });
    const request = new Request(`https://majaliwa.example/api/payment-status?tx_ref=${txRef}`, {
        headers: { Origin: env.SITE_URL }
    });
    const response = await getPaymentStatus(request, {
        env,
        store,
        fetchFlutterwave: async () => ({
            id: 123,
            tx_ref: txRef,
            amount: 500001,
            currency: "TZS",
            status: "successful",
            payment_type: "mobilemoneytz"
        })
    });
    assert.equal(response.status, 409);
    assert.equal((await response.json()).error.code, "verification_mismatch");
    assert.equal((await store.get(`payment:${txRef}`)).status, "pending");
});

test("requires a valid webhook signature before querying Flutterwave", async () => {
    let providerRequests = 0;
    const request = new Request("https://majaliwa.example/api/payment-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json", "verif-hash": "forged" },
        body: JSON.stringify({ event: "charge.completed", data: { id: 123 } })
    });
    const response = await handlePaymentWebhook(request, {
        env,
        store: new MemoryStore(),
        fetchFlutterwave: async () => {
            providerRequests += 1;
            return {};
        }
    });
    assert.equal(response.status, 401);
    assert.equal(providerRequests, 0);
});

test("accepts a signed pending webhook only after querying provider status", async () => {
    const store = new MemoryStore();
    const txRef = "MY-12345678-1234-4123-8123-123456789abc";
    await store.setJSON(`payment:${txRef}`, {
        txRef,
        service: "business",
        amount: 500000,
        customerName: "John Doe",
        paymentMethod: "mobile_money",
        status: "pending",
        createdAt: "2026-09-26T10:00:00.000Z"
    });
    let verificationRequests = 0;
    const request = new Request("https://majaliwa.example/api/payment-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json", "verif-hash": env.FLW_SECRET_HASH },
        body: JSON.stringify({ event: "charge.completed", data: { id: 123, tx_ref: txRef } })
    });
    const response = await handlePaymentWebhook(request, {
        env,
        store,
        fetchFlutterwave: async (path) => {
            verificationRequests += 1;
            assert.equal(path, "/transactions/123/verify");
            return { id: 123, tx_ref: txRef, amount: 500000, currency: "TZS", status: "pending" };
        }
    });
    assert.equal(response.status, 200);
    assert.equal(verificationRequests, 1);
    assert.equal((await store.get(`payment:${txRef}`)).status, "pending");
});

test("refuses missing or example-placeholder gateway credentials", () => {
    assert.throws(() => getPaymentConfig({ FLW_MODE: "sandbox", SITE_URL: env.SITE_URL }), { code: "payment_not_configured" });
    assert.throws(() => getPaymentConfig({ ...env, FLW_SECRET_KEY: "FLWSECK_TEST-REPLACE_WITH_YOUR_KEY" }), { code: "payment_not_configured" });
});

test("checkout endpoint fails closed before any provider request when credentials are absent", async () => {
    let providerRequests = 0;
    const response = await createPayment(createRequest(validPayment), {
        env: { FLW_MODE: "sandbox", SITE_URL: env.SITE_URL },
        store: new MemoryStore(),
        fetchFlutterwave: async () => {
            providerRequests += 1;
            return {};
        }
    });
    assert.equal(response.status, 503);
    assert.equal((await response.json()).error.code, "payment_not_configured");
    assert.equal(providerRequests, 0);
});
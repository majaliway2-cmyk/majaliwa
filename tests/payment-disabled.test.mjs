import test from "node:test";
import assert from "node:assert/strict";
import { createPayment } from "../netlify/functions/create-payment.mjs";
import { getPaymentStatus } from "../netlify/functions/payment-status.mjs";
import { handlePaymentWebhook } from "../netlify/functions/payment-webhook.mjs";
import { PAYMENTS_ENABLED } from "../netlify/functions/_payments.mjs";

test("payment endpoints stay unavailable even when gateway credentials are present", async () => {
    assert.equal(PAYMENTS_ENABLED, false);
    let providerRequests = 0;
    let storageRequests = 0;
    const dependencies = {
        env: {
            FLW_MODE: "production",
            FLW_SECRET_KEY: "FLWSECK-LIVE-TEST-ONLY",
            FLW_SECRET_HASH: "test-webhook-secret-value",
            SITE_URL: "https://majaliwa.example"
        },
        store: {
            async get() {
                storageRequests += 1;
                return null;
            }
        },
        fetchFlutterwave: async () => {
            providerRequests += 1;
            throw new Error("payment provider must not be called");
        }
    };
    const requests = [
        createPayment(new Request("https://majaliwa.example/api/create-payment", { method: "POST" }), dependencies),
        getPaymentStatus(new Request("https://majaliwa.example/api/payment-status?tx_ref=MY-test"), dependencies),
        handlePaymentWebhook(new Request("https://majaliwa.example/api/payment-webhook", { method: "POST" }), dependencies)
    ];

    for (const responsePromise of requests) {
        const response = await responsePromise;
        assert.equal(response.status, 503);
        const body = await response.json();
        assert.equal(body.error.code, "payment_unavailable");
        assert.doesNotMatch(JSON.stringify(body), /successful|checkoutUrl/i);
    }

    assert.equal(providerRequests, 0);
    assert.equal(storageRequests, 0);
});
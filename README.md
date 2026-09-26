# Majaliwa Yahaya Website

Four static pages: Home (`index.html`), Services, About, and Contact. The Contact page also contains the payment section. The site uses relative asset paths and can be deployed to Netlify or GitHub Pages without a build step.

## Contact inquiries

The contact page contains the supplied phone, email, and location. Phone, email, WhatsApp, and Maps links are live. The inquiry form validates its fields and opens a pre-addressed email draft at `adammajaliwa2004@gmail.com`, including the selected service, business type, budget, and message. The visitor must send the draft from their email app; a static website cannot send email by itself. For direct form delivery, connect a form service or backend and configure its recipient notifications.

Use HTTPS when publishing. Google Fonts and the site photography load from external hosts.

The English / Swahili selector saves its choice in browser storage. Analytics are not used. Contact form content is opened as an email draft; payment orders are stored server-side as described below.

## Payments: Flutterwave + Netlify

This integration uses Flutterwave's official hosted Standard checkout and Netlify Functions. It supports the documented TZS checkout options `mobilemoneytanzania` and `card`. Flutterwave's Tanzania mobile-money API documentation lists Airtel, Tigo, Halopesa, and Vodafone; hosted checkout only presents methods and operators enabled for the merchant account, which must be confirmed in the Flutterwave dashboard.

Netlify routes:

- `POST /api/create-payment` validates the form, generates a unique merchant reference, and requests a Flutterwave-hosted checkout. An atomic idempotency key avoids duplicate checkout creation on ordinary retries.
- `GET /api/payment-status?tx_ref=...&transaction_id=...` queries Flutterwave server-to-server. The API confirms status, merchant reference, TZS currency, exact amount, and selected payment type against the stored order before returning `successful`.
- `POST /api/payment-webhook` checks Flutterwave's `verif-hash` and independently verifies the transaction before updating the order. Repeated callbacks are safe to process.

The functions live in `netlify/functions/`; `netlify.toml` routes the `/api` paths. Netlify Blobs stores durable order references. No merchant credentials were supplied, so this site cannot initiate a real sandbox or production transaction yet. Until the required server variables are configured, the functions fail closed and never show a successful receipt.

### Configure sandbox

1. Create/verify a Flutterwave merchant account and enable TZS and the methods to accept.
2. Copy `.env.example` to `.env` for local Netlify Dev. Set your Flutterwave **test** secret key and a random webhook secret hash. Keep `.env` private and untracked.
3. Install dependencies with `npm install`; run locally with `npx netlify dev`.
4. In Flutterwave's dashboard, set the webhook URL to `https://YOUR-NETLIFY-DOMAIN/api/payment-webhook` and configure the same webhook hash in your server environment.
5. Complete sandbox checkout, status, and webhook tests before considering production. Sandbox transactions do not move real money and are not proof that production is connected.

### Configure Netlify and production

Add these in Netlify's UI under environment variables with **Functions** scope, then redeploy:

- `FLW_MODE=sandbox` until integration testing passes.
- `FLW_SECRET_KEY`: Flutterwave test secret key (`FLWSECK_TEST-...`). Use only on the server.
- `FLW_SECRET_HASH`: the random webhook secret configured in the Flutterwave dashboard.
- `SITE_URL`: the exact site origin, for example `https://your-domain.example`.

Only after merchant verification and successful sandbox testing, set `FLW_MODE=production` and replace the test key with a live Flutterwave secret key (`FLWSECK-...`, not a test key). Redeploy, then complete a real low-value payment before announcing live checkout. Never put credentials in HTML, CSS, frontend JavaScript, `netlify.toml`, or Git. The `.env.example` values are placeholders only.

The successful receipt includes customer name, service, amount, merchant reference, payment method, status, and provider transaction time. Redirect query parameters alone are never trusted. Phone and email are scrubbed from stored order records after checkout initiation; no card data, PIN, password, CVV, or OTP is requested by this site.

Official references: [Tanzania mobile money](https://developer.flutterwave.com/docs/tanzania.md), [Standard checkout](https://developer.flutterwave.com/docs/flutterwave-standard-1.md), [payment methods](https://developer.flutterwave.com/docs/payment-methods.md), [transaction verification](https://developer.flutterwave.com/docs/transaction-verification.md), [webhooks](https://developer.flutterwave.com/docs/webhooks.md), [Netlify Functions](https://docs.netlify.com/build/functions/overview.md), and [Netlify Blobs](https://docs.netlify.com/build/data-and-storage/netlify-blobs.md).
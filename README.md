# Majaliwa Yahaya Website

Four static pages: Home (`index.html`), Services, About, and Contact. The site uses relative asset paths and can be deployed to Netlify or GitHub Pages without a build step.

## Contact inquiries

The current phone number is `0745 652 466` and email address is `majaliway2@gmail.com`. The contact form sends the customer's name, phone, email, selected service, budget, and message to the Formspree endpoint configured in `contact.html`. WhatsApp contact links are disabled.

The form uses a direct `POST` action as a no-JavaScript fallback and AJAX submission for inline success and error messages. Formspree account settings control delivery notifications and the recipient. No API key or other secret is stored in frontend code.

The English / Swahili selector saves its choice in browser storage. Analytics are not used. Google Fonts and site photography load from external hosts. Use HTTPS when publishing.

## Payments

Online payments are disabled. The payment section explains that no payment can be started, and all payment API endpoints return an unavailable response without contacting a provider, regardless of server credentials. No checkout or successful payment message is shown.
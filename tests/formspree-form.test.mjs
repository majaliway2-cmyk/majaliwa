import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const contactHtml = await readFile(new URL("../contact.html", import.meta.url), "utf8");
const script = await readFile(new URL("../script.js", import.meta.url), "utf8");

test("contact form posts to the requested Formspree endpoint", () => {
    assert.match(contactHtml, /<form\b(?=[^>]*\bmethod="POST")(?=[^>]*\baction="https:\/\/formspree\.io\/f\/mppwygbr")[^>]*>/i);
    assert.doesNotMatch(contactHtml, /data-netlify|name="form-name"/i);
    assert.match(script, /const FORMSPREE_ENDPOINT = "https:\/\/formspree\.io\/f\/mppwygbr"/);
    assert.match(script, /fetch\(FORMSPREE_ENDPOINT,\s*\{[\s\S]*?body:\s*formData/);
});

test("every customer field is named and required", () => {
    for (const fieldName of ["name", "phone", "email", "service", "budget", "message"]) {
        assert.match(contactHtml, new RegExp(`<[^>]+\\bname="${fieldName}"[^>]*\\brequired\\b`, "s"));
    }
});

test("success is shown only after a successful Formspree response", () => {
    assert.match(script, /if\s*\(!response\.ok\)\s*\{/);
    assert.match(script, /status\.textContent = copy\.contactSent/);
    assert.match(script, /status\.textContent = copy\.contactSendError/);
});

test("budget field offers only the four requested ranges", () => {
    const budgetSelect = contactHtml.match(/<select name="budget"[^>]*>([\s\S]*?)<\/select>/)?.[1];
    assert.ok(budgetSelect);
    const values = [...budgetSelect.matchAll(/<option value="([^"]*)"/g)].map(([, value]) => value);
    assert.deepEqual(values, ["", "50000-100000", "100000-150000", "150000-200000", "250000-300000"]);
});

test("home page clearly explains the offer, pricing, and next steps", async () => {
    const homeHtml = await readFile(new URL("../index.html", import.meta.url), "utf8");
    assert.match(homeHtml, /Professional Websites That Help Your Business Grow/);
    assert.match(homeHtml, /modern,\s*responsive and affordable\s+websites for businesses, companies and individuals in Tanzania/i);
    assert.match(homeHtml, /Start Your Website/);
    assert.match(homeHtml, /Explore Services/);
    assert.match(homeHtml, /TSh\s+50,000\s+–\s+100,000/);
    assert.match(homeHtml, /TSh\s+100,000\s+–\s+150,000/);
    assert.match(homeHtml, /TSh\s+150,000\s+–\s+200,000/);
    assert.match(homeHtml, /TSh\s+250,000\s+–\s+300,000/);
    assert.match(homeHtml, /final\s+price depends on your requirements/i);
    assert.match(homeHtml, /Contact Me/);
    assert.match(homeHtml, /Discuss Your Requirements/);
    assert.match(homeHtml, /I Build Your Website/);
    assert.match(homeHtml, /Your Website Goes Live/);
    assert.match(homeHtml, /Request a Website Quote/);
    assert.match(homeHtml, /Ready to Take Your Business Online\?/);
});

test("home SEO and contact details are present without WhatsApp actions", async () => {
    const homeHtml = await readFile(new URL("../index.html", import.meta.url), "utf8");
    assert.match(homeHtml, /Website Design Tanzania \| Majaliwa Yahaya/);
    assert.match(homeHtml, /website developer in Tanzania/i);
    assert.match(homeHtml, /affordable business websites and modern website design/i);
    assert.match(homeHtml, /href="tel:0745652466">0745652466/);
    assert.match(homeHtml, /href="mailto:majaliway2@gmail\.com">majaliway2@gmail\.com/);
    assert.doesNotMatch(homeHtml, /https?:\/\/(?:wa\.me|api\.whatsapp\.com)/i);
});
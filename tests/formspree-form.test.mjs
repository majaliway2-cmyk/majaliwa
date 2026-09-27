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
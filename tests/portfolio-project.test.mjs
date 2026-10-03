import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const homeHtml = await readFile(new URL("../index.html", import.meta.url), "utf8");
const demoHtml = await readFile(new URL("../projects/restaurant-demo/index.html", import.meta.url), "utf8");
const demoScript = await readFile(new URL("../projects/restaurant-demo/script.js", import.meta.url), "utf8");
const netlifyConfig = await readFile(new URL("../netlify.toml", import.meta.url), "utf8");

test("home portfolio card links to the deployable restaurant demo route", () => {
    assert.match(homeHtml, /class="portfolio-card"\s+href="\/projects\/restaurant-demo\/"/);
    assert.match(homeHtml, /data-i18n="portfolioViewProject">View\s+Project/);
    assert.match(netlifyConfig, /\[build\][\s\S]*?publish\s*=\s*"\."/);
});

test("restaurant demo route includes its local styles and interaction script", async () => {
    assert.match(demoHtml, /<link rel="stylesheet" href="styles\.css">/);
    assert.match(demoHtml, /<script src="script\.js" defer><\/script>/);
    await readFile(new URL("../projects/restaurant-demo/styles.css", import.meta.url), "utf8");
    await readFile(new URL("../projects/restaurant-demo/script.js", import.meta.url), "utf8");
    assert.match(demoHtml, /PORTFOLIO DEMONSTRATION/);
});

test("restaurant demo provides complete English and Kiswahili translations", () => {
    const englishStart = demoScript.indexOf("    en: {");
    const swahiliStart = demoScript.indexOf("    sw: {");
    const dictionaryEnd = demoScript.indexOf("\n};", swahiliStart);
    assert.ok(englishStart >= 0 && swahiliStart > englishStart && dictionaryEnd > swahiliStart,
        "both language dictionaries should be defined");
    const englishKeys = new Set([...demoScript.slice(englishStart, swahiliStart).matchAll(/^\s{8}(\w+):/gm)].map(([, key]) => key));
    const swahiliKeys = new Set([...demoScript.slice(swahiliStart, dictionaryEnd).matchAll(/^\s{8}(\w+):/gm)].map(([, key]) => key));
    const referencedKeys = new Set();

    for (const [, attribute, value] of demoHtml.matchAll(/\b(data-i18n(?:-aria|-attr)?)="([^"]+)"/g)) {
        if (attribute === "data-i18n-attr") {
            for (const mapping of value.split(/\s+/)) referencedKeys.add(mapping.split(":")[1]);
        } else {
            referencedKeys.add(value);
        }
    }

    for (const key of referencedKeys) {
        assert.ok(englishKeys.has(key), `English translation missing: ${key}`);
        assert.ok(swahiliKeys.has(key), `Kiswahili translation missing: ${key}`);
    }

    assert.match(demoHtml, /<html lang="en">/);
    assert.match(demoHtml, /data-language="en" aria-pressed="true"/);
    assert.match(demoHtml, /data-language="sw" aria-pressed="false"/);
    assert.match(demoHtml, /id="event-form" novalidate/);
    assert.match(demoScript, /localStorage\.setItem\("majaliwa-restaurant-language"/);
    assert.match(demoScript, /formRequiredError:/);
    assert.match(demoScript, /formEmailError:/);
    assert.match(demoScript, /formSuccess:/);
});

import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const homeHtml = await readFile(new URL("../index.html", import.meta.url), "utf8");
const demoHtml = await readFile(new URL("../projects/restaurant-demo/index.html", import.meta.url), "utf8");
const demoScript = await readFile(new URL("../projects/restaurant-demo/script.js", import.meta.url), "utf8");
const beautyHtml = await readFile(new URL("../projects/beauty-studio/index.html", import.meta.url), "utf8");
const beautyScript = await readFile(new URL("../projects/beauty-studio/script.js", import.meta.url), "utf8");
const schoolHtml = await readFile(new URL("../projects/school-demo/index.html", import.meta.url), "utf8");
const schoolScript = await readFile(new URL("../projects/school-demo/script.js", import.meta.url), "utf8");
const netlifyConfig = await readFile(new URL("../netlify.toml", import.meta.url), "utf8");

test("home portfolio cards link to each demo and use local screenshot previews", async () => {
    assert.match(homeHtml, /class="portfolio-card"\s+href="\/projects\/restaurant-demo\/"/);
    assert.match(homeHtml, /class="portfolio-card"\s+href="\/projects\/beauty-studio\/"/);
    assert.match(homeHtml, /Salon &amp; Beauty Website/);
    assert.match(homeHtml, /Modern bilingual salon website designed for a professional beauty business, featuring services, gallery, appointment booking, contact information and English &amp; Kiswahili language support\./);
    assert.match(homeHtml, /src="\/projects\/beauty-studio\/preview\.jpg"/);
    assert.match(homeHtml, /alt="Preview of the Majaliwa Beauty Studio salon website"/);
    assert.match(homeHtml, /class="portfolio-card"\s+href="\/projects\/school-demo\/"/);
    assert.match(homeHtml, /src="\/projects\/school-demo\/preview\.jpg"/);
    assert.match(homeHtml, /alt="Preview of the Majaliwa International School website"/);
    assert.match(homeHtml, /A premium bilingual school website concept showcasing academics, admissions, student life and the school community\./);
    assert.match(homeHtml, /data-i18n="portfolioViewProject">View\s+Project/);
    assert.match(netlifyConfig, /\[build\][\s\S]*?publish\s*=\s*"\."/);
    const previewImage = await readFile(new URL("../projects/beauty-studio/preview.jpg", import.meta.url));
    assert.equal(previewImage.readUInt16BE(0), 0xffd8, "the local portfolio preview should be a JPEG");
    assert.ok(previewImage.length > 100_000, "the portfolio preview should retain high-resolution image detail");
    const schoolPreview = await readFile(new URL("../projects/school-demo/preview.jpg", import.meta.url));
    assert.equal(schoolPreview.readUInt16BE(0), 0xffd8, "the school portfolio preview should be a JPEG");
    assert.ok(schoolPreview.length > 100_000, "the school preview should retain high-resolution image detail");
});

test("school demo includes requested sections, safe demo content, and bilingual translation keys", async () => {
    assert.match(schoolHtml, /<title[^>]*>Majaliwa International School \| Quality Education in Tanzania<\/title>/);
    assert.match(schoolHtml, /property="og:title"/);
    assert.match(schoolHtml, /id="contact-form"/);
    assert.match(schoolHtml, /0745652466/);
    assert.match(schoolHtml, /majaliway2@gmail\.com/);
    assert.match(schoolHtml, /https:\/\/wa\.me\/255745652466/);
    assert.match(schoolHtml, /Demo Testimonial|data-i18n="demoTestimonial"/i);
    assert.match(schoolHtml, /Sample Fees|data-i18n="feesSampleLabel"/i);
    assert.match(schoolHtml, /data-lightbox/);
    assert.match(schoolHtml, /text019">Learning Today\. Leading Tomorrow\./);
    assert.match(schoolHtml, /text242">Learn More/);
    assert.match(schoolHtml, /text243">Contact Admissions/);
    assert.match(schoolHtml, /text244">Request Fee Information/);
    assert.match(schoolHtml, /text254">Discover a learning environment designed to inspire curiosity, confidence and lifelong growth\./);
    assert.match(schoolHtml, /text255">Contact Us/);
    assert.match(schoolHtml, /text256">© 2026 Majaliwa International School\. Demo Website\./);
    assert.match(schoolHtml, /class="footer-language"/);
    assert.match(schoolHtml, /data-i18n="text257">Language/);
    assert.equal([...schoolHtml.matchAll(/class="teacher-card"/g)].length, 4);
    assert.equal([...schoolHtml.matchAll(/class="event-row"/g)].length, 5);
    assert.equal([...schoolHtml.matchAll(/class="step-index"/g)].length, 4);
    for (const item of ["Home", "About School", "Academics", "Teachers", "Gallery", "Admissions", "Fees", "Contact"]) {
        assert.ok(schoolHtml.includes(`>${item}</a>`), `School navigation should include ${item}`);
    }
    assert.match(schoolScript, /localStorage\.setItem/);

    const englishStart = schoolScript.indexOf("    en: {");
    const swahiliStart = schoolScript.indexOf("    sw: {");
    const dictionaryEnd = schoolScript.indexOf("\n};", swahiliStart);
    assert.ok(englishStart >= 0 && swahiliStart > englishStart && dictionaryEnd > swahiliStart,
        "both school-language dictionaries should be defined");
    const englishKeys = new Set([...schoolScript.slice(englishStart, swahiliStart).matchAll(/^\s{8}(\w+):/gm)].map(([, key]) => key));
    const swahiliKeys = new Set([...schoolScript.slice(swahiliStart, dictionaryEnd).matchAll(/^\s{8}(\w+):/gm)].map(([, key]) => key));
    const referencedKeys = new Set();

    for (const [, attribute, value] of schoolHtml.matchAll(/\b(data-i18n(?:-aria|-attr)?)="([^"]+)"/g)) {
        if (attribute === "data-i18n-attr") {
            for (const mapping of value.split(/\s+/)) referencedKeys.add(mapping.split(":")[1]);
        } else {
            referencedKeys.add(value);
        }
    }

    for (const key of referencedKeys) {
        assert.ok(englishKeys.has(key), `School English translation missing: ${key}`);
        assert.ok(swahiliKeys.has(key), `School Kiswahili translation missing: ${key}`);
    }
});

test("beauty studio demo is a standalone, accessible appointment experience", async () => {
    assert.match(beautyHtml, /<title data-i18n="pageTitle">Majaliwa Beauty Studio \| Dar es Salaam<\/title>/);
    assert.match(beautyHtml, /property="og:title"/);
    assert.match(beautyHtml, /rel="icon" href="favicon\.svg"/);
    assert.match(beautyHtml, /href="styles\.css"/);
    assert.match(beautyHtml, /src="script\.js" defer/);
    assert.match(beautyHtml, /Beauty, Confidence &amp; Style/);
    assert.match(beautyHtml, /id="appointment-form"/);
    assert.match(beautyHtml, /name="date" type="date" required/);
    assert.match(beautyHtml, /name="time" required/);
    assert.match(beautyHtml, /id="form-status" role="status"/);
    assert.equal([...beautyHtml.matchAll(/class="service-card"/g)].length, 10);
    assert.equal([...beautyHtml.matchAll(/DEMO TESTIMONIAL/g)].length, 3);
    assert.match(beautyHtml, /Fictional business concept|FICTIONAL BUSINESS CONCEPT/);
    assert.match(beautyHtml, /href="tel:0745652466"/);
    assert.match(beautyHtml, /href="mailto:majaliway2@gmail\.com"/);
    assert.match(beautyHtml, /https:\/\/wa\.me\/255745652466/);
    assert.match(beautyHtml, /https:\/\/majaliwa\.netlify\.app\//);
    assert.match(beautyScript, /appointmentForm\.reportValidity\(\)/);
    assert.match(beautyScript, /mailto:majaliway2@gmail\.com/);
    assert.match(beautyScript, /data-book-service/);
    assert.match(beautyHtml, /data-language="en"/);
    assert.match(beautyHtml, /data-language="sw"/);
    assert.match(beautyScript, /localStorage\.setItem\("majaliwa-beauty-language"/);
    await readFile(new URL("../projects/beauty-studio/styles.css", import.meta.url), "utf8");
    assert.match(netlifyConfig, /\[build\][\s\S]*?publish\s*=\s*"\."/);
});

test("beauty studio has complete English and Kiswahili translation coverage", () => {
    const englishStart = beautyScript.indexOf("    en: {");
    const swahiliStart = beautyScript.indexOf("    sw: {");
    const dictionaryEnd = beautyScript.indexOf("\n};", swahiliStart);
    assert.ok(englishStart >= 0 && swahiliStart > englishStart && dictionaryEnd > swahiliStart,
        "both language dictionaries should be defined");
    const englishKeys = new Set([...beautyScript.slice(englishStart, swahiliStart).matchAll(/^\s{8}(\w+):/gm)].map(([, key]) => key));
    const swahiliKeys = new Set([...beautyScript.slice(swahiliStart, dictionaryEnd).matchAll(/^\s{8}(\w+):/gm)].map(([, key]) => key));
    const referencedKeys = new Set();

    for (const [, attribute, value] of beautyHtml.matchAll(/\b(data-i18n(?:-aria|-attr)?)="([^"]+)"/g)) {
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
    assert.match(beautyScript, /localStorage\.getItem\("majaliwa-beauty-language"/);
    assert.match(beautyScript, /validationRequired:/);
    assert.match(beautyScript, /validationEmail:/);
    assert.match(beautyScript, /validationDate:/);
    assert.match(beautyScript, /formSuccess:/);
    assert.match(beautyScript, /field\.validity\.typeMismatch/);
    assert.match(beautyScript, /menuButton\.getAttribute\("aria-expanded"\) === "true" \? "menuClose" : "menuOpen"/);
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

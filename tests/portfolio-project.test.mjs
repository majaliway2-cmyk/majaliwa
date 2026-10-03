import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const homeHtml = await readFile(new URL("../index.html", import.meta.url), "utf8");
const demoHtml = await readFile(new URL("../projects/restaurant-demo/index.html", import.meta.url), "utf8");
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

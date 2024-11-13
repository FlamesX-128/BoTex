import { readFileSync } from "fs";
import { resolve } from "path";

import { chromium } from "@playwright/test";

const browserPath = "/usr/bin/brave-browser";
const browser = await chromium.launch({
    executablePath: browserPath,
});

const template = readFileSync(
    resolve(process.cwd(), "assets", "template.html"), 'utf-8'
);

/**
 * 
 * @param {string} expression 
 * @returns {Promise<Buffer>}
 */
async function render(expression) {
    const page = await browser.newPage();

    try {
        await page.setContent(template);

        await page.evaluate((expression) => {
            katex.render(expression, document.querySelector("#katex"));
        }, expression);

        await page.waitForSelector("#katex");

        const image = await (await page.$("#katex")).screenshot({
            omitBackground: true,
            type: "png"
        });

        return image;
    } finally {
        await page.close();
    }
}

export {
    render
}

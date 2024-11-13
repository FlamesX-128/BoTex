const fs = require("fs");
const path = require("path");

const { chromium } = require("@playwright/test");

const browserPath = "/usr/bin/brave-browser";
const template = fs.readFileSync(
    path.resolve(process.cwd(), "assets", "template.html"), 'utf-8'
);

/**
 * 
 * @param {string} expression 
 * @returns {Promise<Buffer>}
 */
async function render(expression) {
    const browser = await chromium.launch({
        executablePath: browserPath,
    });
    const page = await browser.newPage();

    try {
        await page.setContent(template);

        await page.evaluate((expression) => {
            katex.render(expression, document.querySelector("#katex"), {
                throwOnError: true
            });
        }, expression);

        await page.waitForSelector("#katex");

        const image = await (await page.$("#katex")).screenshot({
            omitBackground: true,
            type: "png"
        });

        return image;
    } finally {
        await page.close();
        await browser.close();
    }
}

module.exports = {
    render
}

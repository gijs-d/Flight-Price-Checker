const puppeteer = require('puppeteer');

class Bowser {
    page;
    browser;

    constructor(url) {
        if (url) { this.url = url; }
    }

    async load(headless = true) {
        this.browser = await puppeteer.launch({ headless, });
    }

    async close() {
        await this.browser.close();
    }

    isConnected() {
        return this.browser?.isConnected();
    }

    async reloadPage(page) {
        await page.reload();
    }

    async openPage(url) {
        const page = await this.browser.newPage();
        await page.goto(url);
        return page;
    }

    async clickElement(page, selector, lenght) {
        const element = await this.isElementVisible(page, selector);
        if (element) {
            await page.click(selector, lenght ? { delay: lenght } : {});
        }
        return element;
    }

    async getText(page, selector) {
        const element = await this.isElementVisible(page, selector);
        let value = undefined;
        if (element) {
            const elem = await page.$(selector);
            value = await elem.evaluate(el => el.textContent);
        }
        return value || element;
    }

    async waitTillGone(page, selector) {
        let visible = await this.isElementVisible(page, selector);
        while (visible) {
            visible = await this.isElementVisible(page, selector);
        }
    }

    async waitTillVisible(page, selector) {
        let visible = await this.isElementVisible(page, selector);
        while (!visible) {
            visible = await this.isElementVisible(page, selector);
        }
    }

    async isElementVisible(page, cssSelector) {
        let visible = true;
        try {
            await page
                .$eval(cssSelector, () => visible = true)
                .catch((e) => { visible = false; });
        } catch (e) {
            visible = false;
        }
        return visible;
    }

}

module.exports = Bowser;

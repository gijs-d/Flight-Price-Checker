const Bowser = require('./lib/bowser');
const bowser = new Bowser('');
const fs = require('fs');
const dataFile = 'output/assets/js/data.js';
const { checkDays, citys, urls, headless } = require('./config');
let first = true;

process.on('unhandledRejection', async (e) => {
    console.error(`Unhandled Rejection: ${e}`);
    if (bowser.isConnected()) { await bowser.close(); }
    process.exit(1);
});

process.on('SIGINT', async () => {
    console.log(' Closing browser...');
    await bowser.close();
    process.exit();
});

reload();

async function reload() {
    try {
        await init();
    } catch (e) {
        console.error(e);
        console.log('reload');
        await new Promise(r => setTimeout(r, 5000));
        reload();
    }
}

async function init() {
    if (first) {
        first = false;
        await bowser.load(headless);
        const tempPage = await bowser.openPage('https://www.bing.com');
        await tempPage.close();
    }
    let skip = 0;
    if (checkDays.start) {
        let days = new Date(checkDays.start).getTime() - new Date().getTime();
        days = Math.floor(days / (1000 * 60 * 60 * 24));
        skip = days > 0 ? days : 0;
    }
    const result = await Promise.all([
        loadTrip(checkDays.to, true, skip),
        loadTrip(checkDays.from, false, skip + checkDays.stay)
    ]);
    printResults(result);
    await fs.promises.writeFile(dataFile, `const data = ${JSON.stringify([...result, citys])} ;`);
    process.exit(1);
}

function printResults(result) {
    const printDiv = (name) => console.log(`${Array(37).join('-')}\n\n\t ${name}\n\n`);
    const [to, from] = result;
    printDiv('10 cheapest to');
    printTop10(to, 'to');
    printDiv('10 cheapest from');
    printTop10(from, 'from');
    printDiv('all to');
    for (let i = 0; i < to.length; i++) {
        console.log(to[i]);
    }
    printDiv('all from');
    for (let i = 0; i < from.length; i++) {
        console.log(from[i]);
    }
}

function printTop10(arr) {
    const cheapestPriceto = [...arr];
    cheapestPriceto.sort();
    for (let i = 0; i < 10; i++) {
        if (cheapestPriceto[i]) {
            console.log(i + 1, cheapestPriceto[i]);
        }
    }
}

function makeDay(today) {
    const pad = (nr) => String(nr).padStart(2, '0');
    return `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
}

async function loadTrip(days, to = true, stay = 0) {
    console.log(`loadTrip \t ${to ? 'to' : 'from'} \t start`);
    const prices = [];
    const today = new Date();
    today.setDate(today.getDate() + stay);
    for (let i = 0; i < days; i++) {
        const day = makeDay(today);
        today.setDate(today.getDate() + 1);
        prices[i] = await checkDay(day, to);
        console.log(`loadTrip \t ${to ? 'to' : 'from'} \t loaded ${i + 1}/${days}`);
    }
    return prices;
}

async function checkDay(day, to = true) {
    const cheapest = 'div.bt-custom-pivot-item:nth-child(2) > div:nth-child(1) > div:nth-child(2)';
    const loadBar = '.ms-ProgressIndicator-itemProgress';
    const privbtn = '#bnp_btn_accept';
    let result, timeout, page;
    while (!result) {
        try {
            await new Promise(async (resolve, reject) => {
                clearTimeout(timeout);
                timeout = setTimeout(reject, 10000);
                page = await bowser.openPage(urls[to ? 'to' : 'from'](day));
                await new Promise(wait => setTimeout(wait, 2000));
                const privacy = await bowser.isElementVisible(page, privbtn);
                if (privacy) {
                    await bowser.clickElement(page, privbtn);
                }
                await bowser.waitTillVisible(page, cheapest);
                if (await bowser.isElementVisible(page, loadBar)) {
                    await bowser.waitTillGone(page, loadBar);
                }
                await new Promise(wait => setTimeout(wait, 2000));
                if (await bowser.isElementVisible(page, cheapest)) {
                    const res = await bowser.getText(page, cheapest);
                    clearTimeout(timeout);
                    result = `${res.replaceAll('.', '')} - ${day}`;
                    resolve();
                }
            });
        } catch {
            clearTimeout(timeout);
        }
        try {
            await page.close();
        } catch { /* empty */ }
    }
    return result;
}
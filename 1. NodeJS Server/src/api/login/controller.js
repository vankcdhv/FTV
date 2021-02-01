const puppeteer = require("puppeteer");
const cheerio = require('cheerio');
const requestHandler = require('../common/request');
const Logic = require('./logic');
const profileCtrl = require('../profile/controller');

module.exports = {
    sleep: (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    getPuppeteer: (req, res) => {
        let header = req.headers;
        (async () => {
            const browser = await puppeteer.launch({
                headless: false,
                devtools: false
            });
            const page = await browser.newPage();

            await page.setRequestInterception(true);
            page.on('request', request => {
                // Do nothing in case of non-navigation requests.
                if (!request.isNavigationRequest()) {
                    request.continue();
                    return;
                }
                // Add a new header for navigation request.
                const headers = request.headers();
                //headers['cookie'] = header.cookie;
                request.continue({
                    headers
                });
            });

            await page.goto('http://fap.fpt.edu.vn/');

            await page.select('#ctl00_mainContent_ddlCampus', '3');

            const newPagePromise = new Promise(x => browser.once('targetcreated', target => x(target.page()))); // declare promise
            await page.evaluate(() => {
                document.querySelector('div.abcRioButtonContentWrapper').click();
            });

            const newPage = await newPagePromise; // open new tab /window, 


            //await module.exports.sleep(5000);

            let pages = await browser.pages();

            //let aHandle = await pages[1].evaluateHandle(() => document.body);

            await pages[2].type('#identifierId', 'vanlthe130820@fpt.edu.vn', {
                delay: 200
            });
            await module.exports.sleep(2000);

            await pages[2].evaluate(() => {
                document.querySelector('div.VfPpkd-Jh9lGc').click();
            });

            await module.exports.sleep(3000);

            await pages[2].type('input[name=password]', 'codera3k48', {
                delay: 200
            });
            await module.exports.sleep(2000);

            await pages[2].evaluate(() => {
                document.querySelector('div.VfPpkd-Jh9lGc').click();
            });

            await module.exports.sleep(5000);

            await pages[1].reload();

            await module.exports.sleep(2000);

            let cookies = await pages[1].cookies();
            let cookie = '';
            for (let i = 0; i < cookies.length; i++) {
                if (cookies[i].name === 'ASP.NET_SessionId') {
                    cookie = 'ASP.NET_SessionId=' + cookies[i].value;
                }
            }
            console.log(cookie);
            res.json(cookie);
            await browser.close();
        })();
    },
};
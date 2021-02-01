const puppeteer = require("puppeteer");
const cheerio = require('cheerio');
const requestHandler = require('../common/request');
const Logic = require('./logic');
const profileCtrl = require('../profile/controller');

module.exports = {
    chechkSession(req) {
        return new Promise((resolve, reject) => {
            let res = {
                json: (object) => {
                    if (object && object.student && object.student.id) {
                        let studentid = object.student.id;
                        resolve(studentid);
                    } else {
                        reject({
                            code: 'TIME_OUT',
                            message: 'Session time out, please login again!',
                            session: req.headers.Cookie ? req.headers.Cookie.toString() : req.headers.cookie.toString()
                        })
                    }
                },
            }
            profileCtrl.get(req, res);
        });

    },
    get: (req, res) => {
        module.exports.chechkSession(req)
            .then(studentID => {
                let header = req.headers;
                let url = "http://fap.fpt.edu.vn/Report/ScheduleOfWeek.aspx";

                requestHandler.httpRequest(url, header)
                    .then(body => {
                        let logic = new Logic(body);
                        $ = cheerio.load(body);
                        let timeTable = logic.getTimeTable(studentID);
                        res.json(timeTable);
                    })
                    .catch(reason => {
                        console.log(reason);
                        res.json(null);
                    })
            })
            .catch(reason => {
                res.json(reason);
            });


    },
    getPuppeteer: (req, res) => {
        let header = req.headers;

        (async () => {
            const browser = await puppeteer.launch({
                headless: false,
                devtools: true
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
                headers['cookie'] = header.cookie;
                request.continue({
                    headers
                });
            });

            await page.goto('http://fap.fpt.edu.vn/Report/ScheduleOfWeek.aspx');

            //await page.select('#ctl00_mainContent_drpSelectWeek', '31');

            let content = await page.content();
            res.render('home', {
                html: content
            });
            //await browser.close();
        })();
    },
};
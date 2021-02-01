const requestHandler = require('./request');
const request = require('request');
module.exports = {

    doNotSleepHeroku: () => {
        sleep = (ms) => {
            return new Promise(resolve => setTimeout(resolve, ms));
        };
        (async () => {
            let cookieString = 'ASP.NET_SessionId=hdvwsyqbtsjctsg4ynggo1u0';
            let cookie = request.cookie(cookieString);
            let headers = {
                'Cookie': cookie
            }
            let url = 'https://test-fap-api.herokuapp.com/heroku'

            while (true) {
                requestHandler.httpRequest(url, headers, 'GET', 1);
                await sleep(600000);
            }
        })();
    }
}
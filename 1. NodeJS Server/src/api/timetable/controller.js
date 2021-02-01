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

};
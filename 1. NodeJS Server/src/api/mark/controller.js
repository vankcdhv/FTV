const cheerio = require('cheerio');
const logic = require('./logic');
const requestHandler = require('../common/request');
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
    getListTerm: (req, res) => {
        module.exports.chechkSession(req)
            .then(studentID => {
                let header = req.headers;
                let uri = "http://fap.fpt.edu.vn/Grade/StudentGrade.aspx";
                requestHandler.httpRequest(uri, header)
                    .then(body => {
                        $ = cheerio.load(body);
                        listTerm = logic.getListTerm(body);
                        res.json({
                            listTerm: listTerm,
                        })
                    })
                    .catch(reason => {
                        console.log(reason);
                        res.json(reason);
                    });
            })
            .catch(reason => {
                res.json(reason)
            })
    },
    getListCourse: (req, res) => {
        module.exports.chechkSession(req)
            .then(studentID => {
                let header = req.headers;
                let uri = "http://fap.fpt.edu.vn/Grade/StudentGrade.aspx?term=" + req.params.term;

                requestHandler.httpRequest(uri, header)
                    .then(body => {
                        $ = cheerio.load(body);
                        let listTerm = logic.getListTerm(body);
                        let listCourse = logic.getListCourese(body, listTerm.length);
                        res.json({
                            listCourse: listCourse
                        })
                    })
                    .catch(reason => {
                        console.log(reason);
                        res.json(reason);
                    });
            })
            .catch(reason => {
                res.json(reason)
            })
    },
    getCourse: (req, res) => {
        module.exports.chechkSession(req)
            .then(studentID => {
                let header = req.headers;
                let term = req.params.term;
                let course = req.params.course;
                let uri = "http://fap.fpt.edu.vn/Grade/StudentGrade.aspx?course=" + course;
                let haveNotify = req.headers.havenotify ? req.headers.havenotify : null;
                requestHandler.httpRequest(uri, header)
                    .then(body => {
                        $ = cheerio.load(body);
                        let mark = logic.getMarkOfCourse(body, studentID, course, haveNotify);
                        res.json({
                            mark: mark
                        })
                    })
                    .catch(reason => {
                        console.log(reason);
                        res.json(reason);
                    });
            })
            .catch(reason => {
                res.json(reason)
            })
    }
}
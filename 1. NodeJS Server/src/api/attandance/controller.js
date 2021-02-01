const cheerio = require('cheerio');
const logic = require('./logic');
const requestHandler = require('../common/request');
const fapLogic = require('../fap/logic');

module.exports = {
    getListTerm: (req, res) => {
        fapLogic.chechkSession(req)
            .then(studentID => {
                let header = req.headers;
                let url = 'http://fap.fpt.edu.vn/Report/ViewAttendstudent.aspx?term=x'

                requestHandler.httpRequest(url, header)
                    .then(body => {
                        $ = cheerio.load(body);
                        res.json({
                            listTerm: logic.getListTerm(body)
                        })
                    })
                    .catch(reason => {

                    })
            })
            .catch(reason => {
                res.json(reason)
            })
    },
    getListCourse: (req, res) => {
        fapLogic.chechkSession(req)
            .then(studentID => {
                let header = req.headers;
                let url = 'http://fap.fpt.edu.vn/Report/ViewAttendstudent.aspx?term=' + req.params.term + '&course=0';

                requestHandler.httpRequest(url, header)
                    .then(body => {
                        $ = cheerio.load(body);
                        let listTerm = logic.getListTerm(body);
                        res.json({
                            listCourse: logic.getListCourse(body, listTerm.length + 1)
                        })
                    })
                    .catch(reason => {

                    })
            })
            .catch(reason => {
                res.json(reason)
            })
    },
    getAttendanceReport: (req, res) => {
        fapLogic.chechkSession(req)
            .then(studentID => {
                let header = req.headers;
                let url = 'http://fap.fpt.edu.vn/Report/ViewAttendstudent.aspx?term=' + req.params.term + '&course=' + req.params.course;
                let haveNotify = req.headers.havenotify ? req.headers.havenotify : null;

                requestHandler.httpRequest(url, header)
                    .then(body => {
                        $ = cheerio.load(body);
                        res.json({
                            report: logic.getAttendanceReport(body, studentID, req.params.course, haveNotify)
                        })
                    })
                    .catch(reason => {

                    })
            })
            .catch(reason => {
                res.json(reason)
            })
    }
}
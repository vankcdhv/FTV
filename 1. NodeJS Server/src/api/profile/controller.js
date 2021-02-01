const cheerio = require("cheerio");

const Logic = require('./logic');
const fapLogic = require('../fap/logic');
const requestHandler = require('../common/request');

module.exports = {
    get: (req, res) => {
        let headers = req.headers;
        console.log('------------------------------------------');
        console.log('Header request', headers);
        let url = 'http://fap.fpt.edu.vn/User/Profile.aspx';
        requestHandler.httpRequest(url, headers)
            .then(body => {
                let logic = new Logic(body);
                $ = cheerio.load(body);

                let object = logic.getProfile();

                if (object && object.student && object.student.id) {
                    res.json(object);
                } else {
                    res.json({
                        code: 'TIME_OUT',
                        message: 'Session time out, please login again!',
                        session: req.headers.Cookie ? req.headers.Cookie.toString() : req.headers.cookie.toString()
                    })
                }
            })
            .catch(reason => {
                console.log(reason);
                res.json(null);
            });
    },
    getStudentID: (req, res) => {
        let headers = req.headers;
        console.log('------------------------------------------');
        console.log('Header request', headers);
        let url = 'http://fap.fpt.edu.vn/User/Profile.aspx';
        requestHandler.httpRequest(url, headers)
            .then(body => {
                let logic = new Logic(body);
                $ = cheerio.load(body);

                let object = logic.getStudentID();

                if (object && object.student && object.student.id) {
                    res.json(object);
                } else {
                    res.json({
                        code: 'TIME_OUT',
                        message: 'Session time out, please login again!',
                        session: req.headers.Cookie ? req.headers.Cookie.toString() : req.headers.cookie.toString()
                    })
                }
            })
            .catch(reason => {
                console.log(reason);
                res.json(null);
            });
    }

}
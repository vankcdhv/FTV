const requestHandler = require('./request');

const request = require('request');
const sessionDB = require('../database/sessiondb');
const studentDB = require('../database/studendb');

const fapLogic = require('../fap/logic');
const chatBotLogic = require('../chatbot/logic');
const chatbot = require('../../../config/chatbot');
const {
    compile
} = require('ejs');

module.exports = {

    keepSession: () => {
        let sql = "SELECT * FROM HeaderKeepSession";
        sleep = (ms) => {
            return new Promise(resolve => setTimeout(resolve, ms));
        };
        (async () => {
            let count = 1;
            while (true) {
                let result = [];

                sessionDB.getAllSession()
                    .then(response => {
                        result = response;
                        for (let i = 0; i < result.length; i++) {
                            var cookieString = result[i].session;

                            let headers = {
                                'Cookie': cookieString
                            }
                            req = {
                                headers: headers
                            };
                            fapLogic.chechkSession(req)
                                .then(studentID => {
                                })
                                .catch(reason => {
                                    if (reason.code && reason.code == 'TIME_OUT') {
                                        let session = reason.session;
                                        sessionDB.getSessionByHeader(session)
                                            .then(res => {
                                                studentDB.getStudentByID(res[0].studentid)
                                                    .then(student => {
                                                        if (student[0].Recipient) {
                                                            chatBotLogic.sendMessageSessionTimeOut(student[0].Recipient);
                                                        }
                                                    })
                                                    .catch(reason => {
                                                        console.log(reason);
                                                    });
                                                sessionDB.removeHeader(session)
                                                    .then(res => {
                                                        console.log('Delete session ' + session);
                                                    })
                                                    .catch(reason => {
                                                        console.log(reason);
                                                    });

                                            })
                                            .catch(reason => {
                                                console.log(reason);
                                            });
                                    } else {
                                        console.log(reason);
                                    }
                                })

                        }
                    })
                    .catch(reason => {
                        console.log(reason);
                    });
                //console.log(count);
                await sleep(50000);
                count++;

            }
        })();
    },


}
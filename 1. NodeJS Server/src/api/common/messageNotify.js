const requestHandler = require("./request");

const request = require("request");
const sessionDB = require("../database/sessiondb");
const studentDB = require("../database/studendb");
const timeTableCtrl = require("../timetable/controller");
const markCtrl = require("../mark/controller");
const attendanceCtrl = require("../attandance/controller");

const fapLogic = require("../fap/logic");
const chatBotLogic = require("../chatbot/logic");
const chatbot = require("../../../config/chatbot");
const timetabledb = require("../database/timetabledb");

module.exports = {
    sleep: (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    },
    notifyOldTimeTable: (student) => {
        let recipient = student.Recipient;
        chatBotLogic.sendMessage(recipient, "Lịch học có thể không đúng, Chưa cập nhật vì phiên đăng nhập đã hết hạn!");
        let currentDay = new Date().getDay();
        currentDay = currentDay === 0 ? 7 : currentDay;
        currentDay += 2;
        currentDay = currentDay === 9 ? 2 : currentDay;

        timetabledb.getTimeTableByDay(student.id, currentDay)
            .then(listSlot => {
                let isFree = true;
                for (let i = 0; i < listSlot.length; i++) {
                    if (listSlot[i].course != null) {
                        chatBotLogic.sendMessageTimeTable(recipient, listSlot[i]);
                        isFree = false;
                    }
                }
                if (isFree) {
                    chatBotLogic.sendMessage(recipient, "Nay nghỉ nhó bạn ê! Dậy sớm tập thể dục thể thao đi bạn!");
                }

            })
            .catch(reason => console.log(reason));
    },
    timeTableNotify: (student) => {
        let currentTime = new Date().toLocaleString().replace(",", "").replace(/:.. /, " ");
        currentTime = currentTime.split(" ")[1] + " " + currentTime.split(" ")[2];
        console.log("Thread notify timetable:", currentTime + ': ' + student.id + ' - ' + student.Recipient);
        sessionDB.getSessionByStudentID(student.id)
            .then(session => {
                if (session && session.length > 0) {
                    session = session[0];
                    var cookieString = session.session;
                    let cookie = request.cookie(cookieString);
                    let headers = {
                        Cookie: cookie,
                        havenotify: "true",
                    };
                    let req = {
                        headers: headers,
                    };
                    fapLogic.chechkSession(req)
                        .then(studentID => {
                            timeTableCtrl.get(req, {
                                json: (timetable) => {
                                    let currentDay = new Date().getDay();
                                    currentDay = currentDay === 0 ? 7 : currentDay;
                                    currentDay += 2;
                                    currentDay = currentDay === 9 ? 2 : currentDay;
                                    let listSlot = [];
                                    for (let i = 0; i < timetable.length; i++) {
                                        listSlot.push(timetable[i][currentDay - 2]);
                                    }
                                    let recipient = student.Recipient;
                                    let isFree = true;
                                    console.log(currentDay, listSlot);
                                    for (let i = 0; i < listSlot.length; i++) {
                                        if (listSlot[i].course != null) {
                                            chatBotLogic.sendMessageTimeTable(recipient, listSlot[i]);
                                            isFree = false;
                                        }
                                    }
                                    if (isFree) {
                                        chatBotLogic.sendMessage(recipient, "Nay nghỉ nhó bạn ê! Dậy sớm tập thể dục thể thao đi bạn!");
                                    }
                                }
                            })

                        })
                        .catch(reason => {
                            if (reason.code && reason.code === 'TIME_OUT') {
                                module.exports.notifyOldTimeTable(student);
                            }
                        })
                } else {
                    module.exports.notifyOldTimeTable(student);
                }
            })
            .catch(reason => console.log(reason));
    },
    getMarkOfCourse: (req, course) => {
        return new Promise((resolve, reject) => {
            let newReq = req;
            newReq.params["course"] = course.course;

            markCtrl.getCourse(newReq, {
                json: (listMark) => {
                    listMark = listMark.mark;
                    resolve(listMark);
                },
            });
        });
    },
    markNotify: (req) => {
        attendanceCtrl.getListTerm(req, {
            json: (object) => {
                let listTerm = object.listTerm;
                if (listTerm && listTerm.length > 0) {
                    req["params"] = {};

                    req.params["term"] = listTerm[listTerm.length - 1].name;

                    markCtrl.getListCourse(req, {
                        json: (listCourse) => {
                            (async () => {
                                listCourse = listCourse.listCourse;
                                if (listCourse && listCourse.length > 0) {
                                    for (let i = 0; i < listCourse.length; i++) {
                                        let course = listCourse[i];
                                        await module.exports.getMarkOfCourse(req, course);
                                    }
                                }
                            })();
                        },
                    });
                }
            },
        });
    },
    getAttendanceOfCourse: (req, course) => {
        return new Promise((resolve, reject) => {
            let newReq = req;
            newReq.params["course"] = course.course;
            attendanceCtrl.getAttendanceReport(newReq, {
                json: (report) => {
                    report = report.report;
                    resolve(report);
                },
            });
        });
    },
    attendanceNotify: (req) => {
        attendanceCtrl.getListTerm(req, {
            json: (object) => {
                let listTerm = object.listTerm;
                if (listTerm && listTerm.length > 0) {
                    req["params"] = {};

                    req.params["term"] = listTerm[listTerm.length - 1].code;
                    attendanceCtrl.getListCourse(req, {
                        json: (listCourse) => {
                            (async () => {
                                listCourse = listCourse.listCourse;
                                if (listCourse && listCourse.length > 0) {
                                    for (let i = 0; i < listCourse.length; i++) {
                                        let course = listCourse[i];
                                        await module.exports.getAttendanceOfCourse(req, course);
                                    }
                                }
                            })();
                        },
                    });
                }
            },
        });
    },
    notify: () => {
        (async () => {
            while (true) {
                let result = [];
                sessionDB.getAllSession()
                    .then((response) => {
                        result = response;
                        for (let i = 0; i < result.length; i++) {
                            var cookieString = result[i].session;
                            let cookie = request.cookie(cookieString);
                            let headers = {
                                Cookie: cookie,
                                havenotify: "true",
                            };
                            req = {
                                headers: headers,
                            };
                            module.exports.markNotify(req);
                            module.exports.attendanceNotify(req);
                            console.log("Thread notify mark and attendance");
                        }
                    })
                    .catch((reason) => {
                        console.log(reason);
                    });
                await module.exports.sleep(600000);
            }
        })();
        (async () => {
            while (true) {
                let currentTime = new Date().toLocaleString().replace(",", "").replace(/:.. /, " ");
                currentTime = currentTime.split(" ")[1] + " " + currentTime.split(" ")[2];
                console.log(currentTime);
                if (currentTime === "11:30 PM") {
                    let result = [];
                    studentDB.getAllStudent()
                        .then((listStudent) => {
                            for (let i = 0; i < listStudent.length; i++) {
                                if (listStudent[i].Recipient) {
                                    module.exports.timeTableNotify(listStudent[i]);
                                }
                            }
                        })
                        .catch((reason) => console.log(reason));
                }
                await module.exports.sleep(60000);
            }
        })();
    },
};
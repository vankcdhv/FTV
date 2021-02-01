const requestHandler = require('../common/request');
const utils = require('../common/utils');

const studentDB = require('../database/studendb');
const profileDB = require('../database/profiledb');
const parentDB = require('../database/parentdb');

const request = require('request');
const mail = require('../common/mail');
const markCtrl = require('../mark/controller');
const timetableCtrl = require('../timetable/controller');
const profileCtrl = require('../profile/controller');
const sessionDB = require('../database/sessiondb');
const studendb = require('../database/studendb');
const markDB = require('../database/markdb');
const subjectDB = require('../database/subjectdb');
const {
    response
} = require('express');

module.exports = class Logic {
    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    };
    static updateProfile(req) {
        return new Promise((resolve, reject) => {
            let student = {};
            let profile = {};
            let parent = {};
            let res = {
                json: (object) => {
                    student = object.student;
                    profile = object.profile;
                    parent = object.parent;
                    if (student.id) {
                        studentDB.getStudentByID(student.id)
                            .then(response => {
                                if (response.length && response.length > 0) {
                                    studentDB.updateStudent(student, student.id)
                                        .then(response => {
                                            console.log('Update student ' + student.id + " success")
                                        })
                                        .catch(reason => {
                                            console.log('Update student ' + student.id + " failed")
                                        })
                                } else {
                                    studentDB.addStudent(student)
                                        .then(response => {
                                            console.log('Add student ' + student.id + " success")
                                        })
                                        .catch(reason => {
                                            console.log('Add student ' + student.id + " failed")
                                        })
                                }
                            })
                            .catch(reason => {
                                console.log('Set student ' + student.id + " failed");
                            });
                        profileDB.getProfileByID(student.id)
                            .then(response => {
                                if (response.length && response.length > 0) {
                                    profileDB.updateProfile(profile, student.id)
                                        .then(response => {
                                            console.log('Update profile ' + student.id + " success")
                                        })
                                        .catch(reason => {
                                            console.log('Update profile ' + student.id + " failed")
                                        })
                                } else {
                                    profileDB.addProfile(profile)
                                        .then(response => {
                                            console.log('Add profile ' + student.id + " success")
                                        })
                                        .catch(reason => {
                                            console.log('Add profile ' + student.id + " failed")
                                        })
                                }
                            })
                            .catch(reason => {
                                console.log(reason);
                                console.log('Set profile ' + student.id + " failed");
                            });

                        parentDB.getParentByID(student.id)
                            .then(response => {
                                if (response.length && response.length > 0) {
                                    parentDB.updateParent(parent, student.id)
                                        .then(response => {
                                            console.log('Update parent ' + student.id + " success")
                                        })
                                        .catch(reason => {
                                            console.log('Update parent ' + student.id + " failed")
                                        })
                                } else {
                                    parentDB.addParent(parent)
                                        .then(response => {
                                            console.log('Add parent ' + student.id + " success")
                                        })
                                        .catch(reason => {
                                            console.log(reason);
                                            console.log('Add parent ' + student.id + " failed")
                                        })
                                }
                            })
                            .catch(reason => {
                                console.log(reason);
                                console.log('Set parent ' + student.id + " failed");
                            });

                    };
                    if (object) {
                        resolve({
                            student: student,
                            profile: profile,
                            parent: parent
                        });
                    } else {
                        reject(null);
                    }
                }
            }
            profileCtrl.get(req, res);
        })
    }

    static getMarkByCourse(req, course) {
        return new Promise((resolve, reject) => {
            let newReq1 = req;
            newReq1.params['course'] = course.course;
            let ress = {
                json: (object) => {
                    if (object) {
                        let mark = object.mark;
                        resolve(mark);
                    } else {
                        reject(null);
                    }
                }
            };
            markCtrl.getCourse(newReq1, ress);
        });
    };
    static getListCourseByTerm(req, term) {
        return new Promise((resolve, reject) => {
            let listCourse = [];
            let newReq = req;
            newReq.params['term'] = term;
            let response = {
                json: (object) => {
                    listCourse = object.listCourse;
                    if (listCourse && listCourse.length > 0 && listCourse[0].course) {
                        resolve(listCourse);
                    } else {
                        reject(object)
                    }
                }
            };
            markCtrl.getTerm(newReq, response);
        })
    };
    static getListTerm(req) {
        return new Promise((resolve, reject) => {
            let res = {
                json: (object) => {
                    listTerm = object.listTerm;
                    if (listTerm && listTerm.length > 0) {
                        resolve(listTerm);
                    } else {
                        reject(object);
                    }
                },
            };
            markCtrl.get(req, res);
        })

    };
    static updateMark(req, studentID) {
        return new Promise((resolve, reject) => {
            this.getListTerm(req)
                .then(listTerm => {
                    (async () => {
                        let listMark = [];
                        let countTerm = listTerm.length;
                        for (let i = 0; i < listTerm.length; i++) {
                            await this.getListCourseByTerm(req, listTerm[i])
                                .then(listCourse => {
                                    (async () => {
                                        let term = listTerm[i];
                                        let list = []
                                        let countCourse = listCourse.length;
                                        for (let j = 0; j < listCourse.length; j++) {
                                            let subject = {
                                                id: listCourse[j].code,
                                                name: listCourse[j].name,
                                                course: listCourse[j].course,
                                            }
                                            await subjectDB.addSubject(subject)
                                                .then(response => {
                                                    (async () => {
                                                        let course = subject;
                                                        await this.getMarkByCourse(req, course)
                                                            .then(mark => {
                                                                let subjectid = course.id;
                                                                let item = {
                                                                    course: subjectid,
                                                                    mark: mark
                                                                }
                                                                list.push(item);
                                                                countCourse--;
                                                                for (let k = 0; k < mark.length; k++) {
                                                                    let data = mark[k];
                                                                    data['subjectid'] = subjectid;
                                                                    data['studentid'] = studentID;
                                                                    data['pos'] = k;
                                                                    markDB.addMark(data)
                                                                        .then(response => {
                                                                            // console.log('Add mark of object ' + subjectid + " successful!")
                                                                        })
                                                                        .catch(reason => {
                                                                            console.log(reason)
                                                                        });
                                                                }
                                                            })
                                                            .catch(reason => {
                                                                reject(reason);
                                                            });
                                                    })();
                                                })
                                                .catch(reason => {
                                                    console.log(reason);
                                                });

                                        }
                                        (async () => {
                                            while (countCourse > 0) {
                                                await this.sleep(100);
                                            };
                                            let item = {
                                                term: listTerm[i],
                                                mark: list
                                            }
                                            listMark.push(item);
                                            countTerm--;
                                        })();

                                    })();
                                })
                                .catch(reason => {
                                    reject(reason);
                                });
                        }
                        (async () => {
                            while (countTerm > 0) {
                                await this.sleep(100);
                            };
                            //console.log(listMark);
                            resolve(listMark);
                        })();
                    })();

                })
                .catch(reason => {
                    reject(reason);
                })
        });

    }
    static getAll(req) {
        return new Promise((resolve, reject) => {
            let student = {};
            let profile = {};
            let parent = {};
            this.updateProfile(req)
                .then(result => {
                    student = result.student;
                    profile = result.profile;
                    parent = result.parent;
                    this.updateMark(req, student.id)
                        .then(response => {
                            resolve(utils.appendObject(result, response));
                        })
                        .catch(reason => {
                            console.log(reason);
                            reject(reason);
                        });
                })
                .catch(result => {
                    console.log(result);
                    reject(null);
                })
        });

    };
    static chechkSession(req) {
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
            profileCtrl.getStudentID(req, res);
        });

    };
    static removeHeader(req) {
        let session = req.headers.cookie;
        return new Promise((resolve, reject) => {
            sessionDB.removeHeader(session)
                .then(res => resolve(true))
                .catch(reason => {
                    console.log(reason);
                    reject(false)
                });
        });
    };
    static addHeader(req) {
        let session = req.headers.cookie;
        return new Promise((resolve, reject) => {
            this.chechkSession(req)
                .then(studentID => {
                    let data = {
                        studentid: studentID,
                        session: session,
                        isKeep: true
                    }
                    sessionDB.addHeader(data)
                        .then(res => resolve(res))
                        .catch(reason => {
                            console.log(reason);
                            reject(reason);
                        });
                })
                .catch(reason => {
                    console.log(reason);
                    reject(reason);
                });

        });
    };
}
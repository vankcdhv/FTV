'use strict'
const cheerio = require("cheerio");
const Const = require("../common/const");
const attendancedb = require('../database/attendancedb');
const coursedb = require('../database/coursedb');
const studentdb = require('../database/studendb');
const chatbotLogic = require('../chatbot/logic');

module.exports = {
    getListTerm: (body) => {
        $ = cheerio.load(body);
        let list = $(body).find("td");
        let listTerm = [];
        for (let i = 5; i < list.length; i++) {
            let str = $(list[i]).text();
            if (str.startsWith("Spring") || str.startsWith("Summer") || str.startsWith("Fall")) {
                if ($(list[i]).find('a') && $(list[i]).find('a').attr('href')) {
                    let term = {
                        code: $(list[i]).find('a').attr('href').split('term=')[1],
                        name: $(list[i]).text().trim()
                    }
                    listTerm.push(term);
                }
            }
        }
        return listTerm;
    },

    getListCourse: (body, countTerm) => {
        $ = cheerio.load(body);
        let list = $(body).find("td");
        let listCourse = [];

        for (let i = 6 + countTerm; i < list.length; i++) {
            let str = $(list[i]).text().trim();
            let array = str.split('(');
            if ($(list[i]).find('a') && $(list[i]).find('a').attr('href') && $(list[i]).find('a').attr('href').includes('course=')) {
                let course = {
                    name: array[0].trim(),
                    code: array[array.length - 2].trim(),
                    class: array[array.length - 1].trim().split(',')[0],
                    start: array[array.length - 1].trim().split(',')[1],
                    course: $(list[i]).find('a').attr('href').split('course=')[1].trim()
                }
                course.code = course.code.slice(0, -1);
                course.start = course.start.slice(6, -1);

                listCourse.push(course);
                //console.log(course);
            }
        }
        for (let i = 0; i < listCourse.length; i++) {
            coursedb.addCourse(listCourse[i])
                .then(response => {
                    //console.log('Add course ' + listCourse[i].id);
                })
                .catch(reason => {
                    console.log(reason);
                })
        }
        return listCourse;
    },

    getAttendanceReport: (body, studentID, courseID, haveNotify) => {
        $ = cheerio.load(body);
        let list = $(body).find("td");
        let report = [];
        for (let i = 6; i < list.length; i++) {
            let str = $(list[i]).text().trim();
            if (str == 'Present' || str == 'Absent' || str == 'Future') {
                let item = {
                    no: $(list[i - 6]).text().trim(),
                    date: $(list[i - 5]).text().trim(),
                    slot: $(list[i - 4]).text().trim(),
                    room: $(list[i - 3]).text().trim(),
                    lecturer: $(list[i - 2]).text().trim(),
                    status: $(list[i]).text().trim(),
                    comment: $(list[i + 1]).text().trim(),
                }
                report.push(item);
                // console.log(i, item);
            }
        }
        for (let i = 0; i < report.length; i++) {
            let item = report[i];
            item['studentid'] = studentID;
            item['course'] = courseID;
            //console.log(item);
            attendancedb.addAttendance(item, haveNotify)
                .then(response => {
                    if (response.code == 'ABSENT') {
                        studentdb.getStudentByID(response.studentID)
                            .then(student => {
                                if (student[0] && student[0].Recipient) {
                                    chatbotLogic.sendMessageAbsent(student[0].Recipient, response.course);
                                }
                            })
                            .catch(reason => {
                                console.log(reason);
                            })
                    }
                })
                .catch(reason => {
                    console.log(reason);
                })
        }
        return report;
    },
}
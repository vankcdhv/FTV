'use strict'
const cheerio = require("cheerio");
const subjectdb = require('../database/subjectdb');
const markdb = require('../database/markdb');
const Const = require("../common/const");
module.exports = {
    /**
     * Get list term from html
     */
    getListTerm: (body) => {
        let today = new Date();
        let currentTerm = Const.term[today.getMonth()] + today.getFullYear();
        $ = cheerio.load(body);
        var list = $(body).find("td");

        var listTerm = [];
        for (var i = 3; i < list.length; i++) {
            let str = $(list[i]).text();
            if (str.startsWith("Spring") || str.startsWith("Summer") || str.startsWith("Fall"))
                listTerm.push(str);
            if ($(list[i]).text() === currentTerm) {
                this._countTerm = i - 3 + 1;
                break;
            }
        }
        return listTerm;
    },
    /**
     * Get list course from html
     * Course includes name, code and course number
     */
    getListCourese: (body, countTerm = this._countTerm) => {
        $ = cheerio.load(body);
        var list = $(body).find("a");
        var listCourse = [];
        for (var i = countTerm + 1; i < list.length; i++) {
            if ($(list[i]).attr('href').includes('course=')) {
                let array = $(list[i]).text().split("(");
                let course = {};
                if (array.length === 2) {
                    course = {
                        name: array[0].slice(0, -1),
                        id: array[1].slice(0, -1),
                        course: $(list[i]).attr('href').split('course=')[1]
                    }
                } else {
                    course = {
                        name: array[0].slice(0, -1) + ' (' + array[1],
                        id: array[2].slice(0, -1),
                        course: $(list[i]).attr('href').split('course=')[1]
                    }
                }
                listCourse.push(course);
            }
        }
        for (let i = 0; i < listCourse.length; i++) {
            subjectdb.addSubject(listCourse[i])
                .then(response => {})
                .catch(reason => {
                    console.log(reason);
                })
        }
        return listCourse;
    },

    isGradeItem: (s1, s2, s3) => {
        if (s2.includes('%') && (parseFloat(s3) >= 0) && s1 !== 'Total') {
            return 1;
        }
        if (s2.trim() == 'Average' && parseFloat(s3) >= 0 && s1.trim() == 'Course total') {
            return 2;
        }
        return 0;
    },
    /**
     * Get all mark of an course from html
     */
    getMarkOfCourse: (body, studentID, subjectID, haveNotify) => {
        var listMark = [];
        $ = cheerio.load(body);
        var list = $(body).find('td');
        for (var i = 0; i < list.length; i++) {
            let comp = module.exports.isGradeItem($(list[i - 1]).text(), $(list[i]).text(), $(list[i + 1]).text());
            if (comp == 1) {
                let mark = {
                    gradeItem: $(list[i - 1]).text(),
                    weight: $(list[i]).text().slice(0, -2).trim(),
                    value: $(list[i + 1]).text()
                }
                listMark.push(mark);
            } else {
                if (comp == 2) {
                    let mark = {
                        gradeItem: $(list[i]).text(),
                        weight: '100',
                        value: $(list[i + 1]).text()
                    }
                    listMark.push(mark);
                }
            }
        }
        for (let i = 0; i < listMark.length; i++) {
            listMark[i]['studentID'] = studentID;
            listMark[i]['subjectid'] = subjectID;
            listMark[i]['pos'] = i;
            markdb.addMark(listMark[i], haveNotify)
                .then(res => {})
                .catch(reason => console.log(reason));

        }
        return listMark;
    }
}
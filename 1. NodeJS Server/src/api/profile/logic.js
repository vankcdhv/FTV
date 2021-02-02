'use strict'
const cheerio = require("cheerio");
const Const = require("./../common/const");
const utils = require('../common/utils');
const studentDB = require('../database/studendb');
const profileDB = require('../database/profiledb');
const parentDB = require('../database/parentdb');


class Logic {
    constructor(body) {
        this._body = body;
    };
    setBody(body) {
        this._body = body;
    };
    getBody() {
        return this._body;
    };
    extractProfile(root) {
        let list = $(root).find('td');
        let item = {};
        let count = 0;
        for (let i = 0; i < 13; i++) {
            if (i % 2 == 0) {
                let value = $(list[i + 1]).text().trim();
                item[Const.profileItem[count]] = value;
                count++;
            }
        }
        return item;

    };
    extractAcademic(root) {
        let list = $(root).find('td');
        let item = {
            studentid: $(list[1]).text().trim(),
            major: $(list[15]).text().trim()
        }
        return item;

    };
    extractFinance(root) {
        let list = $(root).find('td');
        let item = {
            account_balance: $(list[3]).text().split(':')[1].trim()
        }
        return item;

    };
    extractOthers(root) {
        let list = $(root).find('td');
        let item = {
            scholarship: $(list[15]).text().trim()
        }
        return item;

    };
    extractParent(root) {
        let list = $(root).find('td');
        let item = {
            fullname: $(list[1]).text().trim(),
            phone: $(list[3]).text().trim(),
            address: $(list[5]).text().trim()

        }
        return item;

    };
    getProfile() {
        let student = {};
        let profile = {};
        let parent = {};
        var list = $(this._body).find('fieldset');
        for (let i = 0; i < list.length; i++) {
            let legend = $(list[i]).find('legend')[0];
            let table = $(list[i]).find('table')[0];
            let name = $(legend).text();
            switch (name) {
                case 'Profile':
                    utils.appendObject(profile, this.extractProfile(table));
                    break;
                case 'Parent':
                    utils.appendObject(parent, this.extractParent(table));
                    break;
                case 'Academic':
                    utils.appendObject(profile, this.extractAcademic(table));
                    break;
                case 'Finance':
                    utils.appendObject(profile, this.extractFinance(table));
                    break;
                case 'Other':
                    utils.appendObject(profile, this.extractOthers(table));
                    break;
            }
        }
        student = {
            id: profile.studentid,
            recipient: null
        };
        if (student && student.id) {
            parent['studentid'] = profile.studentid;
            if (profile.phone)
                profile.phone = profile.phone.slice(2, profile.phone.length);
            studentDB.addStudent(student)
                .then(res => { })
                .catch(reason => console.log(reason));
            profileDB.addProfile(profile)
                .then(res => { })
                .catch(reason => console.log(reason));
            parentDB.addParent(parent)
                .then(res => { })
                .catch(reason => console.log(reason))
        }
        return {
            student: student,
            profile: profile,
            parent: parent
        };
    }
    getStudentID() {
        let student = {};
        let profile = {};
        let parent = {};
        var list = $(this._body).find('fieldset');
        for (let i = 0; i < list.length; i++) {
            let legend = $(list[i]).find('legend')[0];
            let table = $(list[i]).find('table')[0];
            let name = $(legend).text();
            switch (name) {
                case 'Profile':
                    utils.appendObject(profile, this.extractProfile(table));
                    break;
                case 'Parent':
                    utils.appendObject(parent, this.extractParent(table));
                    break;
                case 'Academic':
                    utils.appendObject(profile, this.extractAcademic(table));
                    break;
                case 'Finance':
                    utils.appendObject(profile, this.extractFinance(table));
                    break;
                case 'Other':
                    utils.appendObject(profile, this.extractOthers(table));
                    break;
            }
        }
        student = {
            id: profile.studentid,
            recipient: null
        };
        if (student && student.id) {
            parent['studentid'] = profile.studentid;
            if (profile.phone)
                profile.phone = profile.phone.slice(2, profile.phone.length);
            studentDB.addStudent(student)
                .then(res => { })
                .catch(reason => console.log(reason));
        }
        return {
            student: student,
            profile: profile,
            parent: parent
        };
    }
}

module.exports = Logic;
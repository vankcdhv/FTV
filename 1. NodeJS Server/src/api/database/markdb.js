const dbcontext = require('./dbcontext');
const subjectDB = require('./subjectdb');
const studentDB = require('./studendb');
const chatbot = require('../chatbot/logic')
module.exports = {
    getAllMark: () => {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM Mark';
            dbcontext.query(query, null, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res)
                }
            })
        });
    },
    getMarkByID: (studentID, subjectID) => {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM Mark WHERE studentID = ? AND subjectID = ?';
            dbcontext.query(query, [studentID, subjectID], (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res)
                }
            })
        });
    },
    addMark: (mark, haveNotify) => {
        return new Promise((resolve, reject) => {
            let query = 'INSERT INTO Mark';
            dbcontext.insert(query, mark, (err, res) => {
                if (err) {
                    if (err.code == 'ER_DUP_ENTRY' || err.number == 2627) {
                        module.exports.updateMark(mark, mark.studentid, mark.subjectid)
                            .then(response => {
                                resolve(response);
                            })
                            .catch(reason => {
                                reject(reason);
                            })
                    } else {
                        reject(err);
                    }
                } else {
                    if (haveNotify === 'true') {
                        studentDB.getStudentByID(mark.studentID)
                            .then(listStudent => {
                                let student = listStudent[0];
                                chatbot.sendMessageAddMark(student.Recipient, mark)
                            })
                            .catch(reason => {
                                console.log(reason);
                            })
                    }
                    resolve(res)
                }
            })
        })
    },
    updateMark: (mark, studentID, subjectID) => {
        return new Promise((resolve, reject) => {
            let query = 'UPDATE Mark';
            let param = [
                {
                    key: 'studentID',
                    value: studentID
                },
                {
                    key: 'subjectID',
                    value: subjectID
                },
                {
                    key: 'pos',
                    value: mark.pos
                }
            ];
            dbcontext.update(query, mark, param, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res)
                }
            })
        });
    },
    removeMark: (studentID, subjectID) => {
        return new Promise((resolve, reject) => {
            let query = 'DELETE FROM Mark WHERE studentID =? AND subjectID=?';
            dbcontext.query(query, [studentID, subjectID], (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res)
                }
            })
        });
    }

}
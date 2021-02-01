const dbcontext = require('./dbcontext');

module.exports = {
    getAllAttendance: () => {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM Attendance';
            dbcontext.query(query, null, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res)
                }
            })
        });
    },
    getAttendanceByID: (studentID, course, no) => {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM Attendance WHERE studentID = ? AND course = ? AND no = ?';
            dbcontext.query(query, [studentID, course, no], (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res)
                }
            })
        });
    },
    addAttendance: (attendance, haveNotify) => {
        return new Promise((resolve, reject) => {
            let query = 'INSERT INTO Attendance SET ?';
            dbcontext.query(query, [attendance], (err, res) => {
                if (err) {
                    if (err.code == 'ER_DUP_ENTRY' || err.sqlState === '23000') {
                        module.exports.updateAttendance(attendance, attendance.studentid, attendance.course, attendance.no, haveNotify)
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
                    resolve(res)
                }
            })
        })
    },
    updateAttendance: (attendance, studentID, course, no, haveNotify) => {
        return new Promise((resolve, reject) => {
            module.exports.getAttendanceByID(studentID, course, no)
                .then(report => {
                    report = report[0];
                    if (report) {
                        let response = {};
                        if (report.status == 'Future' && attendance.status == 'Absent' && haveNotify) {
                            console.log(attendance);
                            response = {
                                code: 'ABSENT',
                                course: course,
                                date: attendance.date,
                                studentID: studentID
                            };
                        } else {
                            response = {
                                code: 'UPDATED',
                                course: course,
                                date: attendance.date,
                                studentID: studentID
                            };
                        }
                        let query = 'UPDATE Attendance SET ? WHERE studentID =? AND course=? AND no=?';
                        dbcontext.query(query, [attendance, studentID, course, no], (err, res) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(response);
                            }
                        })
                    } else {
                        console.log('Error', "Can't find the report for Course: " + attendance.course + ', No: ' + attendance.no + ' - Student: ' + attendance.studentID);
                        // module.exports.updateAttendance(attendance, studentID, course, no, haveNotify)
                        //     .then(response => {
                        //         resolve(response);
                        //     })
                        //     .catch(reason => {
                        //         reject(reason);
                        //     })
                    }
                })

        });
    },
    removeAttendance: (studentID, subjectID, no) => {
        return new Promise((resolve, reject) => {
            let query = 'DELETE FROM Attendance WHERE studentID =? AND subjectID=? And no=?';
            dbcontext.query(query, [studentID, subjectID, no], (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res)
                }
            })
        });
    }

}
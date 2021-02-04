const dbcontext = require('./dbcontext');

module.exports = {
    getAllTimeTable: () => {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM TimeTable';
            dbcontext.query(query, null, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res)
                }
            })
        });
    },
    getTimeTableByDay: (studentID, dayInWeek) => {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM TimeTable WHERE studentID = ? AND dayInWeek = ?';
            dbcontext.query(query, [studentID, dayInWeek], (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res)
                }
            })
        });
    },
    getTimeTableBySlot: (studentID, dayInWeek, slot) => {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM TimeTable WHERE studentID = ? AND dayInWeek = ? AND slot = ?';
            dbcontext.query(query, [studentID, dayInWeek, slot], (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res)
                }
            })
        });
    },
    addTimeTable: (timeTable) => {
        return new Promise((resolve, reject) => {
            let query = 'INSERT INTO TimeTable';
            dbcontext.insert(query, timeTable, (err, res) => {
                if (err) {
                    if (err.code == 'ER_DUP_ENTRY' || err.number == 2627) {
                        // console.log(timeTable.date + ' - ' + timeTable.dayInWeek + ' - ' + timeTable.slot,'existed!');
                        module.exports.updateTimeTable(timeTable, timeTable.studentID, timeTable.dayInWeek, timeTable.slot)
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
    updateTimeTable: (timeTable, studentID, dayInWeek, slot) => {

        return new Promise((resolve, reject) => {
            let query = 'UPDATE TimeTable';
            let param = [
                {
                    key: 'studentID',
                    value: studentID
                },
                {
                    key: 'dayInWeek',
                    value: dayInWeek
                },
                {
                    key: 'slot',
                    value: slot
                }
            ];
            dbcontext.update(query, timeTable, param, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    // console.log(timeTable.dayInWeek + ' - ' + timeTable.slot,'updated!');
                    resolve(res)
                }
            })
        });
    },
    removeTimeTable: (studentID, dayInWeek, slot) => {
        return new Promise((resolve, reject) => {
            let query = 'DELETE FROM TimeTable WHERE studentID =? AND dayInWeek=? AND slot = ?';
            dbcontext.query(query, [studentID, dayInWeek, slot], (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res)
                }
            })
        });
    }

}
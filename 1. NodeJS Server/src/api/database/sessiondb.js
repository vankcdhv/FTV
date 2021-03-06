const dbContext = require('./dbcontext');

module.exports = {
    getAllSession: () => {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT * FROM HeaderKeepSession';
            dbContext.query(sql, null, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(response);
                }
            })
        });
    },
    getSessionByHeader: (session) => {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT * FROM HeaderKeepSession WHERE session=?';
            dbContext.query(sql, [session], (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(response);
                }
            })
        });
    },
    getSessionByStudentID: (studentID) => {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT * FROM HeaderKeepSession WHERE studentid=?';
            dbContext.query(sql, [studentID], (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(response);
                }
            })
        });
    },
    addHeader: (session) => {
        return new Promise((resolve, reject) => {

            let sql = 'INSERT INTO HeaderKeepSession';
            dbContext.insert(sql, session, (err, response) => {
                if (err) {
                    if (err.code == 'ER_DUP_ENTRY' || err.number == 2627) {
                        module.exports.updateSession(session.studentid, session)
                            .then(response => {
                                resolve(response);
                            })
                            .catch(reason => {
                                reject(reason);
                            });
                    } else
                        reject(err);
                } else {
                    resolve(response);
                }
            })
        });
    },
    updateSession: (studentID, session) => {
        return new Promise((resolve, reject) => {
            let query = 'UPDATE HeaderKeepSession';
            let param = [{
                key: 'studentID',
                value: studentID
            }]
            dbContext.update(query, session, param, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res)
                }
            })
        });
    },
    removeHeader: (session) => {
        return new Promise((resolve, reject) => {
            let sql = 'DELETE FROM HeaderKeepSession WHERE session = ?';
            dbContext.query(sql, [session], (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(response);
                }
            })
        });
    },
}
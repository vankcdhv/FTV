const dbcontext = require('./dbcontext');

module.exports = {
    getAllSubject: () => {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM Subject';
            dbcontext.query(query, null, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res)
                }
            })
        });
    },
    getSubjectByID: (subjectID) => {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM Subject WHERE course = ?';
            dbcontext.query(query, [subjectID], (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res)
                }
            })
        });
    },
    addSubject: (subject) => {
        return new Promise((resolve, reject) => {
            let query = 'INSERT INTO Subject';
            dbcontext.insert(query, subject, (err, res) => {
                if (err) {
                    if (err.code == 'ER_DUP_ENTRY' || err.number == 2627) {
                        module.exports.updateSubject(subject, subject.course)
                            .then(response => {
                                resolve(response);
                            })
                            .catch(reason => {
                                reject(reason);
                            })
                    } else
                        reject(err);
                } else {
                    resolve(res)
                }
            })
        })
    },
    updateSubject: (subject, course) => {
        return new Promise((resolve, reject) => {
            let query = 'UPDATE Subject';
            let param = [{
                key: 'course',
                value: course
            }];
            dbcontext.update(query, subject, param, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res)
                }
            })
        });
    },
    removeSubject: (subjectID) => {
        return new Promise((resolve, reject) => {
            let query = 'DELETE FROM Subject WHERE course=?';
            dbcontext.query(query, [subjectID], (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res)
                }
            })
        });
    }

}
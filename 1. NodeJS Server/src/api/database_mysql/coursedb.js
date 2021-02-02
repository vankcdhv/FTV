const dbcontext = require('./dbcontext');

module.exports = {
    getAllCourse: () => {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM Course';
            dbcontext.query(query, null, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res)
                }
            })
        });
    },
    getCourseByID: (courseID) => {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM Course WHERE course = ?';
            dbcontext.query(query, [courseID], (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res)
                }
            })
        });
    },
    addCourse: (course) => {
        return new Promise((resolve, reject) => {
            let query = 'INSERT INTO Course SET ?';
            dbcontext.query(query, [course], (err, res) => {
                if (err) {
                    if (err.code == 'ER_DUP_ENTRY' || err.sqlState==='23000') {
                        module.exports.updateCourse(course, course.course)
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
    updateCourse: (course, courseID) => {
        return new Promise((resolve, reject) => {
            let query = 'UPDATE Course SET ? WHERE  course = ?';
            dbcontext.query(query, [course, courseID], (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res)
                }
            })
        });
    },
    removeCourse: (courseID) => {
        return new Promise((resolve, reject) => {
            let query = 'DELETE FROM Course WHERE course = ?';
            dbcontext.query(query, [courseID], (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res)
                }
            })
        });
    }

}
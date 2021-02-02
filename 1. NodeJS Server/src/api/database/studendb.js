const dbcontext = require('./dbcontext');

module.exports = {
    getAllStudent: () => {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM Student';
            dbcontext.query(query, null, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res)
                }
            })
        });
    },
    getStudentByID: (id) => {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM Student WHERE id = ?';
            dbcontext.query(query, [id], (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res)
                }
            })
        });
    },
    addStudent: (student) => {
        return new Promise((resolve, reject) => {
            let query = 'INSERT INTO Student';
            dbcontext.insert(query, student, (err, res) => {
                if (err) {
                    if (err.code == 'ER_DUP_ENTRY' || err.number == 2627) { } else {
                        reject(err);
                    }
                } else {
                    resolve(res)
                }
            })
        })
    },
    updateStudent: (student, id) => {
        return new Promise((resolve, reject) => {
            let query = 'UPDATE Student ';
            let param = [
                {
                    key: 'id',
                    value: id
                }
            ]

            dbcontext.update(query, student, param, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res)
                }
            })
        });
    },
    removeStudent: (id) => {
        return new Promise((resolve, reject) => {
            let query = 'DELETE FROM Student WHERE id = ?';
            dbcontext.query(query, [id], (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res)
                }
            })
        });
    }

}
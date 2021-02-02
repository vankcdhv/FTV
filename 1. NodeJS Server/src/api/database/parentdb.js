const dbcontext = require('./dbcontext');

module.exports = {
    getAllParent: () => {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM parent';
            dbcontext.query(query, null, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res)
                }
            })
        });
    },
    getParentByID: (id) => {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM parent WHERE studentid = ?';
            dbcontext.query(query, [id], (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res)
                }
            })
        });
    },
    addParent: (parent) => {
        return new Promise((resolve, reject) => {
            let query = 'INSERT INTO parent';
            dbcontext.insert(query, parent, (err, res) => {
                if (err) {
                    if (err.code == 'ER_DUP_ENTRY' || err.number == 2627) {
                        module.exports.updateParent(parent, parent.studentid)
                            .then(response => {
                                resolve(response);
                            })
                            .catch(reason => {
                                reject(reason);
                            });
                    } else
                        reject(err);
                } else {
                    resolve(res)
                }
            })
        })
    },
    updateParent: (parent, id) => {
        return new Promise((resolve, reject) => {
            let query = 'UPDATE parent';
            let param = [{
                key: 'studentid',
                value: id
            }];
            dbcontext.update(query, parent, param, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res)
                }
            })
        });
    },
    removeParent: (id) => {
        return new Promise((resolve, reject) => {
            let query = 'DELETE FROM parent WHERE studentid = ?';
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
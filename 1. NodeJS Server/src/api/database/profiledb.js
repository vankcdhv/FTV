const dbcontext = require('./dbcontext');

module.exports = {
    getAllProfile: () => {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM Profile';
            dbcontext.query(query, null, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res)
                }
            })
        });
    },
    getProfileByID: (id) => {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM Profile WHERE studentid = ?';
            dbcontext.query(query, [id], (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res)
                }
            })
        });
    },
    addProfile: (Profile) => {
        return new Promise((resolve, reject) => {
            let query = 'INSERT INTO Profile';
            dbcontext.insert(query, Profile, (err, res) => {
                if (err) {
                    if (err.code == 'ER_DUP_ENTRY' || err.number == 2627) {
                        module.exports.updateProfile(Profile, Profile.studentid)
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
    updateProfile: (Profile, id) => {
        return new Promise((resolve, reject) => {
            let query = 'UPDATE Profile';
            let param = [
                {
                    key: 'studentid',
                    value: id
                }
            ]
            dbcontext.update(query, Profile, param, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res)
                }
            })
        });
    },
    removeProfile: (id) => {
        return new Promise((resolve, reject) => {
            let query = 'DELETE FROM Profile WHERE studentid = ?';
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
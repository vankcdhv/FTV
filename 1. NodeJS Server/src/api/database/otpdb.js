const dbcontext = require('./dbcontext');
const studentDB = require('./studendb');
const chatbot = require('../chatbot/logic')
module.exports = {
    getAllOTP: () => {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM OTP';
            dbcontext.query(query, null, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res)
                }
            })
        });
    },
    getOTPByStudentID: (studentID) => {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM OTP WHERE studentID = ?';
            dbcontext.query(query, [studentID], (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res)
                }
            })
        });
    },
    addOTP: (OTP) => {
        return new Promise((resolve, reject) => {
            let query = 'INSERT INTO OTP';
            dbcontext.insert(query, OTP, (err, res) => {
                if (err) {
                    if (err.code == 'ER_DUP_ENTRY' || err.number == 2627) {
                        module.exports.updateOTP(OTP, OTP.studentid)
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
    updateOTP: (OTP, studentID) => {
        return new Promise((resolve, reject) => {
            let query = 'UPDATE OTP';
            let param = [
                {
                    key: 'studentID',
                    value: studentID
                }
            ]
            dbcontext.update(query, OTP, param, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res)
                }
            })
        });
    },
    removeOTP: (studentID, code) => {
        return new Promise((resolve, reject) => {
            let query = 'DELETE FROM OTP WHERE studentID =? AND otp = ?';
            dbcontext.query(query, [studentID, code], (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res)
                }
            })
        });
    }

}
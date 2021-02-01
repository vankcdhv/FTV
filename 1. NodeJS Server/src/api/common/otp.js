const otpdb = require('../database/otpdb');
const profiledb = require('../database/profiledb');
const sessiondb = require('../database/sessiondb');
const profileCtrl = require('../profile/controller');
const mail = require('./mail');
module.exports = {
    getProfile: (otp) => {
        return new Promise((resolve, reject) => {
            sessiondb.getSessionByStudentID(otp.studentid)
                .then(session => {
                    session = session[0];
                    if (session) {
                        var cookieString = session.session;
                        let cookie = request.cookie(cookieString);
                        let headers = {
                            'Cookie': cookie
                        }
                        req = {
                            headers: headers
                        };
                        profileCtrl.get(req, {
                            JSON: (object) => {
                                if (object && object.code === 'TIME_OUT') {
                                    reject({
                                        code: 'NOT_FOUND',
                                        message: 'Student profile not exist'
                                    })
                                } else if (object & object.profile && object.profile.mail) {
                                    resolve(object.profile);
                                } else {
                                    reject({
                                        code: 'NOT_FOUND',
                                        message: 'Student profile not exist'
                                    })
                                }
                            }
                        })
                    }
                })
                .catch(reason => {
                    reject(reason);
                })
        })
    },
    sleep: (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    },
    removeOTPExpired: (otp, ms) => {
        (async (otp, ms) => {
            await sleep(ms);
            otpdb.removeOTP(otp.studentid, otp.otp)
                .then(response => {
                    console.log('OTP of studentID: ' + otp.studentid + ' - code: ' + otp.otp + ' have expired!')
                })
                .catch(reason => {
                    console.log(reason);
                })
        })(otp, ms);
        return;
    },
    sendOTP: (student) => {
        return new Promise((resolve, reject) => {
            if (student && student.id) {
                let code = Math.floor(Math.random() * 10000) + '';
                while (code.length < 4) {
                    code = '0' + code;
                }
                let otp = {
                    studentid: student.id,
                    otp: code,
                    expire: 60
                }
                console.log(otp);

                profiledb.getProfileByID(student.id)
                    .then(profile => {
                        profile = profile[0];
                        if (profile) {
                            mail.sendMail(profile.mail, 'OTP FTV', 'Đây là mã OTP của bạn: \n' + otp.otp + '\nMã OTP sẽ hết hạn trong 60s\nKhông chia sẻ mã OTP cho bất kỳ ai khác!')
                                .then(response => {
                                    otpdb.addOTP(otp)
                                        .then(response => {
                                            module.exports.removeOTPExpired(otp, 60000);
                                            resolve(otp);
                                        })
                                        .catch(reason => {
                                            reject(reason);
                                        })
                                })
                                .catch(reason => {
                                    reject(reason);
                                    console.log(reason)
                                });
                        } else {
                            module.exports.getProfile(otp)
                                .then(profile => {
                                    mail.sendMail(profile.mail, 'OTP FTV', 'Đây là mã OTP của bạn: \n' + otp + '\nKhông chia sẻ mã OTP cho bất kỳ ai khác!')
                                        .then(response => {
                                            otpdb.addOTP(otp)
                                                .then(response => {
                                                    module.exports.removeOTPExpired(otp, 60000);
                                                    resolve(otp);
                                                })
                                                .catch(reason => {
                                                    reject(reason);
                                                })
                                        })
                                        .catch(reason => {
                                            reject(reason);
                                            console.log(reason)
                                        });
                                })
                                .catch(reason => {
                                    console.log(reason);
                                    reject(reason);
                                })
                        }
                    })
                    .catch(reason => {
                        reject(reason);
                    })
            }
        })
    },
    verifyOTP: (student, otp) => {
        return new Promise((resolve, reject) => {
            otpdb.getOTPByStudentID(student.id)
                .then(listOTP => {
                    if (otp == listOTP[0].otp) {
                        resolve(otp)
                    } else {
                        reject({
                            code: 'NOT_MATCH',
                            message: 'OTP not match! Enter again'
                        })
                    }
                })
                .catch(reason => {
                    reject(reason);
                })

        })
    },
}
const request = require('request');
const chatbot_config = require('../../../config/chatbot').config;
const studentDB = require('../database/studendb');
const courseDB = require('../database/coursedb');
const subjectDB = require('../database/subjectdb');
const otp = require('../common/otp');
const otpDB = require('../database/otpdb');
const Const = require('../common/const');
const test = require('../database/dbcontext');
const {
    response
} = require('express');

class Logic {
    /**
     * Đây là function dùng api của facebook để gửi tin nhắn
     */
    static sendMessage(senderId, message) {
        if (!senderId) return;
        if (!senderId) return;
        request({
            url: 'https://graph.facebook.com/v8.0/me/messages?access_token=' + chatbot_config.page_access_token,
            method: 'POST',
            json: {
                recipient: {
                    id: senderId
                },
                message: {
                    text: message
                },
            }
        }, (error, response) => {
            let res = response = response.toJSON();
            if (res.body.error) {
                console.log(res.body.error);
                //this.sendMessage(senderId, message);
            } else {
                console.log(res.body);
                console.log('Send message to: ' + senderId + ' - Content: ' + message);
            }

        });
    };
    static getOTP(senderID, text) {
        if (!senderID) return;
        let studentid = text.split(' ')[2].trim();
        studentDB.getStudentByID(studentid)
            .then(student => {
                student = student[0];
                if (student) {
                    otp.sendOTP(student)
                        .then(otp => {
                            console.log(otp);
                            this.sendMessage(senderID, 'OTP đã được gửi vào email FPT rồi nhé!');
                        })
                        .catch(reason => {
                            console.log(reason);
                            if (reason.code === 'NOT_FOUND') {
                                this.sendMessage(senderID, 'Không tìm thấy email của sinh viên này!');
                            }
                            this.sendMessage(senderID, 'Có lỗi xảy ra! Vui lòng thử lại!');
                        })
                } else {
                    this.sendMessage(senderID, 'Hình như là sai mã sinh viên rồi! Thử lại xem! Nhớ đúng cú pháp: Get OTP Mã SV (Get OTP HE13....)');
                }
            })
            .catch(reason => {
                console.log(reason);
                this.sendMessage(senderID, 'Hình như là sai mã sinh viên rồi! Thử lại xem! Nhớ đúng cú pháp: Get OTP Mã SV (Get OTP HE13....)');
            })
    }
    /**
     * Add an new facebook recipient
     */
    static changeRecipient(recipient, text) {
        if (!recipient) return;
        let studentID = text.split(' ')[2];
        let otp = text.split(' ')[3];

        if (!otp || otp.length < 4) {
            this.sendMessage(recipient, "Sai cú pháp! Hãy soạn tin theo cú pháp:\nChange Facebook + Mã SV + OTP\nVí dụ: Change Facebook HE13xxxx 9438\nĐể lấy mã OTP soạn tin theo cú pháp:\nGet OTP Mã SV (Get OTP HE13xxxx)");
        } else {
            otpDB.getOTPByStudentID(studentID)
                .then(obj => {
                    obj = obj[0];
                    if (obj && obj.otp === otp) {
                        let data = {
                            id: studentID,
                            recipient: recipient
                        }
                        studentDB.updateStudent(data, studentID)
                            .then(response => {
                                if (response > 0) {
                                    this.sendMessage(recipient, 'Bạn đã đăng ký facebook này cho mã sinh viên ' + studentID);
                                } else {
                                    this.sendMessage(recipient, "Ops!! Mã sinh viên không đúng thì phải!");
                                }
                            })
                            .catch(reason => {
                                console.log(reason);
                                this.sendMessage(recipient, "Ops!! Có gửi sai gì không bạn ê! Không được rồi! Lại nhé");
                            });
                    } else {
                        this.sendMessage(recipient, "Mã OTP không chính xác hoặc đã hết hạn!\nHãy kiểm tra và thử lại hoặc lấy mã OTP theo cú pháp:\nGet OTP Mã SV (Get OTP HE13xxxx)");
                    }
                })
        }
    };
    /**
     * Process when receive an message
     * @param {object} entries: All infomation of message 
     */
    static processInbox(entries) {
        for (var entry of entries) {
            var messaging = entry.messaging;
            for (var message of messaging) {
                var senderId = message.sender.id;
                if (message.message) {
                    if (message.message.text) {
                        var text = message.message.text;
                        if (text.startsWith(Const.CHANGE_RECIPIENT_CODE)) {
                            this.changeRecipient(senderId, text);
                        } else if (text.startsWith(Const.GET_OTP)) {
                            this.getOTP(senderId, text);
                        } else {
                            this.sendMessage(senderId, "Nhắn cái gì dễ hiểu cái coi!");
                        }
                    }
                }
            }
        }
    };
    /**
     * 
     */
    static sendMessageSessionTimeOut(recipient) {
        let text = 'Phiên đăng nhập hết hạn! Đăng nhập lại để tiếp tục nhận thông báo nhá!';
        this.sendMessage(recipient, text);
    }
    /**
     * 
     */
    static sendMessageAbsent(recipient, course) {
        courseDB.getCourseByID(course)
            .then(course => {
                let text = 'Nhóc con! Nghỉ học môn ' + course[0].code + ' à! T gọi phụ huynh giờ!';
                this.sendMessage(recipient, text);
            })
            .catch(reason => {

            });

    }
    /**
     * Send message have new mark
     * @param {*} recipient 
     * @param {*} course 
     */
    static sendMessageAddMark(recipient, markItem) {
        subjectDB.getSubjectByID(markItem.subjectid)
            .then(course => {
                let text = 'Bạn ê!!! Có điểm môn ' + course[0].id + ' (' + course[0].name + ') ' + ' kìa! \n' + markItem.gradeItem + ': ' + markItem.value;
                this.sendMessage(recipient, text);
            })
            .catch(reason => {
                console.log(reason);
            });

    }
    /**
     * Send message notify time table of a slot
     * @param {*} recipient 
     * @param {*} slot 
     */
    static sendMessageTimeTable(recipient, slot) {
        let text = 'Slot ' + slot.slot + ": " + 'Môn ' + slot.course + ' - ' + 'Phòng ' + slot.room + ' - ' + slot.time;
        this.sendMessage(recipient, text);
    }
}

module.exports = Logic;
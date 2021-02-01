const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'vanlthe130820@fpt.edu.vn',
        pass: 'codera3k48'
    }
});

module.exports = {
    sendMail: (receiver, subject, content) => {
        return new Promise((resolve, reject) => {
            let mailOptions = {
                from: 'vanlthe130820@gmail.com',
                to: receiver,
                subject: subject,
                text: content
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(info);
                }
            })
        })

    },
}
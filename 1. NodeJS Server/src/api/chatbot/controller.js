const chatbot_config = require('../../../config/chatbot').config;
const logic = require('./logic');
module.exports = {
    get: (req, res) => { // Đây là path để validate tooken bên app facebook gửi qua
        if (req.query['hub.verify_token'] === chatbot_config.validation_token) {
            res.status(200).send(req.query['hub.challenge']);
        } else
            res.sendStatus(403);
    },

    post: (req, res) => { // Phần sử lý tin nhắn của người dùng gửi đến
        var entries = req.body.entry;
        logic.processInbox(entries);
        res.status(200).send("OK");
    },
}
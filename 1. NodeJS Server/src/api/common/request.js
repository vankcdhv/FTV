const request = require('request');

module.exports = {
    /**
     * @param {*} url: Uri of request
     * @param {*} header: request header of request
     * @param {*} method : Method of request, default = GET
     */
    httpRequest(url, header, method = 'GET', mode = 0) {
        return new Promise((resolve, reject) => {
            if (mode == 0) {
                header.Host = 'fap.fpt.edu.vn';
                header.host = 'fap.fpt.edu.vn';
            }
            let option = {
                headers: header,
                uri: url,
                method: method
            }
            console.log(header);
            request(option, function (error, response, body) {
                if (error) {
                    reject(error);
                } else {
                    resolve(body);
                }
            })
        })
    }
}
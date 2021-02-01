const logic = require('./logic');

module.exports = {
    get: (req, res) => {
        logic.getAll(req)
            .then(response => {
                //console.log(response);
                res.json(response);
            })
            .catch(reason => {
                res.json({
                    status: 'failed'
                });
            });
    },
    keep: (req, res) => {
        logic.addHeader(req)
            .then(result =>
                res.json({code:'SUCCESS',message:'Keep session sucessful!'})
            )
            .catch(reason =>
                res.json(reason)
            );

    },
    unKeep: (req, res) => {
        logic.removeHeader(req).then(result =>
                res.json({
                    status: 'done'
                })
            )
            .catch(reason =>
                res.json({
                    status: 'failed'
                })
            );
    },
    keepHeroku: (req, res) => {
        res.json({
            status: 'done'
        });
    }

}
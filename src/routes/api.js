const polling = require("../controllers/survey")

module.exports = function (app) {
    let router = require('express').Router();

    router.route('/listu').
        get(polling.userList);

    router.route('/list').
        get(polling.clientList);

    router.route('/create').
        post(polling.create);

    router.route('/vote/:id').
        post(polling.vote);

    router.route('/survey/:id').
        get(polling.view);

    router.route('/setVisible/:id').
        get(polling.setVisible);

    router.route('/avail/:id').
        get(polling.avail);

    app.use('/api', router)
}
// passport.authenticate("jwt", { session: false})

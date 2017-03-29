const passport = require('passport'),
       polling = require("../controllers/survey")

module.exports = function (app) {
    let router = require('express').Router();

    // passport.use(new LocalStrategy(User.authenticate()));
    // // use static serialize and deserialize of model for passport session support
    // passport.serializeUser(User.serializeUser());
    // passport.deserializeUser(User.deserializeUser());
    //
    // //need this according to passport guide
    // app.use(cookieParser());
    // app.use(session({
    //     secret: 'making it look  easy',
    //     saveUninitialized: true,
    //     resave: true
    // }));
    //app.use(passport.initialize());
    //app.use(passport.session());

    router.route('/listu').
        get(passport.authenticate("jwt", { session: false, }), polling.userList);

    router.route('/list').
        get(passport.authenticate("jwt", { session: false, }), polling.clientList);

    router.route('/create').
        post(passport.authenticate("jwt", { session: false, }), polling.create);

    router.route('/vote/:id').
        post(passport.authenticate("jwt", { session: false, }), polling.vote);

    router.route('/survey/:id').
        get(passport.authenticate("jwt", { session: false, }), polling.view);

    router.route('/setVisible/:id').
        get(polling.setVisible);

    router.route('/avail/:id').
        get(polling.avail);

    app.use('/api', router)
}

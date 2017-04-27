module.exports = function (app) {
    let router = require('express').Router();

    router.get('/', function (req, res) {
        res.render('home');
    });

    router.get('/about', function (req, res) {
        res.render('about');
    });
    router.get('/register', function (req, res) {
        res.render('register')
    });
    router.get('/login', function (req, res) {
        res.render('login')
    });
    router.get('/verify', function (req, res) {
        res.render('verify')
    });
    router.get('/:type(dashboard|finish|add|create)', function (req, res) {
        res.render('dashboard')
    });
    router.get("/:type(vote|view)/:id", function (req, res) {
        res.render('dashboard')
    });

    app.use('/', router);
}

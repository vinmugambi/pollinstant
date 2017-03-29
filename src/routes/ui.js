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
    router.get('/dashboard', function (req, res) {
        if (!req.user) {
            res.redirect('/login')
        } else {
            res.render('dashboard', { layout: 'auth' })
        }
    })
    app.use('/', router);
}

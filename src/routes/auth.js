var auth = require('../controllers/auth');

module.exports = function (app) {
	let router = require("express").Router();
	router.post("/login", auth.login);
	router.post("/register", auth.create);
	router.get('/logout',auth.logout);
	router.post("/verify",auth.confirmEmail)
	app.use("/auth", router);
}

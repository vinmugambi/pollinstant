var auth = require('../controllers/jwtAuth');

module.exports = function (app) {
	let router = require("express").Router();
	router.post("/login", auth.login);
	router.post("/register", auth.create);
	app.use("/auth", router);
}

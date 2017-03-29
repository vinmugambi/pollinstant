var jwt = require("jsonwebtoken"),
	User = require('../models/User'),
	config = require('../config')

exports.create = function (req, res) {
	console.log('registering user');
	console.log()
	let newAccount = new User({
		username: req.body.email,
		firstName: req.body.firstName,
		phoneNumber: req.body.phoneNumber,
		role: req.body.role,
		password: req.body.password,
		meta: {
			age: req.body.age,
			sex: req.body.sex,
			educationLevel: req.body.educationLevel,
			city: req.body.city,
			county: req.body.county
		}
		})
	console.log(newAccount.password)
	newAccount.save(function (err) {
		if (err) {
			console.log(err);
			return res.json({
				success: false,
				message: err.message
			});
		}
		else {
			res.json({
				success: true,
				message: 'You have successfully created an account. Pease Login to start enjoying our services'
			});
		}
	});
}

exports.login = function (req, res) {
	User.findOne({ username: req.body.username },
			 function (err, user) {
			if (err) { throw err }
			if (!user) {
				res.json({
					success: false,
					message: "User authentication failed"
				});
			} else {
				user.comparePassword(req.body.password, function (err, verified) {
					if (err) {
						res.json({ message: "something went wrong" })
					}
					else {
						if (verified === false) {
							res.json({ sucess: false, message: "Authentication Failed" })
						}
						else {
							let payload = {
								_id: user._id,
								username: user.username
							}
							if (verified === true) {
								var token = jwt.sign(payload, config.auth.secret, {
									expiresIn: "2 days"
								});
								res.json({
									success: true,
									message: 'Authentication successfull',
									token
								});
							}
						}
					}
				});
			}
		});
}

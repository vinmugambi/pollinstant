var JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt,
  User = require('../models/User'),
  config = require('../config')

module.exports = function (passport) {
  let options = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: config.auth.secret
  }
  passport.use(new JwtStrategy(options, (jwt_payload, done) => {
    User.findOne({
      id: jwt_payload.id
    }, function (err, user) {
      if (err) {
        return done(err, false)
      }
      if (user) {
        done(null, user)
      } else {
        done(null, false)
      }
    });
  }));
}

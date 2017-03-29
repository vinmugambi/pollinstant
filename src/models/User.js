var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  password = require("password-hash-and-salt"),
  shortid = require('shortid');
  //var  bcrypt = require("bcrypt-nodejs")

var Account = new Schema({
  _id: {
    type: String,
    default: shortid.generate
  },
  username: {
    type: String,
    lowercase: true,
    unique: true,
  },
  firstName: String,
  phoneNumber: String,
  password: { type: String, required: true },
  role: { type: String, enum: ['Client', 'Voter'] },
  meta: {
    age: { type: Number, required: true },
    sex: { type: String, enum: ["Female", "Male"] },
    educationLevel: Number,
    county: String,
    city: String
  },
},
  {
    timestamps: true
  });

Account.pre("save", function (next) {
  var user = this;
  console.log(user)
  if (this.isModified("password") || this.isNew) {
    password(user.password).hash(function (error, hash) {
      if (error) {
        console.error("Something went wrong during password hashing");
      }
      else user.password = hash
      next()
    })
  }
})

Account.methods.comparePassword = function (pw, cb) {
  password(pw).verifyAgainst(this.password, function (error, verified) {
    if (error) cb(error)
    else cb(null, verified)
  })
}
// Account.pre('save', function(done) {
//   var user = this;
//   if (this.isModified('password') || this.isNew) {
//     bcrypt.genSalt(10, function(err, salt) {
//       if (err) {
//         return done(err);
//       }
//       bcrypt.hash(user.password, salt,null, function(err, hash) {
//         if (err) {
//           return done(err);
//         }
//         user.password = hash;
//         done();
//       });
//     });
//   } else {
//     return done();
//   }
// });
//
// Account.methods.comparePassword = function(pw,cb) {
//   bcrypt.compare(pw,this.password, function(err,isMatch) {
//     if (err) {
//       cb(err)
//     }
//    cb(null,isMatch)
//   });
// };

module.exports = mongoose.model('User', Account);

var randomstring = require("randomstring"),
    User = require('../models/User'),
    Verify= require('../models/verify'),
    // sms=require("./sms"),
    email=require("./email");

exports.create = function (req, res) {
    let string=randomstring.generate({length: 6,charset: "numeric"})
    let user= {
      username: req.body.email,
      firstName: req.body.firstName,
      phoneNumber: req.body.phoneNumber,
      role: req.body.role,
      verificationCode: string,
      password: req.body.password,
      meta: {
          age: req.body.age,
          sex: req.body.sex,
          educationLevel: req.body.educationLevel,
          city: req.body.city,
          county: req.body.county
      }
    }
    let verify= new Verify(user)
    User.findOne({username: req.body.email},function(err,used){
      if (!used){
        Verify.findOne({username: req.body.email},function(err,available){
          if (!available){
            verify.save(function(err,account){
              if (err) console.error(err)
              else {
                let message={
                  subject: "EMAIL VERIFICATION",
                  text: `Your VERIFICATION code is ${account.verificationCode}. The code expires in 20 minutes`
                }
                email(account.username,message,function(err,notification){
                  if (err) {
                    res.status(500);
                  }
                  else {
                    console.log(notification)
                    res.status(200).json({success: true, message: `Enter the verification code sent to ${account.username}`,email:account.username })
                  }
              });
              }
          });
        }else{
          res.status(200).json({success: true, message: "verificationCode already set",email: available.username})
        }
        })
    }else{
      res.status(400).json({success: false, message: "Your EMAIL is already registered with another account"})
      }
    })
}

exports.confirmEmail=function(req,res){
// console.log(req.body)
  Verify.findOne({username: req.body.email},function(err,verify){
    if (err) console.error(err);
    else if(verify){
        console.log(verify)
      if (req.body.code==verify.verificationCode){
        let user=verify.toJSON();
        User.register(new User(user),user.password, function (err, user) {
            if (err) {
                return res.status(400).json({success: false, message: "Your EMAIL is already registered with another account",err});
            } else {
                res.send({
                    success: true,
                    message: "You have successfully created an account",
                    user
                });
             }
        })
      }else{
        res.status(400).json({success: false, message: "Email verification failed. Please retry"})
      }
    }else res.redirect("/register")
  })
}
exports.login = function (req, res, next) {
    User.authenticate()(req.body.username, req.body.password, function (err, user, options) {
        if (err) return next(err);
        if (user === false) {
            res.send({
                message: options.message,
                success: false
            });
        } else {
            req.login(user, function (err) {
                if (err) res.send({success: false, message: err.message})
                else{
                    res.send({success: true});
                    // console.log(req.user)
                }
            });
        }
    });
}

exports.logout= function(req,res){
    req.logout();
    res.redirect("/login")
}
//   sms.sms("+2547xxxxxxxx",message.text,function(err,notification){
//     if (err) console.error(err)
//     else console.info(notification)
// });

//       var token = jwt.sign(payload, config.auth.secret, {
// 	expiresIn: "2 days"
// });

const Survey = require('../models/Survey'),
     email=require("./email"),
  schedule = require('node-schedule');

function setDates(startDate, endDate, surveyId) {
  if (startDate > new Date() && startDate < endDate) {
    schedule.sheduleJob(startDate, function () {
      Survey.findById(surveyId, function (err, survey) {
        if (err) { console.log("Setting Start Date Failed") }
        else {
          survey.available = true;
          survey.save();
        }
      })
    })

    schedule.sheduleJob(endDate, function () {
      Survey.findById(surveyId, function (err, survey) {
        if (err) {
           console.log("Setting Start Date Failed") }
        else {
          survey.available = false;
          survey.save();
        }
      })
    })

  } else {
    console.log('Error in scheduling Survey')
  }
}

exports.clientList = function (req, res) {
  if (!req.user || req.user.role !== 'Client') {
    //console.log(req.user,"survey.js");
    res.json({
      success: false,
      message: "You are not authorised to view this resource. Login to your client account to continue"
    })
  }
  else {
    Survey.find({ owner: req.user._id }, 'pollDescription available totalParticipants', function (err, surveys) {
      if (err) {
        res.json({
          success: false,
          err
        });
      } else {
        res.json({
          success: true,
          owner: true,
          message: "Here is a list of your survey",
          surveys
        });
      }
    });
  }
}
exports.userList = function (req, res) {
  if (!req.user) {
    res.json({
      success: false,
      message: "You are not authorised to view this resource. Login to your account to continue"
    })
  }
  else {
    //console.log(req.user,"Survey.js")
    let gender = req.user.meta.sex,
      age = req.user.meta.age,
      edu = req.user.meta.educationLevel,
      county = req.user.meta.county

    Survey.find({
      available: true,
      $and:
      [
        {
          $or:
          [{ targetSex: gender }, { targetSex: "All" },{targetSex: "all"}]
        },
        {
          $or:
          [{ targetMinAge: age }, { targetMinAge: { $lt: age } }, { targetMinAge: 0 }]
        },
        {
          $or:
          [{ targetMaxAge: age }, { targetMaxAge: { $gt: age } }, { targetMaxAge: 0 }]
        },
        {
          $or:
          [{ targetMinEduLvl: edu }, { targetMinEduLvl: { $lt: edu } }, { targetMinEduLvl: 0 }]
        },
        {
          $or:
          [{ targetCounties: county }, { targetCounties: { $size: 0 } }]
        },
        {
          $or:
          [{ targetCities: county }, { targetCities: { $size: 0 } }]
        }
      ]
    }).limit(15)
      .select('pollDescription visible')
      .exec(function (err, surveys) {
        if (err) {
          res.json({
            success: false,
            error: err
          });
        } else {
          res.json({
            success: true,
            owner: false,
            message: "Here is a list of surveys you qualify toparticiate",
            surveys
          });
        }
      });
  }

}
//var query= Survey.find({}); for Cleaner syntax
exports.create = function (req, res) {
  if (!req.user || req.user.role !== 'Client') {
    res.json({
      success: false,
      message: "You are not authorised to perform this action. Login to your client account to continue"
    })
  }
  else {
    let survey = new Survey({
      owner: req.user._id,
      pollDescription: req.body.pollDescription,
      questions: req.body.questions,
      available: req.body.available,
      visible: req.body.visible,
      targetMinAge: req.body.minAge,
      targetMaxAge: req.body.maxAge,
      targetSex: req.body.sex,
      targetMinEduLvl: req.body.minEducationLevel,
      targetmaxEduLvl: req.body.maxEducationLevel,
      targetCounties: req.body.counties,
      targetCities: req.body.cities
    })
    survey.save(function (err, survey) {
      if (err) {
        res.json({
          success: false,
          message: err
        });
      }
      else {
        res.json({
          success: true,
          message: `Survey ${req.body.pollDescription} has been successfully created`
        });
        setDates(req.body.startDate, req.body.endDate, survey._id);
        let message={
            subject: "SURVEY CREATION",
            text: `Survey ${req.body.pollDescription} has been successfully created and our users will be
            allowed to vote from ${req.body.startDate} to ${req.body.endDate}`
        }
        email(req.user.username,message,function(err,notification){
          if (err) {
            console.log(err)
          }else console.info(notification)
        })
      }
    }
    );
  }
}


exports.vote = function (req, res) {
  if (!req.user) {
    res.json({
      success: false,
      message: "You are not authorised to perform this action. Login to your client account to continue"
    })
  }
  else {
    var id = req.params.id;

    Survey.findById(id, function (err, survey) {
      if (err) {
        res.json({ success: false, message: err.message });
        return;
      } else {
        if (req.user._id == survey.owner) {
          res.json({ success: false, message: `You are not allowed to poll in your own survey` })
        } else {
          if (survey.participants.indexOf(req.user._id) !== -1) {
            res.json({ success: false, message: "You are not allowed to poll twice" })
          } else {
            // var vote = { 0: 3, 1: 0, 2: 4, 3: 1, 4: 2, 5: 0 },
            var vote = req.body.vote;
            var readAnswer = function (i) {
              let ans = vote.filter(function (ans, index) { return index === i });
              return ans[0][i]
            }
            var updateData = function (data) {
              for (let i = 0; i < data.questions.length; i++) {
                var ans = readAnswer(i)
                var choice = data.questions[i].choices[ans]
                var voteCount = choice.votes
                choice.votes = voteCount + 1;
              }
              return data;
            }
            updateData(survey);
            survey.totalParticipants = survey.totalParticipants + 1
            survey.participants.push(req.user.id)
            survey.save(function (err) {
              if (err) res.json({ success: false, err })
              else res.json({ success: true, message: "You have successfully polled in poll with id " + id })
            })
          }
        }
      }

    })
  }
}
exports.view = function (req, res) {
  if (!req.user) {
    res.json({
      success: false,
      message: "You are not authorised to perform this action. Login to your client account to continue"
    })
  }
  else {
    Survey.findById(req.params.id, function (err, survey) {
      if (err) {
        res.json({ success: false, err })
      } else {
        if (survey.owner !== req.user.id && survey.available == false) {
          res.json({ success: false, message: "You are not allowed to view this poll" })
        } else {
          res.json({ success: true, survey })
        }
      }
    })
  }
}

exports.avail = function (req, res) {
  if (!req.user || req.user.role !== 'Client') {
    res.json({
      success: false,
      message: "You are not authorised to perform this action. Login to your client account to continue"
    })
  } else {
    let id = req.params.id
    Survey.findById(id, function (err, survey) {
      if (err) {
        res.json({
          success: false,
          err
        })
      } else {
        if (survey.owner !== req.user._id) {
          res.json({
            success: false,
            message: `You must be the owner of the poll to change it`
          })
        } else {
          survey.available = true;
          survey.save(function (err) {
            if (err) {
              res.json({
                success: false, err
              });
            } else {

              res.json({
                success: true,
                message: `Survey by id ${id} has been availed for voting to voters`
              });
            }
          });
        }
      }
    });
  }
}

exports.setVisible = function (req, res) {
  if (!req.user || req.user.role !== 'Client') {
    res.json({
      success: false,
      message: "You are not authorised to perform this action. Login to your client account to continue"
    })
  } else {
    let id = req.params.id
    Survey.findById(id, function (err, survey) {
      if (err) {
        res.json({
          success: false,
          err
        })
      } else {
        if (survey.owner !== req.user._id) {
          res.json({
            success: false,
            message: `You must be the owner of the poll to change it`
          })
        } else {
          survey.visible = true;
          survey.save(function (err) {
            if (err) {
              res.json({
                success: false, err
              });
            } else {
              res.json({
                success: true,
                message: `The results of survey by id ${id} are visible to voters`
              });
            }
          });
        }
      }
    });
  }
}

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    // shortid = require('shortid'),
    passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    _id: {
        type: String
    },
    username: {
        type: String,
        lowercase: true,
        unique: true,
    },
    firstName: String,
    phoneNumber: String,
    // password: { type: String, required: true },
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

var options = ({ missingPasswordError: "Please enter your password" });
Account.plugin(passportLocalMongoose, options);

module.exports = mongoose.model('User', Account)

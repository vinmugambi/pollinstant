var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    shortid = require('shortid')

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
		verificationCode: String,
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

module.exports = mongoose.model('Verify', Account)

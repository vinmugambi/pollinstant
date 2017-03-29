const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const choiceSchema = new Schema({
  text: { type: String, required: true },
  votes: { type: Number, default: 0 }
}, { _id: false })

const pollSchema = new Schema({
  question: { type: String, required: true },
  choices: [choiceSchema],
}, { _id: false });

var surveySchema = new Schema({
  owner: { type: String, required: true },
  pollDescription: { type: String, required: true },
  questions: [pollSchema],
  available: { type: Boolean, default: false },
  visible: { type: Boolean, default: false },
  targetMinAge: { type: Number, default: 0 },
  targetMaxAge: { type: Number, default: 100 },
  targetSex: { type: String, default: "All" },
  targetMinEduLvl: { type: Number, default: 0 },
  targetMaxEduLvl: { type: Number, default: 3 },
  targetCounties: [String],
  targetCities: [String],
  participants: [String],
  totalParticipants: { type: Number, default: 0 }
},
  {
    timestamps: true
  });

module.exports = mongoose.model('surveys', surveySchema);

const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  _id: {type: String, required: true},
  username: {type: String, required: true},
  date: {type: Date },
  duration: {type: Number, required: true},
  description: {type: String, required: true}
});

module.exports = mongoose.model("UserExercise", exerciseSchema);
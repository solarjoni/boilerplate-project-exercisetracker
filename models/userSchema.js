const mongoose = require('mongoose');
const shortId = require("shortid");


const userSchema = new mongoose.Schema({
  _id: { type: String, required: true, default: shortId.generate },
  username: { type: String, required: true},
  count: { type: Number, default: 0},
  log: [
    {
      description: { type: String },
      duration: { type: Number },
      date: { type: Date }
    }
  ]
});

module.exports = mongoose.model("UserSchema", userSchema);
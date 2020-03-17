const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  login: String,
  email: String,
  password: String,
  scoreArray: Array,
  categoriesArray: Array,
  spendingArray: Array,
  allAmount: Number,
  allSpending: Number
});

let userModel = mongoose.model("user", userSchema);

module.exports = userModel;

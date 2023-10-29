const mongoose = require("mongoose");
const userschema = new mongoose.Schema({
  fristname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
userschema.index({ email: 1 }, { unique: true });

const register = new mongoose.model("register", userschema);
module.exports = register;

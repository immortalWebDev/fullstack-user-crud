const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  age: Number,
  gender: String,
  phone: String,
  city: String,
  country: String,
  occupation: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);

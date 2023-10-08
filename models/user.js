const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    first: {
      type: String,
      required: true,
      trim: true,
    },
    last: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    number:{
      type:String,
      required:true,
      trim:true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    lastVisit: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;

const mongoose = require("mongoose");

const userCredentialSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
      },
  },
  {
    timestamps: true,
  }
);

const UserCredential = mongoose.model("UserCredential", userCredentialSchema);

module.exports = UserCredential;

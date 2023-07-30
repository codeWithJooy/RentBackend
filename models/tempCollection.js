const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    due: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const TempCollection = mongoose.model("TempCollection", collectionSchema);

module.exports = TempCollection;

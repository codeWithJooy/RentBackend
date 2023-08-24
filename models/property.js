const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    contact: {
      type: String,
      required: true,
      trim: true,
    },
    pincode: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      trim: true,
    },
    floors: {
      type: String,
      default: "0",
    }
  },
  {
    timestamps: true,
  }
);

const PropertyDetails = mongoose.model("PropertyDetails", propertySchema);

module.exports = PropertyDetails;

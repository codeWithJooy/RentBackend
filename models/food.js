const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    activated: {
      type: Boolean,
      default: false,
    },
    timeSet: {
      type: Boolean,
      default: false,
    },
    time: {
      type: [],
      default: [],
    },
    days: {
      type: [],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Food = mongoose.model("Food", foodSchema);

module.exports = Food;

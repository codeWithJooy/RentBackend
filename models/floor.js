const mongoose = require("mongoose");

const floorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    floorPresent: {
      type: Boolean,
      default: false,
    },
    totalFloors: {
      type: Number,
      default: 0,
    },
    floors: {
      type: [],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Floor = mongoose.model("Floor", floorSchema);

module.exports = Floor;

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
    name: {
      type: String,
      required: true
    },
    roomAdded: {
      type: Boolean,
      default: false,
    },
    roomsType: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Floor = mongoose.model("Floor", floorSchema);

module.exports = Floor;

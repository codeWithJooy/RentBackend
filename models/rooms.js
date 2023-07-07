const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    floorName: {
      type: String,
      required: true,
    },
    roomPresent: {
      type: Boolean,
      default: false,
    },
    rooms: {
      type: [],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Rooms = mongoose.model("Rooms", roomSchema);

module.exports = Rooms;

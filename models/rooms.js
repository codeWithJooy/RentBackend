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
    floorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    rate: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Rooms = mongoose.model("Rooms", roomSchema);

module.exports = Rooms;

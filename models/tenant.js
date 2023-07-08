const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    roomId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    number: {
      type: String,
      required: true,
      trim: true,
    },
    doj: {
      type: String,
      required: true,
    },
    dues: {
      type: [],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Tenant = mongoose.model("Tenant", tenantSchema);

module.exports = Tenant;

const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema(
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
    discounts: {
      type: [],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Discount = mongoose.model("Discount", discountSchema);

module.exports = Discount;

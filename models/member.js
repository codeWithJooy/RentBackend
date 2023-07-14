const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    personal: {
      type: Object,
      require: true,
    },
    kyc: {
      type: Object,
      require: true,
    },
    current: {
      type: Object,
    },
    permanent: {
      type: Object,
    },
    job: {
      type: Object,
    },
    bank: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

const Member = mongoose.model("Member", memberSchema);
module.exports = Member;

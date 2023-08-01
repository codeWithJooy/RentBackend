const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
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
            required:true,
        },
        subType: {
            type: String,
            required:true,
    },
    description: {
      type: String,
      required:true,
        },
    raisedOn: {
      type: String,
      required:true,
        },
        status: {
            type: String,
            required: true,
            default:"Complaint Received"
    },
    read: {
      type: Boolean,
      default:false,
      
        }
  },
  {
    timestamps: true,
  }
);

const Complaint = mongoose.model("Complaint", complaintSchema);

module.exports = Complaint;
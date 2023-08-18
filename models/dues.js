const mongoose = require("mongoose");

const duesSchema = new mongoose.Schema(
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
        dueType: {
            type: String,
            required: true
        },
        rent: {
            type: String,
            default: "NA"
        },
        total: {
            type: String,
            required: true
        },
        due: {
            type: String,
            required: true
        },
        collections: {
            type: String,
            required: true
        },
        discount: {
            type: String,
            required: true
        },
        description: {
            type: String,
        },
        dueDate: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true,
    }
);

const Dues = mongoose.model("Dues", duesSchema);

module.exports = Dues;

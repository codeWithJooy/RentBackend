const mongoose = require("mongoose")

const parentSchema = new mongoose.Schema(
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
        fatherName: {
            type: String,
        },
        fatherNumber: {
            type: String,
        },
        motherName: {
            type: String,
        },
        motherNumber: {
            type: String,
        },
        occupation: {
            type: String,
        },
    },
    {
        timestamps: true
    }
)

const TenantParents = mongoose.model("TenantParents", parentSchema)
module.exports = TenantParents
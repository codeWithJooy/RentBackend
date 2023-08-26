const mongoose = require("mongoose")

const guardianProfile = new mongoose.Schema(
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
        name: {
            type: String,
        },
        number: {
            type: String,
        },
        address: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
)

const TenantGuardian = mongoose.model("TenantGuardian", guardianProfile)
module.exports = TenantGuardian
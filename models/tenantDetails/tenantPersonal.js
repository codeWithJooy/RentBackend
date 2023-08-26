const mongoose = require("mongoose")

const personalSchema = new mongoose.Schema(
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
        alternateNumber: {
            type: String,
        },
        birthDate: {
            type: String,
        },
        bloodGroup: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
);

const TenantPersonal = mongoose.model("TenantPersonal", personalSchema)
module.exports = TenantPersonal;
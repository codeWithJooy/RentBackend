const mongoose = require("mongoose")

const tenantDocument = new mongoose.Schema(
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
        docType: {
            type: String,
        },
        image: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
)

const TenantDocument = mongoose.model("TenantDocument", tenantDocument)
module.exports = TenantDocument;
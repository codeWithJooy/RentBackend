const mongoose = require("mongoose")

const eviction = new mongoose.Schema(
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
        date: {
            type: String,
            required: true,
        },

    }
)

const Eviction = mongoose.model("Eviction", eviction)
module.exports = Eviction


const mongoose = require("mongoose")

const lateSchema = new mongoose.Schema(
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
        reason: {
            type: String,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        status:{
            type:String,
            default:"Pending",
        }
    }

)

const Late = mongoose.model("Late", lateSchema)
module.exports = Late
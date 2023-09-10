const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema(
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
        message: {
            type: String,
            required: true,
        }
    }

)

const StudentNotifications = mongoose.model("StudentNotifications", notificationSchema)
module.exports = StudentNotifications
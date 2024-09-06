const mongoose=require("mongoose")

const contactAddSchema=new mongoose.Schema(
    {
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true
        },
        propertyId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
        },
        contactType:{
            type:String,
            required:true,
        },
        contactName:{
            type:String,
            required:true,
        },
        contactNumber:{
            type:String,
            required:true,
        }
    },
    {
        timestamps:true,
    }
)

const ContactAdd=mongoose.model("ContactAdd",contactAddSchema)
module.exports=ContactAdd

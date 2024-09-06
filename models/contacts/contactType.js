const mongoose=require("mongoose")

const contactTypeSchema=new mongoose.Schema(
    {
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
        },
        propertyId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
        },
        contactType:{
            type:String,
            required:true,
        }
    },
    {
        timestamps:true
    }

)

const ContactType=mongoose.model("ContactType",contactTypeSchema)
module.exports=ContactType
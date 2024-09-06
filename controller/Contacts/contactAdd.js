const ContactAdd=require("../../models/contacts/contactsAdd")
const ContactType=require("../../models/contacts/contactsAdd")

const addContact=async(req,res)=>{
    try{
      const {userId,propertyId,contactType,contactName,contactNumber}=req.body
     const contactAddDoc=await ContactAdd.findOne({userId,propertyId,contactType,contactName,contactNumber})
     if(!contactAddDoc){
        const data={
            userId,
            propertyId,
            contactType,
            contactName,
            contactNumber
        }
        await new ContactAdd(data).save()
        return res.send({code:200,message:"Contact Added Successfully"})
     }  
     else{
        return res.send({code:409,message:"Contact Already Present"})
     }
    }
    catch(error){
        return res.json({code:502,messgae:error.message})
    }
}
const getContact=async(req,res)=>{
    try{
        const {userId,propertyId}=req.query
        const contactsDoc=await ContactAdd.find({userId,propertyId})
        if(contactsDoc){
            return res.send({code:200,model:contactsDoc})
        }
        else{
            return res.send({code:404,message:"No Contacts Found"})
        }
    }
    catch(error){
        return res.send({code:502,message:error.message})
    }
}

module.exports={
    addContact,
    getContact,
}
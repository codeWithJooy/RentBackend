const ContactType=require("../../models/contacts/contactType")


const postContactType=async(req,res)=>{
    try{
      const {userId,propertyId,contactType}=req.body
      const query={userId,propertyId,contactType}
      const contactTypeDoc=await ContactType.findOne(query)
      if(!contactTypeDoc){
        await new ContactType(query).save()
        return res.send({code:200,message:"Contact Type Added Successfully"})
      }
      else{
        return res.send({code:409,message:"Contact Type Already Present"})
      }
    }
    catch(error){
       return res.send({code:502,message:error.message})
    }

}
const getContactTypes=async(req,res)=>{
  try{
    const {userId,propertyId}=req.query
    const query={userId,propertyId}
    const contactTypeDoc=await ContactType.find(query)
    if(contactTypeDoc){
      return res.send({code:200,model:contactTypeDoc})
    }
    else{
      return res.send({code:404,message:"No Contact Type Found"})
    }
  }catch(error){
    return res.send({code:502,message:error.message})
  }
}

module.exports={
    postContactType,
    getContactTypes,
}
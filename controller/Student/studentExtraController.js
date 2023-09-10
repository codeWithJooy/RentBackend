const mongoose = require("mongoose")
const Eviction = require("../../models/studentExtra/eviction")
const Hosting = require("../../models/studentExtra/hosting")
const Late = require("../../models/studentExtra/late")
const StudentNotifications=require("../../models/studentExtra/studentNotifications")
const { getTenantName, getTenantRoom } = require("../../helper/tenantHelper")

const getStudentNotifications=async(req,res)=>{
    try{
       let {userId,propertyId,tenantId}=req.query
       let stuNot=await StudentNotifications.find({userId,propertyId,tenantId,view:"New"}).exec()
       let arr=[]
       if(stuNot){
          for(let i =0;i<stuNot.length;i++){
              let obj={}
              obj.type=stuNot[i].type
              obj.status=stuNot[i].status
              obj.message=stuNot[i].message
              obj.date=stuNot[i].date

              arr.push(obj)
          }
          return res.json({code:200,model:arr})
       }
       return res.json({code:200,model:[],msg:"No New Notifications"})
    }
    catch(error){
        return res.json({code:502,msg:error.message})
    }
}
const updateStudentNotifications=async(req,res)=>{
    try{
       let {userId,propertyId,tenantId}=req.query
       let stuNot=await StudentNotifications.find({userId,propertyId,tenantId,view:"New"}).exec()
       let arr=[]
       if(stuNot){
          for(let i =0;i<stuNot.length;i++){
              stuNot[i].view="Seen"
              stuNot[i].markModified("view")
              stuNot[i].save()
          }
          return res.json({code:200,msg:"Done Seen"})
       }
       return res.json({code:200,model:[],msg:"No New Notifications"})
    }
    catch(error){
        return res.json({code:502,msg:error.message})
    }
}
const getStudentNotificationsCount=async(req,res)=>{
    try{
       let {userId,propertyId,tenantId}=req.query
       let stuNot=await StudentNotifications.find({userId,propertyId,tenantId,view:"New"}).exec()
       let arr=[]
       if(stuNot){
          return res.json({code:200,model:stuNot.length})
       }
       return res.json({code:200,model:0,msg:"No New Notifications"})
    }
    catch(error){
        return res.json({code:502,msg:error.message})
    }
}
const addStudentHosting = async (req, res) => {
    try {
        const { userId, propertyId, tenantId } = req.query
        const { name,phone, from, to,presentDate } = req.body
        let message=`Request for Hosting ${name} from ${from} to ${to} send.`
        let present=Hosting.findOne({userId,propertyId,tenantId,status:"Pending"}).exec()
        if(present && present.length !=1){
            let hosting=await new Hosting({userId,propertyId,tenantId,name,phone,from,to}).save()
        let notification=await new StudentNotifications({userId,propertyId,tenantId,type:"Hosting A Frined",status:"Pending",date:presentDate,message}).save()
        return res.json({code:200,msg:"Request Send"})
        }
        else{
            return res.json({code:404,msg:"Earlier Reuest Still Pending "})
        }
    }
    catch (error) {
        return res.json({ code: 502, msg: error.message })
    }
}
const getHosting=async(req,res)=>{
    try{
       const {userId,propertyId}=req.query
       let hosting=await Hosting.find({userId,propertyId,status:"Pending"}).exec()
       let arr=[]
       if(hosting && hosting.length >0){
         for(let i=0;i<hosting.length;i++){
            let obj={}
            obj.name=await getTenantName(hosting[i].tenantId)
            obj.room=await getTenantRoom(hosting[i].getTenantRoom)
            obj.userId=userId
            obj.propertyId=propertyId
            obj.tenantId=hosting[i].tenantId
            obj.friend=hosting[i].name
            obj.phone=hosting[i].phone
            obj.from=hosting[i].from
            obj.to=hosting[i].to
            obj.hostingId=hosting[i]._id
            arr.push(obj)
         }
         return res.json({code:200,model:arr})
       }
       else{
        return res.json({code:200,model:arr})
       }
    }
    catch(error){
      return res.json({code:502,msg:error.messsage})
    }
}
const updateHosting=async(req,res)=>{
    try{
        const {userId,propertyId,tenantId,hostingId,status}=req.query
        const {name,from,to,presentDate}=req.body
        let hosting=await Hosting.find({_id:hostingId}).exec()
        if(hosting){
            hosting.status=status
            hosting.markModified("status")
            hosting.save()
            let message=`Request for Hosting ${name} from ${from} to ${to} updated.`
            let notification=await new StudentNotifications({userId,propertyId,tenantId,type:"Hosting A Frined",status,date:presentDate,message}).save()
            return res.json({code:200,msg:"Hosting Status Updated"})
        }

    }
    catch(error){
        return res.json({code:502,msg:error.messsage})
    }
}
const addStudentEviction = async (req, res) => {
    try {
        const { userId, propertyId, tenantId } = req.query
        const { name, from, to } = req.body

        let

    }
    catch (error) {
        return res.json({ code: 502, msg: error.message })
    }
}
const addStudentLate = async (req, res) => {
    try {
        const { userId, propertyId, tenantId } = req.query
        const { reason,time,presentDate } = req.body
        let message=`Request for late arrival due to ${reason} by  ${time} is pending`
        let lete=new Late({userId,propertyId,tenantId,reason,time}).save()
        let notification=new StudentNotifications({userId,propertyId,tenantId,type:"Late Arrival",status:"Pending",date:presentDate,message}).save()
        return res.json({code:200,msg:"Request Send"})
    }
    catch (error) {
        return res.json({ code: 502, msg: error.message })
    }
}
module.exports = {
    addStudentHosting,
    getHosting,
    updateHosting,
    addStudentEviction,
    addStudentLate,
    getStudentNotifications,
    getStudentNotificationsCount,
    updateStudentNotifications,
}
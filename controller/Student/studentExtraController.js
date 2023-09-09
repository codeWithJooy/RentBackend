const mongoose = require("mongoose")
const Eviction = require("../../models/studentExtra/eviction")
const Hosting = require("../../models/studentExtra/hosting")
const Late = require("../../models/studentExtra/late")
const StudentNotifications=require("../../models/studentExtra/studentNotifications")

const addStudentHosting = async (req, res) => {
    try {
        const { userId, propertyId, tenantId } = req.query
        const { name,phone, from, to,presentDate } = req.body
        let message=`Request for Hosting ${name} from ${from} to ${to} send.`
        let present=Hosting.findOne({userId,propertyId,tenantId,status:"Pending"}).exec()
        if(!present){
            let hosting=await new Hosting({userId,propertyId,tenantId,name,phone,from,to}).save()
        let notification=await new StudentNotifications({userId,propertyId,tenantId,date:presentDate,message}).save()
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
        const { date,time,presentDate } = req.body
        let message=`Request for late arrival on ${date} by time ${time}`
        let lete=new Late({userId,propertyId,tenantId,date,time}).save()
        let notification=new StudentNotification({userId,propertyId,tenantId,date:presentDate,message})
        return res.json({code:200,msg:"Request Send"})
    }
    catch (error) {
        return res.json({ code: 502, msg: error.message })
    }
}
module.exports = {
    addStudentHosting,
    addStudentEviction,
    addStudentLate,
}
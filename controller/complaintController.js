const Complaint = require("../models/complaint")
const moment = require("moment")


const raiseComplaint = (req, res) => {
    const { userId, propertyId, tenantId, type, subType, description,raisedOn } = req.body
    let complaint = new Complaint({ userId, propertyId, tenantId, type, subType,description, raisedOn })
    complaint.save()
        .then(() => { return res.json({ code: 200 }) })
        .catch((err)=>{return res.json({code:502,model:err.message})})
}
const getComplaints = (req, res) => {
    
}
const getTotalComplaints = (req, res) => {
    
}
const getStudentComplaints = (req, res) => {
    
}

module.exports = {
    raiseComplaint,
    getComplaints,
    getTotalComplaints,
    getStudentComplaints,
}
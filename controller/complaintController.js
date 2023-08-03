const Complaint = require("../models/complaint")
const Tenant=require("../models/tenant")
const Rooms = require("../models/rooms");
const tenantHelper=require("../helper/tenantHelper")
const moment = require("moment")


const raiseComplaint = (req, res) => {
    const { userId, propertyId, tenantId, type, subType, description,raisedOn } = req.body
    let complaint = new Complaint({ userId, propertyId, tenantId, type, subType,description, raisedOn })
    complaint.save()
        .then(() => { return res.json({ code: 200 }) })
        .catch((err)=>{return res.json({code:502,model:err.message})})
}
const getComplaints = async (req, res) => {
    const { userId, propertyId } = req.query;
  
    try {
      const complaints = await Complaint.find({ userId, propertyId }).exec();
      if (!complaints || complaints.length === 0) {
        return res.json({ code: 404, model: "No Complaint Found" });
      } else {
        const arr = await Promise.all(complaints.map(async (complaint) => {
          const obj = {
            id:complaint._id,
            type: complaint.type,
            subType: complaint.subType,
            description: complaint.description,
            date: complaint.raisedOn,
            status: complaint.status,
            tenantId:complaint.tenantId,
          };
            let {name,roomId} = await tenantHelper.getTenantName(complaint.tenantId);
            obj.name = name;
            obj.room=await tenantHelper.getTenantRoom(userId,propertyId,roomId);
          return obj;
        }));
  
        return res.json({ code: 200, model: arr });
      }
    } catch (err) {
      return res.json({ code: 502, model: err.message });
    }
};
const updateStatus = (req, res) => {
  const { id, status } = req.body
  Complaint.findOne({ _id: id })
    .then((complaint) => {
      if (complaint) {
        complaint.status = status
        complaint.markModified("status")
        complaint.save()
        return res.json({code:200})
             }
           })
  }
const getTotalComplaints = (req, res) => {
    
}
const getStudentComplaints = async (req, res) => {
  const { userId, propertyId,tenantId } = req.query;
  
  try {
    const complaints = await Complaint.find({ userId, propertyId ,tenantId}).exec();
    if (!complaints || complaints.length === 0) {
      return res.json({ code: 404, model: "No Complaint Found" });
    } else {
      const arr = await Promise.all(complaints.map(async (complaint) => {
        const obj = {
          id:complaint._id,
          type: complaint.type,
          subType: complaint.subType,
          description: complaint.description,
          date: complaint.raisedOn,
          status: complaint.status,
        };
        return obj;
      }));

      return res.json({ code: 200, model: arr });
    }
  } catch (err) {
    return res.json({ code: 502, model: err.message });
  }
}

module.exports = {
    raiseComplaint,
    getComplaints,
    getTotalComplaints,
  getStudentComplaints,
    updateStatus,
}
const mongoose = require("mongoose");
const Tenant = require("../models/tenant");
const Dues = require("../models/dues")

const addDuesRoom = async (req, res) => {
  try {
    const { userId, propertyId, roomId } = req.query;
    const { type, rent, total, due, collection, discount, description, dueDate } = req.body

    let tenants = await Tenant.find({ userId, propertyId, roomId }).exec()
    if (tenants) {
      for (let i = 0; i < tenants.length; i++) {
        let duePresent = await Dues.findOne({ userId, propertyId, tenantId: tenants[i]._id, dueType: type }).exec()
        if (duePresent) {
          if (duePresent.due - duePresent.collections > 0) {
            return res.send({ code: 404, msg: "DueType Already Present" })
          }
        }

        let dueData = new Dues({ userId, propertyId, tenantId: tenants[i]._id, dueType: type, rent, total, due, collections: collection, discount, description, dueDate }).save()
      }
      return res.json({ code: 200 })
    }
    else {
      return res.send({ code: 404, msg: "No Tenant Present" })
    }
  }
  catch (error) {
    return res.json({ code: 502, msg: error.message })
  }
};
const addDuesTenant = async (req, res) => {
  try {
    const { userId, propertyId, tenantId } = req.query;
    const { type, rent, total, due, collection, discount, description, dueDate } = req.body
    //Check If Due type present and due Remaining for the type is greater then 0
    let duePresent = await Dues.findOne({ userId, propertyId, tenantId, dueType: type }).exec()
    if (duePresent) {
      if (duePresent.due - duePresent.collections > 0) {
        return res.send({ code: 404, msg: "DueType Already Present" })
      }
    }

    let dueData = new Dues({ userId, propertyId, tenantId, dueType: type, rent, total, due, collections: collection, discount, description, dueDate }).save()

    return res.json({ code: 200 })
  } catch (error) {
    return res.json({ code: 502, msg: error.message })
  }
};
const getDuesTenant = async (req, res) => {
  try {
    const { userId, propertyId, tenantId } = req.query
    const dues = await Dues.find({ userId, propertyId, tenantId }).exec()
    if (dues) {
      let duesFilter = dues.filter((item) => item.status != "pending")
      return res.json({ code: 200, model: duesFilter })
    }
    else {
      return res.json({ code: 404, msg: "No Dues Found" })
    }
  }
  catch (error) {
    return res.json({ code: 502, msg: error.message })
  }
}
const getDues = async (req, res) => {
  try {
    const { userId, propertyId } = req.query
    let due = await Dues.find({ userId, propertyId }).exec()
    if (due) {
      let duesFilter = due.filter((item) => item.status != "pending")
      return res.json({ code: 200, model: duesFilter })

    }
    else {
      return res.json({ code: 404, msg: "Nothing Found" })
    }
  }
  catch (error) {
    return res.json({ code: 502, msg: error.msg })
  }
}
module.exports = {
  addDuesTenant,
  addDuesRoom,
  getDuesTenant,
  getDues,
};

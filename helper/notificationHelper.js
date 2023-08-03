const mongoose = require("mongoose");
const Complaint = require("../models/complaint")
const TempCollection = require("../models/tempCollection")

async function getComplaintCount(userId,propertyId) {
  try {
    const complaint = await Complaint.find({userId,propertyId }).exec();
      return complaint ? complaint.length : 0;
  } catch (error) {
    throw new Error('Error finding tenant: ' + error.message);
  }
}

async function getCollectionCount(userId,propertyId) {
  try {
    const temp = await TempCollection.find({userId,propertyId }).exec();
      return temp ? temp.length : 0;
  } catch (error) {
    throw new Error('Error finding tenant: ' + error.message);
  }
}




module.exports = {
  getComplaintCount,
  getCollectionCount,
};
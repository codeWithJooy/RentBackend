const mongoose = require("mongoose");
const Tenant = require("../models/tenant");
const Rooms=require("../models/rooms")
async function getTenantName(tenantId) {
  try {
    const tenant = await Tenant.findOne({ _id: tenantId }).exec();
      return tenant ? { "name": tenant.name,"roomId":tenant.roomId } : null;
  } catch (error) {
    throw new Error('Error finding tenant: ' + error.message);
  }
}

async function getTenantRoom(userId, propertyId, roomId) {
    try {
      const rooms = await Rooms.find({ userId, propertyId }).exec();
      // Extract all rooms from the floors
      const allRooms = rooms.reduce((acc, curr) => [...acc, ...curr.rooms], []);
      const room = allRooms.find((item) => item.id == roomId);
      return room ? room.name : "Unknown";
    } catch (err) {
      console.log(err);
      return "Unknown";
    }
  }




module.exports = {
    getTenantName,
    getTenantRoom,
};



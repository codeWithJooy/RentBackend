const mongoose = require("mongoose");
const Rooms = require("../models/rooms");

const getRooms = (req, res) => {
  const { userId, propertyId, floorName } = req.query;
  console.log(floorName);
  console.log("Ground Floor");
  Rooms.findOne({
    userId: userId,
    propertyId: propertyId,
    floorName: floorName,
  })
    .then((room) => {
      if (!room) {
        return res.json({ code: 404 });
      } else {
        return res.json({ code: 200, model: room.rooms });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({ code: 502 });
    });
};
module.exports = {
  getRooms,
};

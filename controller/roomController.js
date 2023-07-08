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
const getSingleRoom = (req, res) => {
  const { userId, propertyId, floorName, roomName } = req.query;
  Rooms.findOne({ userId, propertyId, floorName })
    .then((doc) => {
      if (!doc) {
        return res.json({ code: 404 });
      }
      const room = doc.rooms.find((room) => room.name == roomName);
      if (!room) {
        return res.json({ code: 404 });
      }
      return res.json({ code: 200, model: room });
    })
    .catch((error) => res.json({ code: 502 }));
};
const updateRoom = (req, res) => {
  const { userId, propertyId, floorName, id } = req.query;
  const { name, rate } = req.body;

  Rooms.findOne({ userId, propertyId, floorName })
    .then((doc) => {
      if (!doc) {
        return res.json({ code: 404, message: "Room DB Empty" });
      } else {
        const roomIndex = doc.rooms.findIndex((room) => room.id == id);
        if (roomIndex === -1) {
          return res.json({ code: 404, message: "Room Not Found" });
        } else {
          doc.rooms[roomIndex].name = name;
          doc.rooms[roomIndex].rate = rate;
          doc.markModified("rooms");
          doc.save();
          return res.json({ code: 200, message: "Update Successfull" });
        }
      }
    })
    .catch((err) => {
      return res.json({ code: 502, message: err.message });
    });
};
module.exports = {
  getRooms,
  getSingleRoom,
  updateRoom,
};

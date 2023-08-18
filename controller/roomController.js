const mongoose = require("mongoose");
const Rooms = require("../models/rooms");

const getRooms = (req, res) => {
  const { userId, propertyId, floorId } = req.query;
  Rooms.find({
    userId,
    propertyId,
    floorId,
  }).exec()
    .then((room) => {
      if (!room) {
        return res.json({ code: 404 });
      } else {
        return res.json({ code: 200, model: room });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({ code: 502 });
    });
};
const getAllRooms = (req, res) => {
  const { userId, propertyId } = req.query;
  Rooms.find({ userId, propertyId })
    .exec()
    .then((rooms) => {
      if (!rooms) {
        res.json({ code: 404, msg: "No Rooms Present" });
      }
      else {
        res.json({ code: 200, model: rooms });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({ code: 502, msg: err.message });
    });
};
const getSingleRoom = (req, res) => {
  const { userId, propertyId, roomId } = req.query;
  Rooms.findOne({ userId, propertyId, _id: roomId }).exec()
    .then((doc) => {
      if (!doc) {
        return res.json({ code: 404 });
      }
      return res.json({ code: 200, model: doc });
    })
    .catch((error) => res.json({ code: 502 }));
};
const updateRoom = (req, res) => {
  const { userId, propertyId, roomId } = req.query;
  const { name, rate } = req.body;

  Rooms.findOne({ userId, propertyId, _id: roomId })
    .then((doc) => {
      if (!doc) {
        return res.json({ code: 404, message: "Room DB Empty" });
      } else {

        doc.name = name;
        doc.rate = rate;
        doc.markModified("name");
        doc.markModified("rate")
        doc.save();
        return res.json({ code: 200, message: "Update Successfull" });

      }
    })
    .catch((err) => {
      return res.json({ code: 502, message: err.message });
    });
};
const getRoomName = (req, res) => {
  const { userId, propertyId, roomId } = req.query;

  Rooms.findOne({ userId, propertyId, roomId })
    .exec()
    .then((room) => {

      if (!room) {
        res.json({ code: 200, model: "Unknown" });
      } else {
        res.json({ code: 200, model: room.name });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({ code: 502, msg: err.message });
    });
};
const getTotalRoomCounts = (req, res) => {
  const { userId, propertyId } = req.query;
  Rooms.find({ userId, propertyId })
    .exec()
    .then((rooms) => {
      const count = rooms.reduce((acc, curr) => acc + curr.rooms.length, 0);
      return res.json({ code: 200, model: count });
    })
    .catch((err) => {
      return err.message;
    });
};

module.exports = {
  getRooms,
  getSingleRoom,
  updateRoom,
  getAllRooms,
  getRoomName,
  getTotalRoomCounts,
};

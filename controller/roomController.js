const mongoose = require("mongoose");
const Rooms = require("../models/rooms");

const getRooms = (req, res) => {
  const { userId, propertyId, floorName } = req.query;
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
const getAllRooms = (req, res) => {
  const { userId, propertyId } = req.query;
  Rooms.find({ userId, propertyId })
    .exec()
    .then((rooms) => {
      // Extract all rooms from the floors
      const allRooms = rooms.reduce((acc, curr) => [...acc, ...curr.rooms], []);

      // Check if any rooms are present
      if (allRooms.length === 0) {
        res.json({ code: 200, model: [] });
      } else {
        res.json({ code: 200, model: allRooms });
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
const getRoomName = (req, res) => {
  const { userId, propertyId, roomId } = req.query;

  Rooms.find({ userId, propertyId })
    .exec()
    .then((rooms) => {
      // Extract all rooms from the floors
      const allRooms = rooms.reduce((acc, curr) => [...acc, ...curr.rooms], []);
      const room = allRooms.filter((item) => item.id == roomId);
      if (!room) {
        res.json({ code: 200, model: "Unknown" });
      } else {
        res.json({ code: 200, model: room[0].name });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({ code: 502 });
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

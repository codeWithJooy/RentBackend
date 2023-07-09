const mongoose = require("mongoose");
const PropertyDetails = require("../models/property");
const Floor = require("../models/floor");
const Rooms = require("../models/rooms");
const roomAddHelper = require("../helper/roomAddHelper");

const addProperty = (req, res) => {
  const { name, contact, pincode, userId } = req.body;
  const newProperty = new PropertyDetails({ userId, name, contact, pincode });
  newProperty
    .save()
    .then(() =>
      res.json({
        code: 200,
        message: "Property Added",
        userId,
        propertyId: newProperty._id,
        propertyName: name,
      })
    )
    .catch((err) => res.status(400).json({ code: 200, message: err.message }));
};

const addFloor = (req, res) => {
  const { userId, propertyId, floorCount } = req.body;
  console.log(floorCount);
  let arr = [];
  for (let i = 0; i <= floorCount; i++) {
    if (i == 0) {
      arr.push({
        name: "Ground Floor",
        roomsAdded: false,
        roomsType: { single: 0, double: 0, triple: 0 },
        rooms: [],
      });
    } else {
      arr.push({
        name: "Floor " + i,
        roomsAdded: false,
        roomsType: { single: 0, double: 0, triple: 0 },
        rooms: [],
      });
    }
  }
  const floorAdd = new Floor({
    userId,
    propertyId,
    floorPresent: true,
    totalFloors: floorCount,
    floors: arr,
  });
  floorAdd
    .save()
    .then(() => res.json({ code: 200 }))
    .catch((err) => res.json({ code: 500 }));
};
const getFloorPresent = (req, res) => {
  const { userId, propertyId } = req.body;
  let user = new mongoose.Types.ObjectId(userId);
  let property = new mongoose.Types.ObjectId(propertyId);

  Floor.findOne({ userId: user, propertyId: property })
    .then((unit) => {
      if (!unit) {
        return res.json({ code: 200, floorPresent: false });
      }
      return res.json({ code: 200, floorPresent: unit.floorPresent });
    })
    .catch((error) => res.status(500));
};
const addRoom = async (req, res) => {
  const { userId, propertyId, floorName, single, double, triple } = req.body;

  //Get the Document Id
  let user = new mongoose.Types.ObjectId(userId);
  let documentId = null;

  Floor.findOne({ userId: userId, propertyId: propertyId })
    .then((document) => {
      if (!document) {
        console.log("Document Not Found");
        return;
      }
      const floorIndex = document.floors.findIndex(
        (floor) => floor.name === floorName
      );
      if (floorIndex === -1) {
        console.log("Floor not found.");
        return;
      }

      document.floors[floorIndex].roomsAdded = true;
      document.floors[floorIndex].roomsType = {
        single: single,
        double: double,
        triple: triple,
      };
      document.floors[floorIndex].rooms = [
        { single: single },
        { double: double },
        { triple: triple },
      ];
      document.markModified("floors");
      document.save();
      //res.json({ code: 200, message: "Rooms Added" });
      Rooms.findOne({ userId: userId, propertyId: propertyId, floorName }).then(
        (room) => {
          if (!room) {
            let roomTypes = {
              single: single,
              double: double,
              triple: triple,
            };
            const arr = roomAddHelper(floorName, roomTypes);
            const roomAdd = new Rooms({
              userId,
              propertyId,
              floorName,
              roomPresent: true,
              rooms: arr,
            });
            roomAdd
              .save()
              .then(() => res.json({ code: 200, message: "Rooms Added" }));
          }
        }
      );
    })
    .catch((error) => {
      res.status(404).json({ code: 404, message: "Document Not Found" });
    });
};
const getFloors = (req, res) => {
  const { userId, propertyId } = req.query;
  Floor.findOne({ userId, propertyId })
    .then((floor) => {
      if (!floor) {
        return res.json({ code: 404 });
      }
      res.json({ code: 200, model: floor.floors });
    })
    .catch((error) => {
      console.log(error);
      return res.json({ code: 404 });
    });
};
module.exports = {
  addProperty,
  addFloor,
  addRoom,
  getFloorPresent,
  getFloors,
};

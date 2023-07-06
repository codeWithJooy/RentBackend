const mongoose = require("mongoose");
const PropertyDetails = require("../models/property");
const Floor = require("../models/floor");

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
        roomsType: {},
        rooms: [],
      });
    } else {
      arr.push({
        name: "Floor " + i,
        roomsAdded: false,
        roomsType: {},
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
    .catch((err) => res.status(400).json({ code: 400 }));
};

const addRoom = async (req, res) => {
  const { userId, propertyId, floorName, single, double, triple } = req.body;

  //Get the Document Id
  let user = new mongoose.Types.ObjectId(userId);
  let documentId = null;

  Floor.findOne({ userId: new mongoose.Types.ObjectId(userId) })
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
      document.floors[floorIndex].rooms = [
        { single: single },
        { double: double },
        { triple: triple },
      ];
      document.markModified("floors");
      document.save();
      res.json({ code: 200, message: "Rooms Added" });
    })
    .catch((error) => {
      res.status(404).json({ code: 404, message: "Document Not Found" });
    });
};
module.exports = {
  addProperty,
  addFloor,
  addRoom,
};

const mongoose = require("mongoose");
const PropertyDetails = require("../models/property");
const Floor = require("../models/floor");
const Rooms = require("../models/rooms");
const Member = require("../models/member");
const moment = require("moment");
const roomAddHelper = require("../helper/roomAddHelper");

const addFloors = (req, res) => {
    const { userId, propertyId, floorCount } = req.body;
    let arr = [];
    for (let i = 0; i <= floorCount; i++) {
        if (i == 0) {
            arr.push({
                userId,
                propertyId,
                name: "Ground Floor",
                roomsAdded: false,
                roomsType: { single: 0, double: 0, triple: 0 },

            });
        } else {
            arr.push({
                userId,
                propertyId,
                name: "Floor " + i,
                roomsAdded: false,
                roomsType: { single: 0, double: 0, triple: 0 },

            });
        }
    }
    Floor.insertMany(arr)
        .then(() => {
            PropertyDetails.findOne({ _id: propertyId, userId })
                .then((property) => {
                    if (property) {
                        property.floors = arr.length
                        property.markModified("floors")
                        property.save()
                        return res.json({ code: 200 })
                    }
                })
        }).catch((error) => { return res.json({ code: 502, msg: error.message }) })
};
//Updated
const getFloorPresent = async (req, res) => {
    try {
        const { userId, propertyId } = req.body;

        const propertyUnit = await PropertyDetails.findOne({ _id: propertyId, userId }).exec()
        const present = parseInt(propertyUnit.floors) > 0 ? true : false;
        return res.json({ code: 200, floorPresent: present })


    } catch (error) {
        return res.json({ code: 502, msg: error.Message })
    }
};

const addRoom = async (req, res) => {
    const { userId, propertyId, floorName, floorId, single, double, triple } = req.body;

    //Get the Document Id
    let user = new mongoose.Types.ObjectId(userId);
    let documentId = null;

    Floor.findOne({ _id: floorId, userId, propertyId })
        .then((document) => {
            if (!document) {
                console.log("Document Not Found");
                return res.json({ code: 404, msg: "Floor Not Found" })
            }
            document.roomAdded = true;
            document.roomsType = {
                single: single,
                double: double,
                triple: triple,
            };

            document.markModified("roomAdded");
            document.markModified("roomsType");
            document.save();
            let roomsType = {
                single,
                double,
                triple,
            }
            //res.json({ code: 200, message: "Rooms Added" });
            const arr = roomAddHelper(floorName, userId, propertyId, floorId, roomsType);
            Rooms.insertMany(arr)
                .then(() => { return res.json({ code: 200 }) })
        })
        .catch((error) => {
            res.json({ code: 502, message: error.message });
        });
};
const getFloors = (req, res) => {
    const { userId, propertyId } = req.query;
    Floor.find({ userId, propertyId })
        .then((floor) => {
            if (!floor) {
                return res.json({ code: 404 });
            }
            res.json({ code: 200, model: floor });
        })
        .catch((error) => {
            console.log(error);
            return res.json({ code: 404 });
        });
};
module.exports = {
    addFloors,
    addRoom,
    getFloorPresent,
    getFloors,
};
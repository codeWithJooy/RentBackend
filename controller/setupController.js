const mongoose = require("mongoose");
const PropertyDetails = require("../models/property");
const Floor = require("../models/floor");
const Rooms = require("../models/rooms");
const Member = require("../models/member");
const moment = require("moment");
const roomAddHelper = require("../helper/roomAddHelper");

const addProperty = async (req, res) => {
  const { name, contact, pincode, userId } = req.body;
  let present = true
  let code = ""
  while (present) {
    code = Math.floor(100000 + Math.random() * 900000).toString()
    let property = await PropertyDetails.findOne({ code }).exec()
    if (!property) {
      present = false
    }
  }

  const newProperty = new PropertyDetails({ userId, name, contact, pincode, code });
  newProperty
    .save()
    .then(() => {
      const newMember = new Member({
        userId,
        propertyId: newProperty._id,
        phone: contact,
        personal: {
          name: "Owner",
          phone: contact,
          doj: moment().format("DD-MM-YYYY"),
          designation: "Admin",
        },
        kyc: {},
        current: {
          address: "",
          pincode: "",
          city: "",
          state: "",
        },
        permanent: {
          address: "",
          pincode: "",
          city: "",
          state: "",
        },
        job: {},
        bank: {
          account: "",
          name: "",
          ifsc: "",
          holder: "",
        },
      });
      newMember
        .save()
        .then(() => {
          return res.json({
            code: 200,
            message: "Property Added",
            userId,
            propertyId: newProperty._id,
            propertyName: name,
            propertyCode: newProperty.code,
            pincode: newProperty.pincode,
            contact: newProperty.contact,
          });
        })
        .catch((err) => {
          return res.json({ code: 502, model: err.message });
        });
    })
    .catch((err) => {
      return res.status(400).json({ code: 200, message: err.message });
    });
};

module.exports = {
  addProperty,
};

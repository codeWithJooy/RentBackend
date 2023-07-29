const mongoose = require("mongoose");
const Property = require("../../models/property");
const Tenant = require("../../models/tenant");
const Student = require("../../models/student");

const checkCodeNumber = (req, res) => {
  const { code, number } = req.query;
  Property.findOne({ code })
    .then((property) => {
      if (property) {
        const userId = property.userId;
        const propertyId = property._id;
        const propertyName = property.name;
        Tenant.findOne({ userId, propertyId, number })
          .then((tenant) => {
            if (tenant) {
              let obj = {};
              obj.userId = userId;
              obj.propertyId = propertyId;
              obj.propertyName = propertyName;
              obj.name = tenant.name;
              obj.tenantId = tenant._id;
              obj.number = number;
              return res.json({ code: 200, model: obj });
            } else {
              return res.json({ code: 404, model: "No Tenant Found" });
            }
          })
          .catch((err) => {
            return res.json({ code: 502, model: err.message });
          });
      } else {
        return res.json({ code: 404, model: "Incorrect PG Code" });
      }
    })
    .catch((err) => {
      return res.json({ code: 502, model: err.message });
    });
};
const addStudent = (req, res) => {
  const {
    userId,
    propertyId,
    propertyName,
    tenantId,
    email,
    name,
    number,
    password,
  } = req.body;

  Student.findOne({ number })
    .then((student) => {
      if (student) {
        return res.json({ code: 409, model: "Tenant Already Present" });
      } else {
        let newStudent = new Student({
          userId,
          propertyId,
          propertyName,
          tenantId,
          email,
          number,
          name,
          password,
        });
        newStudent
          .save()
          .then(() => {
            return res.json({ code: 200, model: newStudent });
          })
          .catch((err) => {
            return res.json({ code: 502, model: err.message });
          });
      }
    })
    .catch((err) => {
      return res.json({ code: 502, model: err.message });
    });
};

module.exports = {
  checkCodeNumber,
  addStudent,
};

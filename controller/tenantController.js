const mongoose = require("mongoose");
const Tenant = require("../models/tenant");

const addTenant = (req, res) => {
  const { userId, propertyId, roomId, name, number, doj, dues } = req.body;
  Tenant.findOne({ userId, propertyId, number })
    .then((tenant) => {
      if (tenant) {
        return res.json({ code: 403 });
      }
      const newTenant = new Tenant({
        userId,
        propertyId,
        roomId,
        name,
        number,
        doj,
        dues,
      });
      newTenant
        .save()
        .then(() => {
          return res.json({ code: 200 });
        })
        .catch((error) => res.json({ code: 502 }));
    })
    .catch((error) => {
      return res.json({ code: 502 });
    });
};
const getTenants = (req, res) => {
  const { userId, propertyId } = req.query;
  Tenant.find({ userId, propertyId })
    .then((docs) => {
      if (!docs) {
        return res.json({ code: 404 });
      }
      return res.json({ code: 200, model: docs });
    })
    .catch((err) => {
      return res.json({ code: 502 });
    });
};
const getDuesTenant = () => {};
module.exports = {
  getTenants,
  addTenant,
};

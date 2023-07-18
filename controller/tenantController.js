const mongoose = require("mongoose");
const Tenant = require("../models/tenant");
const Collection = require("../models/collection");
const Discount = require("../models/discount");

const addTenant = (req, res) => {
  const {
    userId,
    propertyId,
    roomId,
    name,
    number,
    dob,
    dues,
    collections,
    discounts,
  } = req.body;
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
        dob,
        dues,
      });
      newTenant
        .save()
        .then(() => {
          const newColllection = new Collection({
            userId,
            propertyId,
            tenantId: newTenant._id,
            collections: collections,
          });
          newColllection
            .save()
            .then(() => {
              const newDiscount = new Discount({
                userId,
                propertyId,
                tenantId: newTenant._id,
                discounts: discounts,
              });
              newDiscount
                .save()
                .then(() => {
                  return res.json({ code: 200 });
                })
                .catch((err) => {
                  return res.json({ code: 502, model: err.message });
                });
            })
            .catch((err) => {
              return res.json({ code: 502, model: err.message });
            });
        })
        .catch((error) => {
          return res.json({ code: 502, model: error.message });
        });
    })
    .catch((error) => {
      return res.json({ code: 502, model: error.message });
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
const getATenant = (req, res) => {
  const { userId, propertyId, tenantId } = req.query;
  Tenant.findOne({ userId, propertyId, _id: tenantId })
    .then((tenant) => {
      if (!tenant) {
        return res.json({ code: 404, mode: "No Tenant Found" });
      }
      return res.json({ code: 200, model: tenant });
    })
    .catch((error) => {
      return res.json({ code: 502, model: error.message });
    });
};
const getDuesTenant = () => {};
module.exports = {
  getTenants,
  addTenant,
  getATenant,
};

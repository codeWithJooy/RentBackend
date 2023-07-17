const mongoose = require("mongoose");
const Collection = require("../models/collection");

const addCollection = (req, res) => {
  const { userId, propertyId, tenantId } = req.query;
  const { type, amount, date, mode } = req.body;
  let obj = {
    type,
    amount,
    date,
    mode,
  };
  Collection.findOne({
    $and: [
      { userId: userId },
      { propertyId: propertyId },
      { tenantId: tenantId },
    ],
  })
    .then((collection) => {
      if (!collection) {
        let arr = [];
        arr.push(obj);
        const newColllection = new Collection({
          userId,
          propertyId,
          tenantId,
          collections: arr,
        });
        newColllection
          .save()
          .then(() => {
            return res.json({ code: 200 });
          })
          .catch((err) => {
            return res.json({ code: 502, model: err.message });
          });
      } else {
        collection.collections.push(obj);
        collection.markModified("collections");
        collection.save();
        return res.json({ code: 200 });
      }
    })
    .catch((err) => {
      return res.json({ code: 502, model: err.message });
    });
};
const getCollection = (req, res) => {
  const { userId, propertyId, tenantId } = req.query;
  console.log(tenantId);
  Collection.findOne({ tenantId })
    .then((collection) => {
      if (!collection) {
        return res.json({ code: 200, model: [], message: "Not Present" });
      } else {
        return res.json({ code: 200, model: collection.collections });
      }
    })
    .catch((err) => {
      return res.json({ code: 502, model: err.message });
    });
};
const getAllCollections = (req, res) => {
  const { userId, propertyId } = req.query;
  Collection.find({
    $and: [{ userId: userId }, { propertyId: propertyId }],
  })
    .then((collection) => {
      if (!collection) {
        return res.json({ code: 200, model: [] });
      } else {
        return res.json({ code: 200, model: collection });
      }
    })
    .catch((err) => {
      return res.json({ code: 502, model: err.message });
    });
};
module.exports = {
  addCollection,
  getCollection,
  getAllCollections,
};

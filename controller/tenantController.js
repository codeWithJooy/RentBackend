const mongoose = require("mongoose");
const Tenant = require("../models/tenant");
const Collection = require("../models/collection");
const Discount = require("../models/discount");
const Receipt = require("../models/receipt");

const addTenant = (req, res) => {
  let {
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
                  for (let i = 0; i < collections.length; i++) {
                    let arr = collections[i].receiptId.split("/");

                    Receipt.findOne({
                      userId,
                      propertyId,
                      dueType: arr[1],
                      month: arr[2],
                      year: arr[3],
                    }).then((receipt) => {
                      if (receipt) {
                        receipt.count = collections[i].receiptId;
                        receipt.markModified("count");
                        receipt.save();
                      } else {
                        const newRece = new Receipt({
                          userId,
                          propertyId,
                          dueType: arr[1],
                          month: arr[2],
                          year: arr[3],
                          count: collections[i].receiptId,
                        });
                        newRece.save();
                      }
                    });
                  }
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
//Teanant Count is Based on RoomId
const getTenantCount = (req, res) => {
  const { userId, propertyId, roomId } = req.query;
  let obj = {};
  Tenant.find({ userId, propertyId, roomId })
    .exec()
    .then((tenants) => {
      if (tenants) {
        let filteredTenants = tenants.filter((user) => user.roomId == roomId);

        return res.json({ code: 200, model: filteredTenants.length });
      } else {
        return res.json({ code: 200, model: 0 });
      }
    })
    .catch((err) => {
      return res.json({ code: 502, model: err.message });
    });
};
const getAllTenantsCount = (req, res) => {
  const { userId, propertyId } = req.query;
  Tenant.find({ userId, propertyId })
    .exec()
    .then((tenants) => {
      if (tenants) {
        return res.json({ code: 200, model: tenants.length });
      } else {
        return res.json({ code: 200, model: 0 });
      }
    })
    .catch((err) => {
      return res.json({ code: 502, model: error.message });
    });
};
const getDuesTenant = () => {};
module.exports = {
  getTenants,
  addTenant,
  getATenant,
  getTenantCount,
  getAllTenantsCount,
};

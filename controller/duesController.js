const mongoose = require("mongoose");
const Tenant = require("../models/tenant");

const addDuesRoom = (req, res) => {
  const { userId, propertyId, roomId } = req.query;
  const data = req.body;

  Tenant.find({ userId, propertyId, roomId })
    .exec()
    .then((tenants) => {
      if (tenants) {
        for (let i = 0; i < tenants.length; i++) {
          tenants[i].dues.push(data);
          tenants[i].markModified("dues");
          tenants[i].save();
        }
        return res.json({ code: 200, model: "Updated" });
      } else {
        return res.json({ code: 404, model: "Not Found" });
      }
    })
    .catch((err) => {
      return res.json({ code: 502, model: err.message });
    });
};
const addDuesTenant = (req, res) => {
  const { userId, propertyId, tenantId } = req.query;
  const data = req.body;

  Tenant.findOne({ userId, propertyId, _id: tenantId })
    .then((tenant) => {
      if (tenant) {
        tenant.dues.push(data);
        tenant.markModified("dues");
        tenant.save();
        return res.json({ code: 200, model: "Updated" });
      } else {
        return res.json({ code: 404, model: "Not Found" });
      }
    })
    .catch((err) => {
      return res.json({ code: 502, model: err.message });
    });
};
module.exports = {
  addDuesTenant,
  addDuesRoom,
};

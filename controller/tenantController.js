const mongoose = require("mongoose");
const Tenant = require("../models/tenant");
const Collection = require("../models/collection");
const Discount = require("../models/discount");
const Receipt = require("../models/receipt");
const Rooms = require("../models/rooms");
const Dues = require("../models/dues")

// const addTenant = (req, res) => {
//   let {
//     userId,
//     propertyId,
//     roomId,
//     name,
//     number,
//     dob,
//     dues,
//     collections,
//     discounts,
//   } = req.body;
//   Tenant.findOne({ userId, propertyId, number })
//     .then((tenant) => {
//       if (tenant) {
//         return res.json({ code: 403 });
//       }
//       const newTenant = new Tenant({
//         userId,
//         propertyId,
//         roomId,
//         name,
//         number,
//         dob,
//         dues,
//       });
//       newTenant
//         .save()
//         .then(() => {
//           const newColllection = new Collection({
//             userId,
//             propertyId,
//             tenantId: newTenant._id,
//             collections: collections,
//           });
//           newColllection
//             .save()
//             .then(() => {
//               const newDiscount = new Discount({
//                 userId,
//                 propertyId,
//                 tenantId: newTenant._id,
//                 discounts: discounts,
//               });
//               newDiscount
//                 .save()
//                 .then(() => {
//                   for (let i = 0; i < collections.length; i++) {
//                     let arr = collections[i].receiptId.split("/");

//                     Receipt.findOne({
//                       userId,
//                       propertyId,
//                       dueType: arr[1],
//                       month: arr[2],
//                       year: arr[3],
//                     }).then((receipt) => {
//                       if (receipt) {
//                         receipt.count = collections[i].receiptId;
//                         receipt.markModified("count");
//                         receipt.save();
//                       } else {
//                         const newRece = new Receipt({
//                           userId,
//                           propertyId,
//                           dueType: arr[1],
//                           month: arr[2],
//                           year: arr[3],
//                           count: collections[i].receiptId,
//                         });
//                         newRece.save();
//                       }
//                     });
//                   }
//                   return res.json({ code: 200 });
//                 })
//                 .catch((err) => {
//                   return res.json({ code: 502, model: err.message });
//                 });
//             })
//             .catch((err) => {
//               return res.json({ code: 502, model: err.message });
//             });
//         })
//         .catch((error) => {
//           return res.json({ code: 502, model: error.message });
//         });
//     })
//     .catch((error) => {
//       return res.json({ code: 502, model: error.message });
//     });
// };

const addTenant = async (req, res) => {
  try {
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
    const tenant = await Tenant.findOne({ userId, propertyId, number })
    if (tenant) {
      return res.json({ code: 403, msg: "Tenant Already present" })
    }
    else {
      const newTenant = new Tenant({ userId, propertyId, roomId, name, number, dob })
      const addTenant = await newTenant.save()

      //The Dues Part
      let dueArr = []
      for (let i = 0; i < dues.length; i++) {
        let obj = {
          userId,
          propertyId,
          tenantId: addTenant._id,
          dueType: dues[i].type,
          rent: dues[i].rent,
          total: dues[i].total,
          due: dues[i].due,
          collections: dues[i].collection,
          discount: dues[i].discount,
          description: dues[i].description ? dues[i].description : "",
          dueDate: dues[i].dueDate,
        }
        dueArr.push(obj)
      }
      const insertDues = await Dues.insertMany(dueArr)

      //Collection Part
      let collectionArr = []
      for (let i = 0; i < collections.length; i++) {
        let obj = {
          userId,
          propertyId,
          tenantId: addTenant._id,
          dueType: collections[i].type,
          amount: collections[i].amount,
          date: collections[i].date,
          mode: collections[i].mode,
          receiptId: collections[i].receiptId,
          openingDue: collections[i].openingDue,
        }
        collectionArr.push(obj)
      }
      const insertCollections = await Collection.insertMany(collectionArr)

      //Discount Part
      let discountArr = []
      for (let i = 0; i < discounts.length; i++) {
        let obj = {
          userId,
          propertyId,
          tenantId: addTenant._id,
          dueType: discounts[i].type,
          amount: discounts[i].amount,
          date: discounts[i].date,
        }
        discountArr.push(obj)
      }
      const insertDiscounts = await Discount.insertMany(discountArr)

      return res.json({ code: 200 });
    }
  }
  catch (error) {
    return res.json({ code: 502, msg: error.message })
  }

}

const getTenants = (req, res) => {
  const { userId, propertyId } = req.query;
  Rooms.find({ userId, propertyId })
    .exec()
    .then((rooms) => {

      Tenant.find({ userId, propertyId })
        .exec()
        .then((docs) => {
          if (!docs) {
            return res.json({ code: 404 });
          }
          let arr = [];
          for (let i = 0; i < docs.length; i++) {
            const room = rooms.filter((item) => item._id == docs[i].roomId);
            let obj = {};
            obj._id = docs[i]._id;
            obj.userId = docs[i].userId;
            obj.propertyId = docs[i].propertyId;
            obj.roomId = docs[i].roomId;
            obj.name = docs[i].name;
            obj.number = docs[i].number;
            obj.roomName = room[0].name.toString();
            obj.dob = docs[0].dob;
            obj.dues = docs[i].dues;
            arr.push(obj);
          }
          return res.json({ code: 200, model: arr });
        })
    })
    .catch((err) => {
      console.log(err);
      res.json({ code: 502, msg: err.message });
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
const getTenantName = (req, res) => {
  const { userId, propertyId, tenantId } = req.query;
  Tenant.findOne({ userId, propertyId, _id: tenantId })
    .then((tenant) => {
      if (tenant) {
        return res.json({ code: 200, model: tenant.name });
      } else {
        return res.json({ code: 200, model: "Unknown" });
      }
    })
    .catch((err) => {
      return res.json({ code: 502, model: err.message });
    });
};
module.exports = {
  getTenants,
  addTenant,
  getATenant,
  getTenantCount,
  getAllTenantsCount,
  getTenantName,
};

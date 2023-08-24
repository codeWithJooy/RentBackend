const mongoose = require("mongoose");
const Collection = require("../models/collection");
const Discount = require("../models/discount");
const Receipt = require("../models/receipt");
const Tenant = require("../models/tenant");
const TempCollection = require("../models/tempCollection")
const Dues = require("../models/dues")
const tenantHelper = require("../helper/tenantHelper")
const months = [
  { name: "Jan", days: 31 },
  { name: "Feb", days: 28 },
  { name: "March", days: 31 },
  { name: "April", days: 30 },
  { name: "May", days: 31 },
  { name: "Jun", days: 30 },
  { name: "July", days: 31 },
  { name: "Aug", days: 31 },
  { name: "Sep", days: 30 },
  { name: "Oct", days: 31 },
  { name: "Nov", days: 30 },
  { name: "Dec", days: 31 },
];

const addCollection = async (req, res) => {
  try {
    const { userId, propertyId, tenantId } = req.query;
    const { type, amount, date, mode, discount, receiptId, openingDue } =
      req.body;
    let obj = { type, amount, date, mode, receiptId, openingDue };
    let discountObj = { type, amount: discount, date };
    let dueData = await Dues.findOne({ userId, propertyId, tenantId, dueType: type }).exec()
    if (dueData) {
      dueData.due = parseInt(dueData.due) - parseInt(discount)
      dueData.collections = parseInt(dueData.collections) + parseInt(amount)
      dueData.discount = parseInt(dueData.discount) + parseInt(discount)
      dueData.status = "Non"
      dueData.markModified("due")
      dueData.markModified("collection")
      dueData.markModified("discount")
      dueData.markModified("status")
      dueData.save()

      if (amount > 0) {
        let collectionUnit = new Collection({ userId, propertyId, tenantId, dueType: type, amount, date, mode, receiptId, openingDue })
        let newCollection = collectionUnit.save()
      }

      let receiptArr = receiptId.split("/")
      let receipt = await Receipt.findOne({ userId, propertyId, dueType: receiptArr[1], month: receiptArr[2], year: receiptArr[3] }).exec()
      if (receipt) {
        receipt.count = receiptId
        receipt.markModified("count")
        receipt.save()
      }
      else {
        let newReceipt = new Receipt({ userId, propertyId, dueType: receiptArr[1], month: receiptArr[2], year: receiptArr[3], count: receiptId }).save()
      }
      if (discount > 0) {
        let discountUnit = new Discount({ userId, propertyId, tenantId, dueType: type, amount: discount, date }).save()
      }
      let tempCol = await TempCollection.deleteOne({ userId, propertyId, tenantId, dueType: type })
      if (tempCol) {
        return res.json({ code: 200 });
      }
    }
  } catch (error) {
    return res.json({ code: 502, msg: error.mesage })
  }
}
const getCollection = (req, res) => {
  const { userId, propertyId, tenantId } = req.query;

  Collection.find({ tenantId }).exec()
    .then((collection) => {
      if (!collection) {
        return res.json({ code: 200, model: [], message: "Not Present" });
      } else {
        return res.json({ code: 200, model: collection });
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
const getAllCollectionByUser = (req, res) => {
  const { userId, propertyId } = req.query;
  Collection.find({ userId, propertyId })
    .exec()
    .then((collection) => {
      let arr = [];
      for (let i = 0; i < collection.length; i++) {

        let obj = {};
        obj.tenantId = collection[i].tenantId;
        obj.type = collection[i].dueType;
        obj.amount = collection[i].amount;
        obj.date = collection[i].date;
        obj.mode = collection[i].mode;
        obj.receiptId = collection[i].receiptId;
        arr.push(obj);

      }
      return res.json({ code: 200, model: arr });
    })
    .catch((err) => {
      return res.json({ code: 200, model: err.message });
    });
};
const addDiscount = (req, res) => {
  const { userId, propertyId, tenantId } = req.query;
  const { type, amount, date } = req.body;
  let obj = {
    type,
    amount,
    date,
  };
  Discount.findOne({
    $and: [
      { userId: userId },
      { propertyId: propertyId },
      { tenantId: tenantId },
    ],
  })
    .then((discount) => {
      if (!discount) {
        let arr = [];
        arr.push(obj);
        const newDiscount = new Discount({
          userId,
          propertyId,
          tenantId,
          discounts: arr,
        });
        newDiscount
          .save()
          .then(() => {
            return res.json({ code: 200 });
          })
          .catch((err) => {
            return res.json({ code: 502, model: err.message });
          });
      } else {
        discount.discounts.push(obj);
        discount.markModified("discounts");
        discount.save();
        return res.json({ code: 200 });
      }
    })
    .catch((err) => {
      return res.json({ code: 502, model: err.message });
    });
};
const getDiscount = (req, res) => {
  const { userId, propertyId, tenantId } = req.query;
  Discount.find({ tenantId }).exec()
    .then((discount) => {
      if (!discount) {
        return res.json({ code: 200, model: [], message: "Not Present" });
      } else {
        return res.json({ code: 200, model: discount });
      }
    })
    .catch((err) => {
      return res.json({ code: 502, model: err.message });
    });
};
const getAllDiscounts = (req, res) => {
  const { userId, propertyId } = req.query;
  Discount.find({
    $and: [{ userId: userId }, { propertyId: propertyId }],
  })
    .then((discount) => {
      if (!discount) {
        return res.json({ code: 200, model: [] });
      } else {
        return res.json({ code: 200, model: discount });
      }
    })
    .catch((err) => {
      return res.json({ code: 502, model: err.message });
    });
};
const getReceiptId = (req, res) => {
  let { userId, propertyId, propertyName, type, date } = req.query;
  let rgx = new RegExp(/(\p{L}{1})\p{L}+/, "gu");
  let propertyInitials = [...propertyName.matchAll(rgx)] || [];
  let initials = [...type.matchAll(rgx)] || [];
  let dueType = (
    (initials.shift()?.[1] || "") + (initials.pop()?.[1] || "")
  ).toUpperCase();
  propertyName = (
    (propertyInitials.shift()?.[1] || "") + (propertyInitials.pop()?.[1] || "")
  ).toUpperCase();

  let newDate = new Date(date);
  let month = months[newDate.getMonth()].name;
  let year = newDate.getFullYear();

  Receipt.findOne({ userId, propertyId, dueType, month, year })
    .then((receipt) => {
      if (!receipt) {
        let newReceiptVal =
          propertyName + "/" + dueType + "/" + month + "/" + year + "/1";
        return res.json({ code: 200, model: newReceiptVal });
      } else {
        let arr = receipt.count.split("/");
        let count = parseInt(arr[4]);
        count = count + 1;
        arr[4] = count;
        let newReceipt = arr.join("/");
        return res.json({ code: 200, model: newReceipt });
      }
    })
    .catch((error) => {
      res.json({ code: 502, model: error.message });
    });
};
const getReceiptData = (req, res) => {
  const { userId, propertyId, propertyName, tenantId, receiptId } = req.query;

  let tenantName = "";
  let room = "";
  let phone = "";
  let propertyNumber = "";
  let amount = "";
  let mode = "";
  let date = "";
  let type = "";
  let balance = "";
  let due = "";
  Collection.findOne({ userId, propertyId, tenantId })
    .then((collection) => {
      let collectionIndex = collection.collections.findIndex(
        (item) => item.receiptId == receiptId
      );

      amount = collection.collections[collectionIndex].amount;
      mode = collection.collections[collectionIndex].mode;
      date = collection.collections[collectionIndex].date;
      type = collection.collections[collectionIndex].type;
      due = collection.collections[collectionIndex].openingDue;
      Tenant.findOne({ _id: tenantId })
        .then((tenant) => {
          tenantName = tenant.name;
          phone = tenant.number;
          const dueIndex = tenant.dues.findIndex((unit) => unit.type == type);
          balance =
            parseInt(tenant.dues[dueIndex].due) -
            parseInt(tenant.dues[dueIndex].collection);

          let obj = {
            tenantName,
            room,
            phone,
            propertyName,
            propertyNumber,
            receiptId,
            amount,
            mode,
            date,
            type,
            balance: balance,
            due,
          };

          return res.json({ code: 200, model: obj });
        })
        .catch((err) => {
          return res.json({ code: 502, model: err.message });
        });
    })
    .catch((err) => {
      return res.json({ code: 502, model: err.message });
    });
};
const getTempCollection = async (req, res) => {
  const { userId, propertyId } = req.query
  try {
    const temp = await TempCollection.find({ userId, propertyId }).exec();
    if (!temp || temp.length === 0) {
      return res.json({ code: 404, model: "No Payments Done" })
    } else {
      const arr = await Promise.all(temp.map(async (unit) => {
        const obj = {
          type: unit.dueType,
          amount: unit.amount,
          date: unit.date,
          mode: unit.mode,
          due: unit.due,
          tenantId: unit.tenantId
        };
        let { name, roomId } = await tenantHelper.getTenantName(unit.tenantId);
        obj.name = name;
        obj.room = await tenantHelper.getTenantRoom(userId, propertyId, roomId);
        return obj;
      }))
      return res.json({ code: 200, model: arr });
    }
  } catch (err) {
    return res.json({ code: 502, model: err.message })
  }
}
module.exports = {
  addCollection,
  getCollection,
  getAllCollections,
  addDiscount,
  getDiscount,
  getAllDiscounts,
  getReceiptId,
  getReceiptData,
  getAllCollectionByUser,
  getTempCollection,
};
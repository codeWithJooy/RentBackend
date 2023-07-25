const mongoose = require("mongoose");
const Collection = require("../models/collection");
const Discount = require("../models/discount");
const Receipt = require("../models/receipt");
const Tenant = require("../models/tenant");
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
const addCollection = (req, res) => {
  const { userId, propertyId, tenantId } = req.query;
  const { type, amount, date, mode, discount, receiptId, openingDue } =
    req.body;
  let obj = { type, amount, date, mode, receiptId, openingDue };
  let discountObj = { type, amount: discount, date };
  //Update Tenant
  Tenant.findOne({ userId, propertyId, _id: tenantId })
    .then((tenant) => {
      if (tenant) {
        console.log(tenant);
        const dueIndex = tenant.dues.findIndex((due) => due.type == type);
        tenant.dues[dueIndex].due =
          parseInt(tenant.dues[dueIndex].due) - parseInt(discount);
        tenant.dues[dueIndex].collection =
          parseInt(tenant.dues[dueIndex].collection) + parseInt(amount);
        tenant.dues[dueIndex].discount =
          parseInt(tenant.dues[dueIndex].discount) + parseInt(discount);
        tenant.markModified("dues");
        tenant.save();
      }
    })
    .catch((err) => {
      return res.json({ code: 502, model: err.message });
    });
  //Update Collection
  if (amount > 0) {
    Collection.findOne({
      $and: [
        { userId: userId },
        { propertyId: propertyId },
        { tenantId: tenantId },
      ],
    })
      .then((collection) => {
        let arr = [];
        arr.push(obj);
        if (collection) {
          collection.collections.push(obj);
          collection.markModified("collections");
          collection.save();
        } else {
          const newColllection = new Collection({
            userId,
            propertyId,
            tenantId,
            collections: arr,
          });
          newColllection.save();
        }
      })
      .catch((err) => {
        return res.json({ code: 502, model: err.message });
      });
  }
  //Update Receipt
  let receiptArr = receiptId.split("/");

  Receipt.findOne({
    userId,
    propertyId,
    dueType: receiptArr[1],
    month: receiptArr[2],
    year: receiptArr[3],
  })
    .then((receipt) => {
      if (receipt) {
        receipt.count = receiptId;
        receipt.markModified("count");
        receipt.save();
      } else {
        const newRece = new Receipt({
          userId,
          propertyId,
          dueType: receiptArr[1],
          month: receiptArr[2],
          year: receiptArr[3],
          count: receiptId,
        });
        newRece.save();
      }
    })
    .catch((err) => {
      return res.json({ code: 502, model: err.message });
    });

  //Update Discount
  if (discount > 0) {
    let disCountArr = [];
    disCountArr.push(discountObj);
    Discount.findOne({
      $and: [
        { userId: userId },
        { propertyId: propertyId },
        { tenantId: tenantId },
      ],
    })
      .then((newdiscount) => {
        if (newdiscount) {
          newdiscount.discounts.push(discountObj);
          newdiscount.markModified("discounts");
          newdiscount.save();
        } else {
          const newDiscount = new Discount({
            userId,
            propertyId,
            tenantId,
            discounts: disCountArr,
          });
          newDiscount.save();
        }
      })
      .catch((err) => {
        return res.json({ code: 502, model: err.message });
      });
  }
  return res.json({ code: 200 });
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
const getAllCollectionByUser = (req, res) => {
  const { userId, propertyId } = req.query;
  Collection.find({ userId, propertyId })
    .exec()
    .then((collection) => {
      let arr = [];
      for (let i = 0; i < collection.length; i++) {
        for (let j = 0; j < collection[i].collections.length; j++) {
          let obj = {};
          obj.tenantId = collection[i].tenantId;
          obj.type = collection[i].collections[j].type;
          obj.amount = collection[i].collections[j].amount;
          obj.date = collection[i].collections[j].date;
          obj.mode = collection[i].collections[j].mode;
          obj.receiptId = collection[i].collections[j].receiptId;
          arr.push(obj);
        }
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
  Discount.findOne({ tenantId })
    .then((discount) => {
      if (!discount) {
        return res.json({ code: 200, model: [], message: "Not Present" });
      } else {
        return res.json({ code: 200, model: discount.discounts });
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
};

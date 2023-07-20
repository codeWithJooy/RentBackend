const mongoose = require("mongoose");
const Property = require("../models/property");
const Receipt = require("../models/receipt");

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

const receiptIdHelper = (userId, propertyId, type, date) => {
  try {
    let property = User.findOne({ userId, _id: propertyId }).orFail();
    let mainReceipt = "";

    if (property) {
      let propertyName = property.name;
      let rgx = new RegExp(/(\p{L}{1})\p{L}+/, "gu");
      let propertyInitials = [...propertyName.matchAll(rgx)] || [];
      let initials = [...type.matchAll(rgx)] || [];
      let dueType = (
        (initials.shift()?.[1] || "") + (initials.pop()?.[1] || "")
      ).toUpperCase();
      propertyName = (
        (propertyInitials.shift()?.[1] || "") +
        (propertyInitials.pop()?.[1] || "")
      ).toUpperCase();

      let newDate = new Date(date);
      let month = months[newDate.getMonth()].name;
      let year = newDate.getFullYear();
      let receipt = Receipt.findOne({
        userId,
        propertyId,
        dueType,
        month,
        year,
      }).orFail();
      if (receipt) {
        let newReceiptVal =
          propertyName + "/" + dueType + "/" + month + "/" + year + "/1";
        mainReceipt = newReceiptVal;
        const newReceipt = new Receipt({
          userId,
          propertyId,
          dueType,
          month,
          year,
          count: newReceiptVal,
        });
        newReceipt.save();
      } else {
        let arr = receipt.count.split("/");
        let count = parseInt(arr[4]);
        count = count + 1;
        arr[4] = count;
        let newReceipt = arr.join("/");
        mainReceipt = newReceipt;
        receipt.count = newReceipt;
        receipt.markModified("count");
        receipt.save();
      }
    }
    return mainReceipt;
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = receiptIdHelper;

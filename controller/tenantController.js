const mongoose = require("mongoose");
const Tenant = require("../models/tenant");
const Collection = require("../models/collection");
const Discount = require("../models/discount");
const Receipt = require("../models/receipt");
const Rooms = require("../models/rooms");
const Dues = require("../models/dues");
const TenantPersonal = require("../models/tenantDetails/tenantPersonal");
const TenantParents = require("../models/tenantDetails/tenantParents");
const TenantGuardian = require("../models/tenantDetails/tenantGuardian");
const Student = require("../models/student");
const twilio = require("twilio");

// Your Twilio Account SID and Auth Token
const accountSid = "AC567d9e3d06e75d2cca3eb582fa7e8da5";
const authToken = "0683d9ae0ed07b932e935696fda2561b";

// Create a Twilio client
const client = new twilio(accountSid, authToken);
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
    const tenant = await Tenant.findOne({ userId, propertyId, number });
    if (tenant) {
      return res.json({ code: 403, msg: "Tenant Already present" });
    } else {
      const newTenant = new Tenant({
        userId,
        propertyId,
        roomId,
        name,
        number,
        dob,
      });
      const addTenant = await newTenant.save();

      //The Dues Part
      let dueArr = [];
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
        };
        dueArr.push(obj);
      }
      const insertDues = await Dues.insertMany(dueArr);

      //Collection Part
      let collectionArr = [];
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
        };
        collectionArr.push(obj);
      }
      const insertCollections = await Collection.insertMany(collectionArr);

      //Discount Part
      let discountArr = [];
      for (let i = 0; i < discounts.length; i++) {
        let obj = {
          userId,
          propertyId,
          tenantId: addTenant._id,
          dueType: discounts[i].type,
          amount: discounts[i].amount,
          date: discounts[i].date,
        };
        discountArr.push(obj);
      }
      const insertDiscounts = await Discount.insertMany(discountArr);

      return res.json({ code: 200 });
    }
  } catch (error) {
    return res.json({ code: 502, msg: error.message });
  }
};

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
        });
    })
    .catch((err) => {
      console.log(err);
      res.json({ code: 502, msg: err.message });
    });
};

const getTenantRoomWise = (req, res) => {
  const { userId, propertyId, roomId } = req.query;
  Tenant.find({ userId, propertyId, roomId })
    .exec()
    .then((docs) => {
      if (!docs) {
        return res.json({ code: 404, msg: "No Tennant Present" });
      }
      let arr = [];
      for (let i = 0; i < docs.length; i++) {
        let obj = {};
        obj._id = docs[i]._id;
        obj.userId = docs[i].userId;
        obj.propertyId = docs[i].propertyId;
        obj.roomId = docs[i].roomId;
        obj.name = docs[i].name;
        obj.number = docs[i].number;
        obj.dob = docs[0].dob;
        obj.dues = docs[i].dues;
        arr.push(obj);
      }
      return res.json({ code: 200, model: arr });
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
const getTenantDetails = async (req, res) => {
  try {
    const { userId, propertyId, tenantId } = req.query;
    let obj = {
      name: "",
      number: "",
      alternate: "",
      email: "",
      birthDate: "",
      bloodGroup: "",
      dob: "",
      fatherName: "",
      fatherNumber: "",
      motherName: "",
      motherNumber: "",
      occupation: "",
      guardianName: "",
      guardianNumber: "",
      guardianAddress: "",
    };

    let tenant = await Tenant.findOne({
      userId,
      propertyId,
      _id: tenantId,
    }).exec();
    if (tenant) {
      obj.name = tenant.name;
      obj.number = tenant.number;
      obj.dob = tenant.dob;
    }
    let tenantProfile = await TenantPersonal.findOne({
      userId,
      propertyId,
      tenantId,
    }).exec();
    if (tenantProfile) {
      obj.alternate = tenantProfile.alternate;
      obj.email = tenantProfile.email;
      obj.birthDate = tenantProfile.birthDate;
      obj.bloodGroup = tenantProfile.bloodGroup;
    }
    let tenantParents = await TenantParents.findOne({
      userId,
      propertyId,
      tenantId,
    }).exec();
    if (tenantParents) {
      obj.fatherName = tenantParents.fatherName;
      obj.fatherNumber = tenantParents.fatherNumber;
      obj.motherName = tenantParents.motherName;
      obj.motherNumber = tenantParents.motherNumber;
      obj.occupation = tenantParents.occupation;
    }
    let tenantGuardian = await TenantGuardian.findOne({
      userId,
      propertyId,
      tenantId,
    }).exec();
    if (tenantGuardian) {
      obj.guardianName = tenantGuardian.name;
      obj.guardianAddress = tenantGuardian.address;
      obj.guardianNumber = tenantGuardian.number;
    }
    return res.json({ code: 200, model: obj });
  } catch (error) {
    return res.json({ code: 502, msg: error.message });
  }
};
const getTenantsCredentials = async (req, res) => {
  try {
    const { userId, propertyId } = req.query;
    //Searching For Students Who Have Logged In Student App
    const tenantList = await Student.find({ userId, propertyId }).exec();
    let arr = [];
    if (tenantList) {
      for (let i = 0; i < tenantList.length; i++) {
        let obj = {};
        obj.name = tenantList[i].name;
        obj.email = tenantList[i].email;
        obj.number = tenantList[i].number;
        obj.password = tenantList[i].password;
        obj.tenantId = tenantList[i].tenantId;
        const tenant = await Tenant.findOne({
          userId,
          propertyId,
          _id: tenantList[i].tenantId,
        }).exec();
        if (tenant) {
          const room = await Rooms.findOne({
            userId,
            propertyId,
            _id: tenant.roomId,
          });
          if (room) {
            obj.room = room.name;
          } else {
            obj.room = "Unknown";
          }
        } else {
          obj.room = "Unknown";
        }
        arr.push(obj);
      }
      return res.json({ code: 200, model: arr });
    } else {
      return res.json({ code: 404, msg: "No Tenants Found" });
    }
  } catch (error) {
    return res.json({ code: 502, msg: error.message });
  }
};

const resetTenantPassword = async (req, res) => {
  try {
    const { userId, propertyId, tenantId, password } = req.query;
    let student = await Student.findOne({
      userId,
      propertyId,
      tenantId,
    }).exec();
    if (student) {
      student.password = password;
      student.markModified("password");
      student.save();
      return res.json({ code: 200, msg: "Tenant Password Reset Sucessfully" });
    } else {
      return res.json({ code: 404, msg: "Error Find Tenant" });
    }
  } catch (error) {
    return res.json({ code: 502, msg: error.message });
  }
};
const remindTenant = async (req, res) => {
  try {
    const { userId, propertyId, propertyName, tenantId, type, due, dueDate } =
      req.body;
    let tenant = await Tenant.findOne({ _id: tenantId });
    if (tenant) {
      let name = tenant.name;
      let number = tenant.number;
      console.log(number);
      const fromNumber = "whatsapp:+14155238886"; // Your Twilio WhatsApp number
      const toNumber = `whatsapp:+91${number}`; // The recipient's WhatsApp number
      let msg = `Hey ${name}, 
      You Have a Due Pending.PLease Pay it to avoid any late fees.
      ${type} : ${due}         
      Regards ${propertyName}`;
      client.messages
        .create({
          from: fromNumber,
          to: toNumber,
          body: msg,
        })
        .then((message) => {
          console.log(`Message sent: ${message.sid}`);
        });
      return res.json({ code: 200, msg: "Reminder Send Successfully." });
    } else {
      return res.json({ code: 404, msg: "Reminder Couldn't be Send." });
    }
  } catch (error) {
    console.log(error.message);
    return res.json({ code: 502, msg: error.messsage });
  }
};
const updateTenant = async (req, res) => {
  const {
    alternate,
    birthDate,
    bloodGroup,
    fatherName,
    fatherNumber,
    motherName,
    motherNumber,
    occupation,
    guardianName,
    guardianNumber,
    guardianAddress,
  } = req.body;

  const { userId, propertyId, tenantId } = req.query;
  try {
    const personalData = {
      userId,
      propertyId,
      tenantId,
      alternateNumber: alternate,
      birthDate,
      bloodGroup,
    };

    const parentData = {
      userId,
      propertyId,
      tenantId,
      fatherName,
      fatherNumber,
      motherName,
      motherNumber,
      occupation,
    };

    const guardianData = {
      userId,
      propertyId,
      tenantId,
      name: guardianName,
      number: guardianNumber,
      address: guardianAddress,
    };

    // Check if documents exist and update or insert accordingly
    const personalDoc = await TenantPersonal.findOne({
      userId,
      propertyId,
      tenantId,
    });
    if (personalDoc) {
      await TenantPersonal.updateOne({ _id: personalDoc._id }, personalData);
    } else {
      await new TenantPersonal(personalData).save();
    }

    const parentDoc = await TenantParents.findOne({
      userId,
      propertyId,
      tenantId,
    });
    if (parentDoc) {
      await TenantParents.updateOne({ _id: parentDoc._id }, parentData);
    } else {
      await new TenantParents(parentData).save();
    }

    const guardianDoc = await TenantGuardian.findOne({
      userId,
      propertyId,
      tenantId,
    });
    if (guardianDoc) {
      await TenantGuardian.updateOne({ _id: guardianDoc._id }, guardianData);
    } else {
      await new TenantGuardian(guardianData).save();
    }

    res.status(200).json({ message: "Tenant data added/updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding/updating tenant data", error });
  }
};
module.exports = {
  getTenants,
  getTenantRoomWise,
  addTenant,
  getATenant,
  getTenantCount,
  getAllTenantsCount,
  getTenantName,
  getTenantDetails,
  getTenantsCredentials,
  resetTenantPassword,
  remindTenant,
  updateTenant,
};

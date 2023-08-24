const mongoose = require("mongoose");
const Property = require("../../models/property");
const Tenant = require("../../models/tenant");
const Student = require("../../models/student");
const Collections = require("../../models/collection")
const TempCollection = require("../../models/tempCollection");
const Dues = require("../../models/dues");

const checkCodeNumber = (req, res) => {
  const { code, number } = req.query;
  Property.findOne({ code })
    .then((property) => {
      if (property) {
        const userId = property.userId;
        const propertyId = property._id;
        const propertyName = property.name;
        Tenant.findOne({ userId, propertyId, number })
          .then((tenant) => {
            if (tenant) {
              let obj = {};
              obj.userId = userId;
              obj.propertyId = propertyId;
              obj.propertyName = propertyName;
              obj.name = tenant.name;
              obj.tenantId = tenant._id;
              obj.number = number;
              return res.json({ code: 200, model: obj });
            } else {
              return res.json({ code: 404, model: "No Tenant Found" });
            }
          })
          .catch((err) => {
            return res.json({ code: 502, model: err.message });
          });
      } else {
        return res.json({ code: 404, model: "Incorrect PG Code" });
      }
    })
    .catch((err) => {
      return res.json({ code: 502, model: err.message });
    });
};
const addStudent = (req, res) => {
  const {
    userId,
    propertyId,
    propertyName,
    tenantId,
    email,
    name,
    number,
    password,
  } = req.body;

  Student.findOne({ number })
    .then((student) => {
      if (student) {
        return res.json({ code: 409, model: "Tenant Already Present" });
      } else {
        let newStudent = new Student({
          userId,
          propertyId,
          propertyName,
          tenantId,
          email,
          number,
          name,
          password,
        });
        newStudent
          .save()
          .then(() => {
            return res.json({ code: 200, model: newStudent });
          })
          .catch((err) => {
            return res.json({ code: 502, model: err.message });
          });
      }
    })
    .catch((err) => {
      return res.json({ code: 502, model: err.message });
    });
};
const studentLogin = (req, res) => {
  const { email, password } = req.query;
  Student.findOne({ email })
    .then((student) => {
      if (!student) {
        return res.json({ code: 404, model: "Email doesn't exists" });
      } else {
        if (password != student.password) {
          return res.json({ code: 404, model: "Password Mismatch Error" });
        } else {
          return res.json({ code: 200, model: student });
        }
      }
    })
    .catch((err) => {
      return res.json({ code: 502, model: err.message });
    });
};

// const addPendingCollection = (req, res) => {
//   const { userId, propertyId, tenantId, type, due, amount, date, mode } =
//     req.body;
//   Tenant.findOne({ userId, propertyId, _id: tenantId })
//     .then((tenant) => {
//       if (tenant) {
//         const dueIndex = tenant.dues.findIndex(
//           (unit) =>
//             unit.type == type &&
//             unit.status != "pending" &&
//             parseInt(unit.due) - parseInt(unit.collection) == due
//         );
//         tenant.dues[dueIndex].status = "pending";
//         tenant.markModified("dues");
//         tenant.save();
//         TempCollection.findOne({ userId, propertyId, tenantId, type })
//           .then((temp) => {
//             if (!temp) {
//               let newTemp = new TempCollection({
//                 userId,
//                 propertyId,
//                 tenantId,
//                 type,
//                 due,
//                 amount,
//                 date,
//                 mode,
//               });
//               newTemp.save().then(() => {
//                 res.json({ code: 200 });
//               });
//             }
//           })
//           .catch((err) => {
//             return res.json({ code: 502, model: err.message });
//           });
//       }
//     })
//     .catch((err) => {
//       return res.json({ code: 502, model: err.message });
//     });
// };

const addPendingCollection = async (req, res) => {
  try {
    const { userId, propertyId, tenantId, dueType, due, amount, date, mode } = req.body;
    let duesData = await Dues.findOne({ userId, propertyId, tenantId, dueType }).exec()
    if (duesData && duesData.status != 'pending' && parseInt(duesData.due) - parseInt(duesData.collections) == due) {
      duesData.status = "pending"
      duesData.markModified("status")
      duesData.save()
      let newTemp = new TempCollection({ userId, propertyId, tenantId, dueType, due, amount, date, mode }).save()
      return res.json({ code: 200 })
    }
    else {
      return res.json({ code: 404, msg: "Error Finding The Due" })
    }
  } catch (error) {
    return res.json({ code: 502, msg: error.message })
  }
}
const getStudentDues = async (req, res) => {
  try {
    const { userId, propertyId, tenantId } = req.query
    const dueData = await Dues.find({ userId, propertyId, tenantId }).exec()

    if (dueData) {

      return res.json({ code: 200, model: dueData })
    }
    else {
      return res.json({ code: 404, msg: "No Dues Found" })
    }
  }
  catch (error) {
    return res.json({ code: 502, msg: error.message })
  }
}
const getStudentDuesStatus = async (req, res) => {
  try {
    const { userId, propertyId, tenantId } = req.query
    const dueData = await Dues.find({ userId, propertyId, tenantId }).exec()

    if (dueData) {
      let dues = dueData.filter((unit) => unit.status != "pending")
      return res.json({ code: 200, model: dues })
    }
    else {
      return res.json({ code: 404, msg: "No Dues Found" })
    }
  }
  catch (error) {
    return res.json({ code: 502, msg: error.message })
  }
}
const getStudentTotalDues = async (req, res) => {
  try {
    const { userId, propertyId, tenantId } = req.query
    const dueData = await Dues.find({ userId, propertyId, tenantId }).exec()
    if (dueData) {
      let dues = dueData.filter((unit) => unit.status != "pending")
      console.log(dues)
      let sum = dues.reduce((acc, curr) => {
        return acc + parseInt(curr.due) - parseInt(curr.collections)
      }, 0)
      return res.json({ code: 200, model: sum })
    }
  } catch (error) {
    return res.json({ code: 502, msg: error.message })
  }
}
const getStudentExpenses = async (req, res) => {
  try {
    const { userId, propertyId, tenantId } = req.query
    const collections = await Collections.find({ userId, propertyId, tenantId }).exec()
    if (collections) {
      return res.json({ code: 200, model: collections })
    }
    else {
      return res.json({ code: 404, msg: "No Dues Found" })
    }
  }
  catch (error) {
    return res.json({ code: 502, msg: error.message })
  }
}
const getStudentTotalExpenses = async (req, res) => {
  try {
    const { userId, propertyId, tenantId } = req.query
    const collections = await Collections.find({ userId, propertyId, tenantId }).exec()
    if (collections) {
      let total = collections.reduce((acc, curr) => {
        return acc + parseInt(curr.amount)
      }, 0)
      return res.json({ code: 200, model: total })
    }
    else {
      return res.json({ code: 404, msg: "No Payment Done" })
    }
  }
  catch (error) {
    return res.json({ code: 502, msg: error.message })
  }
}
module.exports = {
  checkCodeNumber,
  addStudent,
  studentLogin,
  addPendingCollection,
  getStudentDues,
  getStudentDuesStatus,
  getStudentTotalDues,
  getStudentExpenses,
  getStudentTotalExpenses,
};

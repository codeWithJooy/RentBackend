const mongoose = require("mongoose");
const Collection = require("../models/collection");
const Tenant = require("../models/tenant");
const Expense = require("../models/expense");
const Rooms = require("../models/rooms");
const TempCollection = require("../models/tempCollection")
const Complaint = require("../models/complaint")
const Dues = require("../models/dues")
const notificationHelper = require("../helper/notificationHelper")

const { areDatesEqual, isInMonthRange } = require("../helper/summaryHelper");

const getTodaysCollection = (req, res) => {
  const { userId, propertyId } = req.query;
  Collection.find({ userId, propertyId })
    .exec()
    .then((collections) => {
      const today = new Date();
      const total = collections.reduce((acc, curr) => {
        if (areDatesEqual(today, new Date(curr.date))) {
          return acc + parseInt(curr.amount)
        }
        else {
          return acc + 0
        }
      }, 0);

      return res.json({ code: 200, model: total });
    })
    .catch((err) => {
      return res.json({ code: 200, model: err.message });
    });
};

const getMonthCollection = (req, res) => {
  const { userId, propertyId } = req.query;
  Collection.find({ userId, propertyId })
    .exec()
    .then((collections) => {
      const today = new Date();
      const total = collections.reduce((acc, curr) => {
        if (isInMonthRange(today, new Date(curr.date))) {
          return acc + parseInt(curr.amount);
        } else {
          return acc + 0;
        }
      }, 0);

      return res.json({ code: 200, model: total });
    })
    .catch((err) => {
      return res.json({ code: 502, model: err.message });
    });
};
const getTotalCollection = (req, res) => {
  const { userId, propertyId } = req.query;
  Collection.find({ userId, propertyId })
    .exec()
    .then((collections) => {
      const val = collections.reduce((acc, curr) => {
        return acc + curr.amount
      }, 0);
      return res.json({ code: 200, model: val });
    })
    .catch((err) => {
      return res.json({ code: 502, model: err.message });
    });
};
const getCurrentDeposit = (req, res) => {
  const { userId, propertyId } = req.query;
  Collection.find({ userId, propertyId })
    .exec()
    .then((collections) => {
      const total = collections.reduce((acc, curr) => {
        if (curr.dueType == "Security Deposit") {
          return acc + parseInt(curr.amount)
        }
        else {
          return acc + 0;
        }

      }, 0);
      console.log(total);
      return res.json({ code: 200, model: total });
    })
    .catch((err) => {
      return res.json({ code: 200, model: err.message });
    });
};
const getMonthDue = (req, res) => {
  const { userId, propertyId } = req.query;
  Dues.find({ userId, propertyId })
    .exec()
    .then((dueUnit) => {
      const today = new Date();
      const due = dueUnit.reduce((acc, curr) => {
        if (isInMonthRange(today, new Date(curr.dueDate))) {
          return (
            acc + parseInt(curr.due) - parseInt(curr.collections)
          );
        } else return acc + 0;
      }, 0);
      return res.json({ code: 200, model: due });
    })
    .catch((err) => {
      return res.json({ code: 502, model: err.message });
    });
};
const getTotalDue = (req, res) => {
  const { userId, propertyId } = req.query;
  Dues.find({ userId, propertyId })
    .exec()
    .then((dueUnit) => {
      const due = dueUnit.reduce((acc, curr) => {
        return acc + parseInt(curr.due) - parseInt(curr.collections)
      }, 0);
      return res.json({ code: 200, model: due });
    })
    .catch((err) => {
      return res.json({ code: 502, model: err.message });
    });
};
const getMonthExpense = (req, res) => {
  const { userId, propertyId } = req.query;
  Expense.find({ userId, propertyId })
    .exec()
    .then((expenses) => {
      const today = new Date();
      const count = expenses.reduce((acc, curr) => {
        if (isInMonthRange(today, new Date(curr.date))) {
          return acc + parseInt(curr.amount);
        } else return acc;
      }, 0);
      return res.json({ code: 200, model: count });
    })
    .catch((err) => {
      return res.json({ code: 502, model: err.message });
    });
};
const getTotalRooms = (req, res) => {
  const { userId, propertyId } = req.query;
  Rooms.find({ userId, propertyId })
    .exec()
    .then((rooms) => {
      const count = rooms.reduce((acc, curr) => acc + curr.rooms.length, 0);
      return res.json({ code: 200, model: count });
    })
    .catch((err) => {
      return res.json({ code: 502, model: err.message });
    });
};
const getTotalBed = (req, res) => {
  const { userId, propertyId } = req.query;
  Rooms.find({ userId, propertyId })
    .exec()
    .then((rooms) => {
      const count = rooms.reduce((acc, curr) => {
        const val = curr.rooms.reduce((accNew, currNew) => {
          if (currNew.type == "Single") {
            return accNew + 1;
          } else if (currNew.type == "Double") {
            return accNew + 2;
          } else return accNew + 3;
        }, 0);
        return acc + val;
      }, 0);
      return res.json({ code: 200, model: count });
    })
    .catch((err) => {
      return res.json({ code: 502, model: err.message });
    });
};
const getVacantBed = (req, res) => {
  const { userId, propertyId } = req.query;
  Rooms.find({ userId, propertyId })
    .exec()
    .then((rooms) => {
      const count = rooms.reduce((acc, curr) => {
        const val = curr.rooms.reduce((accNew, currNew) => {
          if (currNew.type == "Single") {
            return accNew + 1;
          } else if (currNew.type == "Double") {
            return accNew + 2;
          } else return accNew + 3;
        }, 0);
        return acc + val;
      }, 0);
      Tenant.find({ userId, propertyId })
        .exec()
        .then((tenants) => {
          let totalTenats = tenants.length;
          return res.json({ code: 200, model: count - totalTenats });
        })
        .catch((err) => {
          return res.json({ code: 502, model: err.message });
        });
    })
    .catch((err) => {
      return res.json({ code: 502, model: err.message });
    });
};
const getTotalTenants = (req, res) => {
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
const getNotificationCount = async (req, res) => {
  const { userId, propertyId } = req.query
  let data = await notificationHelper.getComplaintCount(userId, propertyId)
  data += await notificationHelper.getCollectionCount(userId, propertyId)
  return res.json({ code: 200, model: data })
}

module.exports = {
  getCurrentDeposit,
  getTodaysCollection,
  getMonthCollection,
  getTotalCollection,
  getMonthDue,
  getTotalDue,
  getMonthExpense,
  getTotalRooms,
  getTotalBed,
  getVacantBed,
  getTotalTenants,
  getNotificationCount,
};
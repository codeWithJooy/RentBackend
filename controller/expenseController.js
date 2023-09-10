const mongoose = require("mongoose");
const Expense = require("../models/expense");
const Member = require("../models/member")

const addExpense = (req, res) => {
  const {
    userId,
    propertyId,
    expenseName,
    amount,
    date,
    paidBy,
    paidTo,
    description,
    mode,
  } = req.body;
  const newExpense = new Expense({
    userId,
    propertyId,
    expenseName,
    amount,
    date,
    paidBy,
    paidTo,
    description,
    mode,
  });
  newExpense
    .save()
    .then(() => {
      res.json({
        code: 200,
      });
    })
    .catch((err) => res.json({ code: 502, message: err }));
};
const getExpense = (req, res) => {
  const { userId, propertyId } = req.query;
  Expense.find({ userId, propertyId }).exec()
    .then((doc) => {
      if (!doc) {
        return res.json({ code: 404, msg: "No Expense Found" });
      } else {
        return res.json({ code: 200, model: doc });
      }
    })
    .catch((err) => {
      return res.json({ code: 502, msg: err.message });
    });
};
const getMemberName = async (req, res) => {
  try {
    const { userId, propertyId } = req.query

    let member = await Member.find({ userId, propertyId }).exec()
    let arr = []
    if (member) {
      console.log(member.length)
      for (let i = 0; i < member.length; i++) {
        arr.push(member[i].personal.name)
      }
      return res.json({ code: 200, model: arr })
    }
    else {
      return res.json({ code: 200, model: arr })
    }

  }
  catch (error) {
    return res.json({ code: 502, msg: error.message })
  }
}
const getExpenseCount = async (req, res) => {
  try {
    let { userId, propertyId } = req.query
    let expense = await Expense.find({ userId, propertyId }).exec()
    if (expense) {
      return res.json({ code: 200, model: expense.length })
    }
    else {
      return res.json({ code: 200, model: 0 })
    }
  }
  catch (error) {
    return res.json({ code: 502, msg:error.message })
  }
}
const getTotalExpense = async (req, res) => {
  try {
    let { userId, propertyId } = req.query
    let expense = await Expense.find({ userId, propertyId }).exec()
    if (expense) {
      let totalExpense = expense.reduce((acc, curr) => acc + parseInt(curr.amount), 0)
      return res.json({ code: 200, model: totalExpense })
    }
    else {
      return res.json({ code: 200, model: 0 })
    }
  }
  catch (error) {
    return res.json({ code: 502, msg:error.message })
  }
}
module.exports = {
  addExpense,
  getExpense,
  getMemberName,
  getTotalExpense,
  getExpenseCount,
};

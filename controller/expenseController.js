const mongoose = require("mongoose");
const Expense = require("../models/expense");

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
  Expense.findOne({ userId, propertyId })
    .then((doc) => {
      if (!doc) {
        return res.json({ code: 404 });
      } else {
        return res.json({ code: 200, model: doc });
      }
    })
    .catch((err) => {
      return res.json({ code: 502 });
    });
};
module.exports = {
  addExpense,
  getExpense,
};

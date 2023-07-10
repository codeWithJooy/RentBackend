const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    expenseName: {
      type: String,
      require: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    date: {
      type: String,
      required: true,
    },
    paidBy: {
      type: String,
      required: true,
    },
    paidTo: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    mode: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;

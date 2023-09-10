const express = require("express");
const router = express.Router();
const expenseController = require("../controller/expenseController");

router.post("/addExpense", expenseController.addExpense);
router.get("/getExpense", expenseController.getExpense);
router.get("/getMemName",expenseController.getMemberName)
router.get("/getTotalExpense",expenseController.getTotalExpense)
router.get("/getExpenseCount",expenseController.getExpenseCount)
module.exports = router;

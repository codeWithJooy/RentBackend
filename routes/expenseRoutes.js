const express = require("express");
const router = express.Router();
const upload=require('../config/multerConfig')
const expenseController = require("../controller/expenseController");

router.post("/addExpense",upload.single('file'), expenseController.addExpense);
router.get("/getExpense", expenseController.getExpense);
router.get("/getMemName",expenseController.getMemberName)
router.get("/getTotalExpense",expenseController.getTotalExpense)
router.get("/getExpenseCount",expenseController.getExpenseCount)
module.exports = router;

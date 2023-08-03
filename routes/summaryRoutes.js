const express = require("express");
const router = express.Router();
const summaryController = require("../controller/summaryController");

router.get("/getCurrentDeposit", summaryController.getCurrentDeposit);
router.get("/getTodaysCollection", summaryController.getTodaysCollection);
router.get("/getMonthCollection", summaryController.getMonthCollection);
router.get("/getMonthDue", summaryController.getMonthDue);
router.get("/getTotalDue", summaryController.getTotalDue);
router.get("/getMonthExpense", summaryController.getMonthExpense);
router.get("/getTotalRooms", summaryController.getTotalRooms);
router.get("/getTotalBed", summaryController.getTotalBed);
router.get("/getVacantBed", summaryController.getVacantBed);
router.get("/getTotalTenants", summaryController.getTotalTenants);
router.get("/getNotificationCount",summaryController.getNotificationCount)

module.exports = router;

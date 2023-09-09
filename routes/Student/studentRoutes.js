const express = require("express");
const router = express.Router();
const studentController = require("../../controller/Student/studentController");
const studentExtraController=require("../../controller/Student/studentExtraController");
router.get("/checkCodeNumber", studentController.checkCodeNumber);
router.post("/addStudent", studentController.addStudent);
router.get("/studentLogin", studentController.studentLogin);
router.post("/addPendingCollection", studentController.addPendingCollection);
router.get("/getStudentDues", studentController.getStudentDues)
router.get("/getStudentDuesStatus", studentController.getStudentDuesStatus)
router.get("/getStudentTotalDues", studentController.getStudentTotalDues)
router.get("/getStudentTotalExpenses", studentController.getStudentTotalExpenses)
router.get("/getStudentExpenses", studentController.getStudentExpenses)
router.post("/addStudentLate",studentExtraController.addStudentLate)
router.post("/addStudentHosting",studentExtraController.addStudentHosting)
router.post("/addStudentEviction",studentExtraController.addStudentEviction)
module.exports = router;

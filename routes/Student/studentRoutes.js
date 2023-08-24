const express = require("express");
const router = express.Router();
const studentController = require("../../controller/Student/studentController");

router.get("/checkCodeNumber", studentController.checkCodeNumber);
router.post("/addStudent", studentController.addStudent);
router.get("/studentLogin", studentController.studentLogin);
router.post("/addPendingCollection", studentController.addPendingCollection);
router.get("/getStudentDues", studentController.getStudentDues)
router.get("/getStudentDuesStatus", studentController.getStudentDuesStatus)
router.get("/getStudentTotalDues", studentController.getStudentTotalDues)
router.get("/getStudentTotalExpenses", studentController.getStudentTotalExpenses)
router.get("/getStudentExpenses", studentController.getStudentExpenses)
module.exports = router;

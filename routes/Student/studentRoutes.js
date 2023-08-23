const express = require("express");
const router = express.Router();
const studentController = require("../../controller/Student/studentController");

router.get("/checkCodeNumber", studentController.checkCodeNumber);
router.post("/addStudent", studentController.addStudent);
router.get("/studentLogin", studentController.studentLogin);
router.post("/addPendingCollection", studentController.addPendingCollection);
router.get("/getStudentDues", studentController.getStudentDues)
module.exports = router;

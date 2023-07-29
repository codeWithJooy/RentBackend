const express = require("express");
const router = express.Router();
const studentController = require("../../controller/Student/studentController");

router.get("/checkCodeNumber", studentController.checkCodeNumber);
router.post("/addStudent", studentController.addStudent);

module.exports = router;

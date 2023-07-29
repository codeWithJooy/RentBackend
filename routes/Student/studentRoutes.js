const express = require("express");
const router = express.Router();
const studentController = require("../../controller/Student/studentController");

router.get("/checkCodeNumber", studentController.checkCodeNumber);

module.exports = router;

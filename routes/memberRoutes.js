const express = require("express");
const router = express.Router();
const memberControllers = require("../controller/memberController");

router.post("/addMember", memberControllers.addMember);
router.get("/getMembers", memberControllers.getMembers);
router.get("/getAMember", memberControllers.getAMember);
module.exports = router;

const express = require("express");
const router = express.Router();
const setupControllers = require("../controller/setupController");

router.post("/addNew", setupControllers.addFloor);
router.post("/addRoom", setupControllers.addRoom);
module.exports = router;

const express = require("express");
const router = express.Router();
const setupControllers = require("../controller/setupController");

router.post("/addFloors", setupControllers.addFloor);
router.post("/addRoom", setupControllers.addRoom);
router.post("/getFloorPresent", setupControllers.getFloorPresent);
router.get("/getFloors", setupControllers.getFloors);
module.exports = router;

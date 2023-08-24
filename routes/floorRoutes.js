const express = require("express");
const router = express.Router();
const floorControllers = require("../controller/floorController");

router.post("/addFloors", floorControllers.addFloors);
router.post("/addRoom", floorControllers.addRoom);
router.post("/getFloorPresent", floorControllers.getFloorPresent);
router.get("/getFloors", floorControllers.getFloors);
module.exports = router;

const express = require("express");
const router = express.Router();
const roomControllers = require("../controller/roomController");

router.get("/getRooms", roomControllers.getRooms);
router.get("/getAllRooms", roomControllers.getAllRooms);
router.get("/getSingleRoom", roomControllers.getSingleRoom);
router.get("/getRoomName", roomControllers.getRoomName);
router.put("/updateRoom", roomControllers.updateRoom);
router.get("/getTotalRoomCounts", roomControllers.getTotalRoomCounts);
module.exports = router;

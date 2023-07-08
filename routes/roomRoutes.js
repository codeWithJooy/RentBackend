const express = require("express");
const router = express.Router();
const roomControllers = require("../controller/roomController");

router.get("/getRooms", roomControllers.getRooms);
router.get("/getSingleRoom", roomControllers.getSingleRoom);
router.put("/updateRoom", roomControllers.updateRoom);
module.exports = router;

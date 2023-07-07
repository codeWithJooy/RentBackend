const express = require("express");
const router = express.Router();
const roomControllers = require("../controller/roomController");

router.get("/getRooms", roomControllers.getRooms);

module.exports = router;

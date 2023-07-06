const express = require("express");
const router = express.Router();
const setupControllers = require("../controller/setupController");

router.post("/newProperty", setupControllers.addProperty);

module.exports = router;

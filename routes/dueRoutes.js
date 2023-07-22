const express = require("express");
const router = express.Router();
const dueControllers = require("../controller/duesController");

router.post("/addDuesTeant", dueControllers.addDuesTenant);
router.post("/addDuesRoom", dueControllers.addDuesRoom);

module.exports = router;

const express = require("express");
const router = express.Router();
const dueControllers = require("../controller/duesController");


router.post("/addDuesTenant", dueControllers.addDuesTenant);
router.post("/addDuesRoom", dueControllers.addDuesRoom);
router.get("/getDuesTenant", dueControllers.getDuesTenant)
router.get("/getDues", dueControllers.getDues)
module.exports = router;

const express = require("express");
const router = express.Router();
const tenantControllers = require("../controller/tenantController");

router.get("/getTenants", tenantControllers.getTenants);
router.post("/addTenant", tenantControllers.addTenant);
module.exports = router;

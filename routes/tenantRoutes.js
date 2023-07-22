const express = require("express");
const router = express.Router();
const tenantControllers = require("../controller/tenantController");

router.get("/getTenants", tenantControllers.getTenants);
router.post("/addTenant", tenantControllers.addTenant);
router.get("/getATenant", tenantControllers.getATenant);
router.get("/getTenantCount", tenantControllers.getTenantCount);
module.exports = router;

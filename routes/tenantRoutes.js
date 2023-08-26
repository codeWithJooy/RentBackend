const express = require("express");
const router = express.Router();
const tenantControllers = require("../controller/tenantController");

router.get("/getTenants", tenantControllers.getTenants);
router.post("/addTenant", tenantControllers.addTenant);
router.get("/getATenant", tenantControllers.getATenant);
router.get("/getTenantCount", tenantControllers.getTenantCount);
router.get("/getAllTenantsCount", tenantControllers.getAllTenantsCount);
router.get("/getTenantName", tenantControllers.getTenantName);
router.get("/getTenantDetails", tenantControllers.getTenantDetails)
module.exports = router;

const express = require("express");
const router = express.Router();
const upload = require('../config/multerConfig');
const tenantControllers = require("../controller/tenantController");

router.get("/getTenants", tenantControllers.getTenants);
router.get("/getTenantsRoomwise",tenantControllers.getTenantRoomWise);
router.post("/addTenant", tenantControllers.addTenant);
router.get("/getATenant", tenantControllers.getATenant);
router.get("/getTenantCount", tenantControllers.getTenantCount);
router.get("/getAllTenantsCount", tenantControllers.getAllTenantsCount);
router.get("/getTenantName", tenantControllers.getTenantName);
router.get("/getTenantDetails", tenantControllers.getTenantDetails)
router.get("/getTenantsCredential", tenantControllers.getTenantsCredentials)
router.get("/resetTenantPassword", tenantControllers.resetTenantPassword);
router.post("/remindTenant",tenantControllers.remindTenant)
router.post("/updateTenant",tenantControllers.updateTenant)
router.post('/addDocument', upload.single('file'), tenantControllers.tenantDocument)
router.get("/getDocument",tenantControllers.getTenantDocument)
module.exports = router;

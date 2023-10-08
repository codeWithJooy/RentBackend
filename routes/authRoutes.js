const express = require("express");
const router = express.Router();
const authControllers = require("../controller/authController");

router.post("/signup", authControllers.Signup);
router.post("/login", authControllers.Login);
router.get("/addEmail",authControllers.addEmail)
router.get("/verifyOtp",authControllers.verifyOtp)
router.get("/updatePassword",authControllers.updatePassword)

module.exports = router;

const express = require("express");
const router = express.Router();
const authControllers = require("../controller/authController");

router.post("/signup", authControllers.Signup);
router.post("/login", authControllers.Login);

module.exports = router;

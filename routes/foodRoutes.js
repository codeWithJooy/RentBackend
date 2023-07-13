const express = require("express");
const router = express.Router();
const foodControllers = require("../controller/foodController");

router.post("/activateFood", foodControllers.activateFood);
router.get("/getActivated", foodControllers.getActivated);
router.put("/updateFood", foodControllers.updateFood);
module.exports = router;

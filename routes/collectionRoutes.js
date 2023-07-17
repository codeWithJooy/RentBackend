const express = require("express");
const router = express.Router();
const collectionControllers = require("../controller/collectionController");

router.post("/addCollection", collectionControllers.addCollection);
router.get("/getAllCollection", collectionControllers.getAllCollections);
router.get("/getCollection", collectionControllers.getCollection);

module.exports = router;

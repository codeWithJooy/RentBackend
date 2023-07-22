const express = require("express");
const router = express.Router();
const collectionControllers = require("../controller/collectionController");

router.post("/addCollection", collectionControllers.addCollection);
router.get("/getAllCollection", collectionControllers.getAllCollections);
router.get("/getCollection", collectionControllers.getCollection);
router.post("/addDiscount", collectionControllers.addDiscount);
router.get("/getDiscount", collectionControllers.getDiscount);
router.get("/getReceiptId", collectionControllers.getReceiptId);
router.get("/getAllDiscounts", collectionControllers.getAllCollections);
router.get("/getReceiptData", collectionControllers.getReceiptData);
module.exports = router;

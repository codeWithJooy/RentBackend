const express = require("express")
const router = express.Router()
const complaintController = require("../controller/complaintController")

router.post("/raiseComplaint", complaintController.raiseComplaint)

module.exports=router
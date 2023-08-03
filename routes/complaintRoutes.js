const express = require("express")
const router = express.Router()
const complaintController = require("../controller/complaintController")

router.post("/raiseComplaint", complaintController.raiseComplaint)
router.get("/getComplaints", complaintController.getComplaints)
router.get("/getStudentComplaints",complaintController.getStudentComplaints)
router.put("/updateStatus",complaintController.updateStatus)
module.exports = router
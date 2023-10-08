const express = require("express");
const router = express.Router();
const studentController = require("../../controller/Student/studentController");
const studentExtraController=require("../../controller/Student/studentExtraController");
router.get("/checkCodeNumber", studentController.checkCodeNumber);
router.post("/addStudent", studentController.addStudent);
router.get("/studentLogin", studentController.studentLogin);
router.post("/addPendingCollection", studentController.addPendingCollection);
router.get("/getStudentDues", studentController.getStudentDues)
router.get("/getStudentDuesStatus", studentController.getStudentDuesStatus)
router.get("/getStudentTotalDues", studentController.getStudentTotalDues)
router.get("/getStudentTotalExpenses", studentController.getStudentTotalExpenses)
router.get("/getStudentExpenses", studentController.getStudentExpenses)
router.post("/addStudentLate",studentExtraController.addStudentLate)
router.post("/addStudentEviction",studentExtraController.addStudentEviction)

//Hosting Section
router.post("/addStudentHosting",studentExtraController.addStudentHosting)
router.get("/getHosting",studentExtraController.getHosting)
router.put("/updateHosting",studentExtraController.updateHosting)

//Late Section
router.post("/addStudentLate",studentExtraController.addStudentLate)
router.get("/getLate",studentExtraController.getLate)
router.post("/updateStudentLate",studentExtraController.updateStudentLate)

//Student Notifications
router.put("/updateStudentNotifications",studentExtraController.updateStudentNotifications)
router.get("/getStudentNotifications",studentExtraController.getStudentNotifications)
router.get("/getStudentNotificationsCount",studentExtraController.getStudentNotificationsCount)


module.exports = router;

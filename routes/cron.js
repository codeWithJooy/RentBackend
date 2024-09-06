const express=require("express")
const router=express.Router()

const cronController=require("../controller/cron")

router.get("/",cronController.cron)

module.exports=router
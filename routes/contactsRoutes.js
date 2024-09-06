const express=require("express")
const router=express.Router()
const contactsController=require("../controller/Contacts/contactsType")
const contactsAddController=require("../controller/Contacts/contactAdd")

router.post("/addContactType",contactsController.postContactType)
router.post("/addContact",contactsAddController.addContact)
router.get("/getContacts",contactsAddController.getContact)
router.get("/getContactTypes",contactsController.getContactTypes)
module.exports=router;
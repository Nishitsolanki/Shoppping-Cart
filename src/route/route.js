const express=require("express")
const router=express.Router()
const userController=require("../controllers/userController")

router.get("/user/:userId/profile",userController.getuser)


module.exports=router
const express =require("express")
const router=express.Router()
const userController=require("../controllers/userController")
const productController=require("../controller/productController")


//-------------------------user-api-------------------------------------------------------------------------
router.get("/user/:userId/profile",userController.getuser)
router.post('/product1',productController.createProduct)
router.post('/createuser',userController.createuser)


module.exports=router
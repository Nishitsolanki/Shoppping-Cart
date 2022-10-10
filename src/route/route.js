const express =require("express")
const router=express.Router()
const userController=require("../controller/userController")
const productController=require("../controller/productController")

router.get("/user/:userId/profile",userController.getuser)
router.post('/product1',productController.createProduct)
router.post('/register',userController.createUser)


module.exports=router;
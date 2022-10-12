const express =require("express")
const router=express.Router()
const userController=require("../controller/userController")
const productController=require("../controller/productController")

 
//********User API*****
router.post('/register',userController.createUser)
router.post('/login',userController.loginUser)
//router.get("/user/:userId/profile",userController.getuser)
router.put('/user/:userId/profile', userController.updateProfile)

//*********Product API*******
router.post('/products',productController.createProduct)

module.exports=router;

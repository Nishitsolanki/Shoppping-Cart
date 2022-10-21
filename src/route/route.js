const express =require("express")
const router=express.Router()
const userController=require("../controller/userController")
const productController=require("../controller/productController")
const cartController=require("../controller/cartController")
const orderController=require("../controller/orderController")
const auth=require('../middleware/auth')
//const test=require("../controller/test")
 
//***User API**
router.post('/register',userController.createUser)
router.post('/login',userController.loginUser)
router.get("/user/:userId/profile",auth.authentication,userController.getuser)
router.put('/user/:userId/profile',auth.authentication,userController.updateProfile)

//****Product API**
router.post('/products',productController.createProduct)
router.get("/products", productController.getProductsByQuery)
router.get("/products/:productId",productController.getProductById)
router.put("/products/:productId", productController.updateProduct)
router.delete("/products/:productId",productController.deleteProduct)

//router.post('/testing',productController.testing)

//**CART API***
router.post('/users/:userId/cart',auth.authentication, cartController.createCart)
//router.post('/users/:userId/cart', test.createCart)
 router.get('/users/:userId/cart', auth.authentication,cartController.getCart)
 router.put('/users/:userId/cart',auth.authentication, cartController.updateCart)
 router.delete('/users/:userId/cart',auth.authentication, cartController.deleteCart)

 //**ORDER API***
 router.post('/users/:userId/orders',auth.authentication, orderController.createOrder)
 router.put('/users/:userId/orders',auth.authentication, orderController.updateOrder)

router.all("/*", async function(req,res){
    return res.status(400).send({status:false,message:"plz check url"})
})

module.exports=router;
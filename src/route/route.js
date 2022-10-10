const express=require('express');
const route=express.Router();

const productController=require("../controller/productController")

route.post('/product1',productController.createProduct)


module.exports=route
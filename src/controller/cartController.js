const cartModel = require("../models/cartModel");
const userModel = require("../models/userModel");
const productModel = require('../models/productModel');
const validation = require("../validations/validator")
const mongoose=require("mongoose")


// ---------------------------------- Create Cart ------------------------------------------------------

const createCart = async (req, res) => {
    try {
        
     const userId = req.params.userId;
      const data = req.body;
      const { quantity, productId } = data;
      
          // AUTHORIZATION
        //-->
        let tokenUserId = req.tokenId
        if(tokenUserId !== userId){
            return res.status(403).send({status:false, message:'you are not authorized'})
        }
        //<--

         if (Object.keys(data).length === 0) return res.status(400).send({ status: false, message: "Request body can'nt be empty" })

        if (!validation.isValidObjectIdd(userId)) return res.status(400).send({ status: false, message: "User id is Invalid" })

        if (validation.isValidd(productId)) return res.status(400).send({ status: false, message: "Product id is required and should be a valid string" })

         if (!validation.isValidObjectIdd(productId)) return res.status(400).send({ status: false, message: "Product Id is invalid" })
//*imp product id aur quantity ek ek karke hit karna postman mai *//
        if (validation.isValidd(quantity)) return res.status(400).send({ status: false, message: "Quantity is required" })
        if (isNaN(Number(quantity))) return res.status(400).send({ status: false, message: "Quantity should be a valid number" })
        if (Number.isNaN(quantity))  return res.status(400).send({ status: false, message: "Quantity should be a valid number" })
        if (Number(quantity) < 1) return res.status(400).send({ status: false, message: "Quantity shouldn't be less than one" })
     
        const userExist = await userModel.findById({ _id: userId })
        if (!userExist) return res.status(404).send({ status: false, message: `No user found with this ${userId}` })

        const productExist = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!productExist) return res.status(404).send({ status: false, message: `No product found with this ${productId}` })
        
        const cartExist=await cartModel.findOne({userId:userId})
       // if(!cartExist) return res.status(404).send({status:false,message:`No card found with this ${userId}`})
        if (cartExist) {
            let price = cartExist.totalPrice + (quantity * productExist.price)

            let arrayOfItems = cartExist.items
            for (let i in arrayOfItems) {
                if (arrayOfItems[i].productId.toString() === productId) {
                    arrayOfItems[i].quantity += Number(quantity)

                    let updatedCart = { items: arrayOfItems, totalPrice: price, totalItems: arrayOfItems.length }
                    let response = await cartModel.findOneAndUpdate({ _id: cartExist._id }, updatedCart, { new: true })
                    return res.status(200).send({ status: true, message: "Product added in cart successfully", data: response })
                }
            }
            arrayOfItems.push({ productId: productId, quantity: quantity })
            let updatedCart = { items: arrayOfItems, totalPrice: price, totalItems: arrayOfItems.length }
            let response = await cartModel.findOneAndUpdate({ _id: cartExist._id }, updatedCart, { new: true })
            return res.status(200).send({ status: true, message: "Product added in cart successfully", data: response })
          
             } else {

            let cartData = {
                userId: userId,
                items: [{
                    productId: productId,
                    quantity: quantity
                }],
                totalPrice: productExist.price * quantity,
                totalItems: 1
            }
            const saveCart = await cartModel.create(cartData)
            return res.status(201).send({ status: true, message: "cart created successfully", data: saveCart })
        }  
      }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
};



//====================Get Api Cart===================================
const getCart = async function (req, res) {
  try {
    let userId = req.params.userId;
    if (!userId)
      return res
        .status(400)
        .send({ status: false, message: "userId should be present" });
    if (!validation.isValidObjectIdd(userId))
      return res
        .status(400)
        .send({ status: false, message: "Please enter valid userId" });

         // AUTHORIZATION
        //-->
        let tokenUserId = req.tokenId
        if(tokenUserId !== userId){
            return res.status(403).send({status:false, message:'you are not authorized'})
        }
        //<--

    let user = await userModel.findById(userId);
    if (!user)
      return res.status(400).send({ status: false, message: "user Not found" });
    


    const fetchcart = await cartModel.findOne({ userId: userId });

    return res
      .status(200)
      .send({ status: true, message: "User Profile Details", data: fetchcart });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

//========================PUT update api===========================

const updateCart = async (req, res) => {
  try {

      let userId = req.params.userId;
      let data = req.body

      if (validation.isValidd(data)) {
          return res.status(400).send({ status: false, message: "Please provide details to remove product from cart " });
      }

        // AUTHORIZATION
        //-->
        let tokenUserId = req.tokenId
        if(tokenUserId !== userId){
            return res.status(403).send({status:false, message:'you are not authorized'})
        }
        //<--

      // checking if cart is present or not  
      let cart = await cartModel.findOne({ userId: userId });
      if (!cart) {
          return res.status(400).send({ status: false, message: `No cart found with this ${userId} userId` });
      }

      if (data.totalPrice || data.totalItems || typeof data.totalPrice == "string" || typeof data.totalItems == "string") {
          return res.status(400).send({ status: false, message: "Cannot change or update total price or total Items" })
      }
      if (data.cartId || typeof data.cartId == "string") {
          if (validation.isValidd(data.cartId)) {
              return res.status(400).send({ status: false, message: "Please provide valid cart Id" });
          }
          if (!validation.isValidObjectIdd(data.cartId)) {
              return res.status(400).send({ status: false, message: "Provide Valid Cart Id" });
          }
          if (cart._id.toString() !==data.cartId) {
              return res.status(400).send({ status: false, message: `cart Id does not match with provided User ID ${data.cartId}` })
          }
      }
      if (validation.isValidd(data.productId)) {
          return res.status(400).send({ status: false, message: "Please provide product Id " });
      }
      if (!validation.isValidObjectIdd(data.productId)) {
          return res.status(400).send({ status: false, message: "Please provide valid product Id" })
      }  
      let findProduct = await productModel.findById({ _id: data.productId })
      if (!findProduct) {
          return res.status(404).send({ status: false, message: "No product found with this product Id" })
      }
      if (validation.isValidd(data.removeProduct)) {
          return res.status(400).send({ status: false, message: "removeProduct is required" })
      }
      if (!(/0|1/.test(data.removeProduct))) {
          return res.status(400).send({ status: false, message: "removeProduct should be either 0 or 1" })
      }

      let productArr = cart.items.filter(x =>
          x.productId.toString() == data.productId)
          console.log(productArr)

      if (productArr.length == 0) {
          return res.status(400).send({ status: false, message: "Product is not present in cart" })
      }

      let index = cart.items.indexOf(productArr[0])

      if (data.removeProduct == 0) {

          cart.totalPrice = (cart.totalPrice - (findProduct.price * cart.items[index].quantity)).toFixed(2)
          cart.items.splice(index, 1)
          cart.totalItems = cart.items.length
          cart.save()
      }

      if (data.removeProduct == 1) {

          cart.items[index].quantity -= 1;
          cart.totalPrice = (cart.totalPrice - findProduct.price).toFixed(2)
          if (cart.items[index].quantity == 0) {

              cart.items.splice(index, 1)
          }
          cart.totalItems = cart.items.length
          cart.save()
      }
      return res.status(200).send({ status: true, message: "Success", data: cart })

  } catch (error) {
      return res.status(500).send({ status: false, message: error.message })
  }

}

//===============================DELETE API CART=======================================
const deleteCart = async function(req,res){
  try {
    const paramsId = req.params.userId
    let cartId=req.body.cartId

    if(!validation.isValidObjectIdd(paramsId)){
        return res.status(400).send({status:false, message:'params id is not valid'})
    }
    if(!validation.isValidObjectIdd(cartId)){
      return res.status(400).send({status:false, message:'cart id is not valid'})
  }

     // AUTHORIZATION
        //-->
        let tokenUserId = req.tokenId
        if(tokenUserId !== paramsId){
            return res.status(403).send({status:false, message:'you are not authorized'})
        }
        //<--

    const findUser = await userModel.findById(paramsId)
    if(!findUser){
        return res.status(404).send({status:false, message:'This user does not exist'})
    }

      // checking if cart is present or not  
      let cart = await cartModel.findOne({ userId: paramsId });
      if (!cart) {
          return res.status(400).send({ status: false, message: `No cart found with this ${userId} userId` });
      }
  
    let deleteData = await cartModel.findByIdAndUpdate({_id:cartId}, {isDeleted:true, deletedAt:Date.now()}, {new:true})
  
    res.status(200).send({status:false, message:'Data deleted Successfully'});
  
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }};
    


module.exports = { getCart,updateCart,createCart, deleteCart};
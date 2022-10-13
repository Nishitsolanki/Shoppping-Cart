const cartModel = require("../models/cartModel");
const userModel = require("../models/userModel");
const validation = require("../validations/validator.js")
const mongoose=require("mongoose")


// const isValid = function (value) {
//   if (typeof value === "undefined" || value === null) return false;
//   if (typeof value === "string" && value.trim().length === 0) return false;
//   return true;
// };
const isValidObjectId = (ObjectId) => {
  return mongoose.Types.ObjectId.isValid(ObjectId);
};
// const isValidRequest = function (object) {
//   return Object.keys(object).length > 0;
// };

//==================POST API CART=======================================
// const createCart= async function(req,res){
//   try {
//     let data=req.body
//     if(!isValidRequest(data)) return res.status(400).send({status:false,message:"Data required in body"})
//   } catch (error) {
//     res.status(500).send({ status: false, message: error.message });
//   }
// }


// ---------------------------------- Create Cart ------------------------------------------------------

const createCart = async (req, res) => {
  try {

      let data = req.body;
      //console.log(data)

      if (!validation.isValidBody(data))
          return res.status(400).send({ status: false, message: "Body cannot be empty" });

      let userId = req.params.userId;

      if (!isValidObjectId(userId))
          return res.status(400).send({ status: false, message: "Invalid userId ID" })

      let { cartId,items } = data
          let {productId,quantity}=items
         // console.log(productId,quantity)

      if (!validation.isValid(productId))
          return res.status(400).send({ status: false, message: "Product Id is required" })
       

        // Validation in case user sending data in JSON Body
      if(quantity < 1 && typeof quantity == "number"){
          return res.status(400).send({status: false, message: "Value should not be less than 1"})
      }

      if (!quantity) {
          quantity = 1
      }
      quantity = Number(quantity) //In case of form data we are type casting to Number(quantity)
      if (quantity && typeof quantity != "number" || isNaN(quantity))
          return res.status(400).send({ status: false, message: "Quantity should be number" })

      if (quantity < 1){
          return res.status(400).send({ status: false, message: "Quantity cannot be less than 1" })
      }
      if (!isValidObjectId(productId))
          return res.status(400).send({ status: false, message: "Invalid product ID" })

      if (cartId) {
          if (!validation.isValidObjectId(cartId))
              return res.status(400).send({ status: false, message: "Invalid cart ID" })
      }

      //checking for valid user
      let validUser = await userModel.findOne({ _id: userId })
      if (!validUser) return res.status(404).send({ status: false, message: "User does not exists" })

      if (cartId) {
          var findCart = await cartModel.findOne({ _id: cartId })
          if (!findCart)
              return res.status(404).send({ status: false, message: "Cart does not exists" })
      }

      //searching for product    
      let validProduct = await productModel.findOne({ _id: productId, isDeleted: false })
      if (!validProduct) return res.status(404).send({ status: false, message: "No products found or product has been deleted" })

      let validCart = await cartModel.findOne({ userId: userId })
      if (!validCart && findCart) {
          return res.status(403).send({ status: false, message: `Cart does not belong to ${validUser.fname} ${validUser.lname}` })
      }
      if (validCart) {
          if (cartId) {
              if (validCart._id.toString() != cartId)
                  return res.status(403).send({ status: false, message: `Cart does not belong to ${validUser.fname} ${validUser.lname}` })
          }
          let productidincart = validCart.items
          let uptotal = (validCart.totalPrice + (validProduct.price * Number(quantity))).toFixed(2)
          let proId = validProduct._id.toString()
          for (let i = 0; i < productidincart.length; i++) {
              let productfromitem = productidincart[i].productId.toString()


              //updates old product i.e QUANTITY
              if (proId == productfromitem) {
                  let oldQuant = productidincart[i].quantity
                  let newquant = oldQuant + quantity
                  productidincart[i].quantity = newquant
                  validCart.totalPrice = uptotal
                  await validCart.save();
                  return res.status(201).send({ status: true, message: 'Success', data: validCart })
              }
          }
          //adds new product
          validCart.items.push({ productId: productId, quantity: Number(quantity) })
          let total = (validCart.totalPrice + (validProduct.price * Number(quantity))).toFixed(2)
          validCart.totalPrice = total
          let count = validCart.totalItems
          validCart.totalItems = count + 1
          await validCart.save()
          return res.status(201).send({ status: true, message: 'Success', data: validCart })
      }

      // 1st time cart
      let calprice = (validProduct.price * Number(quantity)).toFixed(2)
      let obj = {
          userId: userId,
          items: [{
              productId: productId,
              quantity: quantity
          }],
          totalPrice: calprice,
      }
      obj['totalItems'] = obj.items.length
      let result = await cartModel.create(obj)

      return res.status(201).send({ status: true, message: 'Success', data: result })
  }
  catch (error) {
      return res.status(500).send({ status: false, error: error.message });
  }
}

//====================Get Api Cart===================================
const getCart = async function (req, res) {
  try {
    let userId = req.params.userId;
    if (!userId)
      return res
        .status(400)
        .send({ status: false, message: "userId should be present" });
    if (!isValidObjectId(userId))
      return res
        .status(400)
        .send({ status: false, message: "Please enter valid userId" });

    let user = await userModel.findById(userId);
    if (!user)
      return res.status(400).send({ status: false, message: "user Not found" });

    const fetchcart = await cartModel.findOne({ _id: userId });

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

      if (validation.isValid(data)) {
          return res.status(400).send({ status: false, message: "Please provide details to remove product from cart " });
      }

      // checking if cart is present or not  
      let cart = await cartModel.findOne({ userId: userId });
      if (!cart) {
          return res.status(400).send({ status: false, message: `No cart found with this ${userId} userId` });
      }

      if (data.totalPrice || data.totalItems || typeof data.totalPrice == "string" || typeof data.totalItems == "string") {
          return res.status(400).send({ status: false, message: "Cannot change or update total price or total Items" })
      }
      if (data.cartId || typeof data.cartId == "string") {
          if (validation.isValid(data.cartId)) {
              return res.status(400).send({ status: false, message: "Please provide valid cart Id" });
          }
          if (!isValidObjectId(data.cartId)) {
              return res.status(400).send({ status: false, message: "Provide Valid Cart Id" });
          }
          if (cart._id.toString() !== data.cartId) {
              return res.status(400).send({ status: false, message: `cart Id does not match with provided User ID ${userId}` })
          }
      }
      if (validation.isValid(data.productId)) {
          return res.status(400).send({ status: false, message: "Please provide product Id " });
      }
      if (!isValidObjectId(data.productId)) {
          return res.status(400).send({ status: false, message: "Please provide valid product Id" })
      }  
      let findProduct = await productModel.findById({ _id: data.productId })
      if (!findProduct) {
          return res.status(404).send({ status: false, message: "No product found with this product Id" })
      }
      if (validation.isValid(data.removeProduct)) {
          return res.status(400).send({ status: false, message: "removeProduct is required" })
      }
      if (!(/0|1/.test(data.removeProduct))) {
          return res.status(400).send({ status: false, message: "removeProduct should be either 0 or 1" })
      }

      let productArr = cart.items.filter(x =>
          x.productId.toString() == data.productId)

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




module.exports = { getCart,updateCart,createCart};

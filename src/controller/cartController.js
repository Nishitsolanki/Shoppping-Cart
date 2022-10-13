const cartModel = require("../models/cartModel");
const userModel = require("../models/userModel");

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};
const isValidObjectId = (ObjectId) => {
  return mongoose.Types.ObjectId.isValid(ObjectId);
};
const isValidRequest = function (object) {
  return Object.keys(object).length > 0;
};

//==================POST API CART=======================================
const createCart= async function(req,res){
  try {
    let data=req.body
    if(!isValidRequest(data)) return res.status(400).send({status:false,message:"Data required in body"})
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
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


module.exports = { getCart };

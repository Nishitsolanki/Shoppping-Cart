const cartModel = require("../models/cartModel");
const userModel = require("../models/userModel");

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

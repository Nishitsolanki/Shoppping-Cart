const validation = require("../validator/validators");
const cartModel = require("../models/cartModel");
const orderModel = require("../models/orderModel");
const mongoose=require("mongoose")


// ---------------------------------- Create Order ------------------------------------------------------


const createOrder = async (req, res) => {
    try {
        let userId = req.params.userId;

        if (validation.isValid(userId)) {
            return res.status(400).send({ status: false, message: "User ID is missing" });
        }

        if (!validation.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Please provide valid user Id" });
        }

        let data = req.body;


        if (validation.isValidBody(data))
            return res.status(400).send({ status: false, message: "Body cannot be empty" });

        let { cartId, status, cancellable } = data;

        if (!cartId)
            return res.status(400).send({ status: false, message: "Cart ID is required" });

        if (validation.isValid(cartId)) {
            return res.status(400).send({ status: false, message: "Cart ID is missing" });
        }

        if (!validation.isValidObjectId(cartId)) {
            return res.status(400).send({ status: false, message: "Please provide valid cart Id" });
        }

        let findCart = await cartModel.findOne({ userId: userId });

        if (!findCart)
            return res.status(404).send({ status: false, message: `No such cart exist for ${userId}` });

        if (findCart.items.length === 0)
            return res.status(400).send({ status: false, message: "No Item in Cart" });


        if (status || typeof status == "string") {
            //checking if the status is valid
            if (validation.isValid(status)) {
                return res.status(400).send({ status: false, message: " Please provide status" })
            }
            if (!validation.isValidStatus(status))
                return res.status(400).send({ status: false, message: "Status should be one of 'pending', 'completed', 'cancelled'" });
        }

        if (cancellable || typeof cancellable == 'string') {
            if (validation.isValid(cancellable))
                return res.status(400).send({ status: false, message: "cancellable should not contain white spaces" });
            if (typeof cancellable == 'string') {
                //converting it to lowercase and removing white spaces
                cancellable = cancellable.toLowerCase().trim();
                if (cancellable == 'true' || cancellable == 'false') {
                    //converting from string to boolean
                    cancellable = JSON.parse(cancellable)
                   
                } else {
                    return res.status(400).send({ status: false, message: "Please enter either 'true' or 'false'" });
                }
            }
        }

        let totalQuantity = 0;
        for (let i = 0; i < findCart.items.length; i++)
            totalQuantity += findCart.items[i].quantity;


        data.userId = userId;
        data.items = findCart.items;
        data.totalPrice = findCart.totalPrice;
        data.totalItems = findCart.totalItems;
        data.totalQuantity = totalQuantity;

        let result = await orderModel.create(data);
        await cartModel.updateOne({ _id: findCart._id },
            { items: [], totalPrice: 0, totalItems: 0 });

        return res.status(201).send({ status: true, message: "Success", data: result })
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}

module.exports={createOrder}
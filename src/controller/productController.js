const mongoose = require('mongoose');
const productModel = require('../models/productModel');


const createProduct = async function (req, res) {
    try {
        const requestBody = req.body


        if (!Object.keys(requestBody).length > 0) {
            return res.status(400).send({ status: false, message: 'Body Data is required' })
        }
        const { title, description, price, currencyId, currencyFormat, availableSizes } = requestBody
        const isTitleAlreadyExist = await productModel.findOne({ title })
        if (isTitleAlreadyExist) {
            return res.status(400).send({ status: false, message: 'This Title is already Exist' })
        }
        if (!(/^\d{0,8}[.]?\d{1,4}$/.test(price))) {
            return res.status(400).send({ status: false, message: 'Invalid price' })
        }
        if (currencyId !== "INR") {
            return res.status(400).send({ status: false, message: 'only accepted INR' })
        }
        if (currencyFormat !== "₹") {
            return res.status(400).send({ status: false, message: 'Only accepted ₹ this currency symbol' })
        }
        // let files = req.files
        // if (!(files && files.length > 0)) {
        //     return res.status(400).send({ status: false, message: "No file found" });
        // }
        const product = await productModel.create(requestBody)
        res.status(201).send({ status: true, message: 'Product created successfully', data: product })
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send({ status: false, Error: err.message })
    }
}


module.exports.createProduct = createProduct;
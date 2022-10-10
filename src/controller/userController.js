const userModel = require('../models/userModel')
const bcrypt = require('bcrypt');
const upload = require('../aws/config')
const validation = require("../validations/validator.js")
const jwt = require("jsonwebtoken");
const multer = require("multer")
 i 



//====================================  Creating Users  ======================================//

const createUser = async function (req, res) {
   try{
    let data = req.body;

    const { fname, lname, email, phone, password, address } = data;

    if (!validation.isValidBody(data)) {
        return res.status(400).send({ status: false, msg: "Please provide data in the request body!" })
    }

    if(!fname) return res.status(400).send({status : false, message : "First Name is required!"})
    if (!validation.isValid(fname) && !validation.alphabetTestOfString(fname)) {
        return res.status(400).send({ status: false, msg: "fname is invalid" })
    }

    if(!lname) return res.status(400).send({status : false, message : "Last Name is required!"})
    if (!validation.isValid(lname) && !validation.alphabetTestOfString(lname)) {
        return res.status(400).send({ status: false, msg: "lname is invalid" })
    }

    if(!email) return res.status(400).send({status : false, message : "Email is required!"})
    if (!validation.isValidSyntaxOfEmail(email)) {
        return res.status(400).send({ status: false, msg: "Email is invalid!" })
    }
    let userEmail = await userModel.findOne({ email : email })
    if (userEmail)
        return res.status(401).send({ status: false, msg: "This email address already exists, please enter a unique email address!" })


    if(!phone) return res.status(400).send({status : false, message : "Phone number is required!"})
    if (!validation.isValidMobileNum(phone)) {
        return res.status(400).send({ status: false, msg: "Phone is invalid" })
    }
    let userNumber = await userModel.findOne({ phone: phone })
    if (userNumber)
        return res.status(409).send({ status: false, msg: "This phone number already exists, please enter a unique phone number!" })

    if(!password) return res.status(400).send({status : false, message : "Password is required!"})
    if (!validation.isValidPassword(password)) {
        return res.status(400).send({ status: false, msg: "Password should be strong, please use one number, one upper case, one lower case and one special character and characters should be between 8 to 15 only!" })
    }

  //  const salt = await bcrypt.genSalt(10) // creates special characters
  //  data.password = await bcrypt.hash(data.password, salt) // applies special characters generated by genSalt to password


    if(!address.shipping.street) return res.status(400).send({status : false, message : "Shipping Street is required!"})
    if (!validation.isValid(address.shipping.street)) {
        return res.status(400).send({ status: false, msg: "Invalid shipping street!" })
    }

    if(!address.shipping.city) return res.status(400).send({status : false, message : "Shipping City is required!"})
    if (!validation.isValid(address.shipping.city)) {
        return res.status(400).send({ status: false, msg: "Invalid shipping city!" })
    }

    if(!address.shipping.pincode) return res.status(400).send({status : false, message : "Shipping Pincode is required!"})
    if (!validation.isValidPinCode(address.shipping.pincode)) {
        return res.status(400).send({ status: false, msg: "Invalid shipping pincode!" })
    }

    if(!address.billing.street) return res.status(400).send({status : false, message : "Billing Street is required!"})
    if (!validation.isValid(address.billing.street)) {
        return res.status(400).send({ status: false, msg: "Invalid billing street!" })
    }

    if(!address.billing.city) return res.status(400).send({status : false, message : "Billing City is required!"})
    if (!validation.isValid(address.billing.city)) {
        return res.status(400).send({ status: false, msg: "Invalid billing city!" })
    }

    if(!address.billing.pincode) return res.status(400).send({status : false, message : "Billing Pincode is required!"})
    if (!validation.isValidPinCode(address.billing.pincode)) {
        return res.status(400).send({ status: false, msg: "Invalid billing pincode!" })
    }



    let files = req.files
    if (files && files.length > 0) {
      
        let uploadedFileURL = await upload.uploadFile(files[0])
      
        data.profileImage = uploadedFileURL;
    }
    else {
        res.status(400).send({ msg: "Files are required!" })
    }
    const document = await userModel.create(data)
    res.status(201).send({ status: true, data: document })

}catch(error){
    res.status(500).send({message : error.message})
}
}
  module.exports={createUser}






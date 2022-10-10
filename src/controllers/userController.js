const mongoose=require("mongoose")
const userModel = require("../models/userModel")
const getuser=async function (req,res){
    try{
let userId=req.params.userId
const user=await userModel.findOne ({_id:userId})
return res.status(200).send({ status: true, message: 'User Profile Details', data: user })
} catch (error) {
    res.status(500).send({ status: false, message: error.message })
}
}
 module.exports={getuser}
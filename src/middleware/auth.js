const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const userModel = require("../models/userModel");


const authentication = async function(req,res,next)
{
    try
    {
        let token = req.headers['authorization']

        // if no token found
        if (typeof token=='undefined') {
            return res.status(400).send({status: false,message: "Token required! Please login to generate token"});
        }    

        let bearer = token.split(" ")
        let bearerToken = bearer[1]

        jwt.verify(bearerToken, "Group30-Project-Shopping-cart", { ignoreExpiration: true },function (error, decodedToken) {
            // if token is invalid
            if (error) {
                return res.status(400).send({status: false,message: "Token is invalid"});
            }    
            // if token is valid
            else {
                // if token expired
                if (Date.now() > decodedToken.exp * 1000) {
                    return res.status(401).send({status: false,message: "Session Expired"});
                }
                req.tokenId =  decodedToken.userId 
               // global.gloUserId;
                // console.log(gloUserId)
                // console.log(decodedToken.userId)
                next();
            }
        })   
    }
    catch(err)
    {
        console.log(err.message)
        res.status(500).send({status:false,Error:err.message})
    }

}


// let authorization=async function(req,res,next){
//     try{


//         let userId=req.params.userId;

//         if (!mongoose.Types.ObjectId.isValid(userId)) {
//             return res.status(400).send({ msg: "userId is invalid", status: false })
//         }

//         let user=await userModel.findById(userId);
//         if(!user){
//             res.status(404).send("No user found with this userId");
//         }
   
//           let tokenId=req.tokenId
//           if(userId==tokenId){
//             next();
//           }else{
//             res.send("not authorised")
//           }
   // }
//     catch(error){
//         res.status(500).send(error.message)
//     }
// }
module.exports = {authentication}

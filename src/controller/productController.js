const mongoose = require('mongoose');
const productModel = require('../models/productModel');
const aws=require('../aws/config')
const validation = require("../validations/validator.js")


const isValid = function(value){
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    if (typeof value === 'number' && value.toString().trim().length === 0 ) return false 
    return true;
}

const isValidRequestBody = function(requestBody){
    return Object.keys(requestBody).length > 0
}

const isValidObjectId = function(ObjectId){
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

//----------------------------------------------CREATE PRODUCT-----------------------------------------

const createProduct = async function(req,res)
{
    try
    {
        const requestBody = req.body
    //    console.log(requestBody,req.files)
       
        if(!isValidRequestBody(requestBody)){
            return res.status(400).send({status:false, message:'Body Data is required'})
        }

       
        const {title, description, price, currencyId, currencyFormat, availableSizes} = requestBody

        if(!isValid(title)){
            return res.status(400).send({status:false, message:'Title is required'})
        }
      
        const isTitleAlreadyExist = await productModel.findOne({title})
        if(isTitleAlreadyExist){
            return res.status(400).send({status:false, message:'This Title is already Exist'})
        }

        if(!isValid(description)){
            return res.status(400).send({status:false, message:'Description is required'})
        }

        if(!isValid(price)){
            return res.status(400).send({status:false, message:'Price is required'})
        }
    
        if(!(/^\d{0,8}[.]?\d{1,4}$/.test(price))){
            return res.status(400).send({status:false, message:'Invalid price'})
        }

        if(!isValid(currencyId)){
            return res.status(400).send({status:false, message:'CurrencyId is required'})
        }
       
        if(currencyId !== "INR"){
            return res.status(400).send({status:false, message:'only accepted INR'})
        }

        if(!isValid(currencyFormat)){
            return res.status(400).send({status:false, message:'CurrencyFormat is required'})
        } 
      
        if(currencyFormat !==  "₹"){
            return res.status(400).send({status:false, message:'Only accepted ₹ this currency symbol'})
        }

        // if(!isValid(availableSizes)){
        //     return res.status(400).send({status:false, message:'AvailableSizes is required'})
        // }
            // availableSizes=["S", "XS", "M", "X", "L", "XXL", "XL"]
        if (availableSizes&&availableSizes=="object") {
            if (!availableSizes) return res.status(400).send({ status: false, msg: "provide size" })
            let size=availableSizes.split(",").map(x=>x.trim())   //,se tod dega  //M,S will be "M","S"
           for (let i=0;i<size.length;i++){
            if(!(["S", "XS", "M", "X", "L", "XXL", "XL"].includes(size[i])))
            return res.status(400).send({ status: false, msg: `Size should be among ${["S", "XS", "M", "X", "L", "XXL", "XL"]}` })
           }
           // if (!isValid(size)){
                // if(["S", "XS", "M", "X", "L", "XXL", "XL"].includes(size) == false)
                // return res.status(400).send({ status: false, msg: `Size should be among ${["S", "XS", "M", "X", "L", "XXL", "XL"]}` })
             
           availableSizes = size[i].toUpperCase()
            console.log(availableSizes)
        }
        let files = req.files

        if (!files){
            return res.status(400).send({ status: false, message: "No file found" });
        }
           
        let uploadedFileURL = await aws.uploadFile(files[0]);
       // console.log(uploadedFileURL);
        requestBody.productImage = uploadedFileURL;
        // console.log(uploadedFileURL)
        console.log(requestBody)
        const product = await productModel.create(requestBody)
        res.status(201).send({status:true,message:'Product created successfully', data:product})

    }
    catch(err)
    {
        console.log(err.message)
        res.status(500).send({status:false, Error:err.message})
    }
}

//---------------------------------------------GET PRODUCT BY QUERY-------------------------------------------

const getProductsByQuery = async function(req,res)
{
    try
    {
        const queryParams = req.query

        let {size, name, priceGreaterThan, priceLessThan, priceSort} = queryParams

        const filterQuery = { isDeleted: false, ...req.query }
        console.log(filterQuery)
        
        if (size) {
            if (!size) return res.status(400).send({ status: false, msg: "provide size" })
            let size=size.split(" ").map(x=>x.trim())
           for (let i=0;i<size.length;i++){
            if(!(["S", "XS", "M", "X", "L", "XXL", "XL"].includes(size[i])))
            return res.status(400).send({ status: false, msg: `Size should be among ${["S", "XS", "M", "X", "L", "XXL", "XL"]}` })
           }
           // if (!isValid(size)){
                // if(["S", "XS", "M", "X", "L", "XXL", "XL"].includes(size) == false)
                // return res.status(400).send({ status: false, msg: `Size should be among ${["S", "XS", "M", "X", "L", "XXL", "XL"]}` })
             
            filterQuery['availableSizes'] = size[i].toUpperCase()
            console.log(availableSizes)
        }

        if (priceGreaterThan) {
            if (!(/^(0|[1-9][0-9]*)$/.test(priceGreaterThan)))
                return res.status(400).send({ status: false, msg: "provide priceGreaterThan in numeric" })
            filterQuery['price'] = { $gt: priceGreaterThan }
        };

        if (priceLessThan) {
            if (!(/^(0|[1-9][0-9]*)$/.test(priceLessThan)))
                return res.status(400).send({ status: false, msg: "provide priceLessThan in numeric" })
            filterQuery['price'] = { $lt: priceLessThan }
        };
       
        if (isValid(name)) {
        filterQuery['title'] = { $regex: name, $options: "i" };  //i:small letter ,capital letter dono le sakta hai
        };

     
        if(priceSort){
            if (!((priceSort == 1) || (priceSort == -1))){
                return res.status(400).send({status : false, message : "Price sort only takes 1 or -1 as a value" })
            }

            let filterProduct = await productModel.find(filterQuery).sort({price: priceSort})
    
            if(filterProduct.length>0){
                return res.status(200).send({status : false, message : "Success", data : filterProduct})
            }
            else{
                return res.status(404).send({status : false, message : "No products found with this query"})
            }
        };
    

        const products = await productModel.find({ ...filterQuery }).sort({ price: 1 }) 

        if (!(products.length)) return res.status(404).send({ status: false, msg: 'Product not found' })
        return res.status(200).send({ status: true, msg: "Success", data: products })


    }
    catch(err)
    {
        console.log(err.message)
        res.status(500).send({status:false, Error:err.message})
    }
}

//-----------------------------------------------GET PRODUCT BY ID-------------------------------------------

const getProductById = async function(req,res){
    try
    {
        const paramsId = req.params.productId

        if(!isValidObjectId(paramsId)){
            return res.status(400).send({status:false, message:'Params Id is invalid'})
        }
    
        const product = await productModel.findById(paramsId)
    
        if(!product){
            return res.status(404).send({status:false, message:'Product not found'})
        }
    
        if(product.isDeleted){
            return res.status(400).send({status:false, message:'This Product is deleted'})
        }
    
        res.status(200).send({status:true, message:'Success', data:product})

    }
    catch(err)
    {
        console.log(err.message)
        res.status(500).send({status:false, Error:err.message})
    }

}

//---------------------------------------------UPDATE PRODUCT-------------------------------------------------

const updateProduct = async function(req,res)
{
    try
    {
        const paramsId = req.params.productId
        if (!mongoose.Types.ObjectId.isValid(paramsId)) {
            return res.status(400).send({ msg: "productId is invalid", status: false })
        }

        let findProduct = await productModel.findById(paramsId)

        if(!findProduct || findProduct.isDeleted){
            return res.status(404).send({status:false, message:'Product not Exist or maybe deleted'})
        }
        // res.status(200).send({status:false, message:'Success', data:findProduct})

        

        let requestBody = req.body

        if(!isValidRequestBody(requestBody)){
            return res.status(400).send({status:false, message:"Please enter atleast one key for updation"})
        }


        if(req.files.length){
            let files = req.files
            let uploadedFileURL = await aws.uploadFile(files[0])
            requestBody.productImage = uploadedFileURL
        }

      
       
        const {title, description, price, currencyId, currencyFormat, availableSizes} = requestBody

        if(title){
            if(!isValid(title)){
                return res.status(400).send({status:false, message:'Title is required'})
            }
            
            const isTitleAlreadyExist = await productModel.findOne({title})
            if(isTitleAlreadyExist){
                return res.status(400).send({status:false, message:'This Title is already Exist'})
            }
        }

        if(description){
            if(!isValid(description)){
                return res.status(400).send({status:false, message:'Description is required'})
            }
        }

        if(price){
            if(!isValid(price)){
                return res.status(400).send({status:false, message:'Price is required'})
            }
         
            if(!(/^\d{0,8}[.]?\d{1,4}$/.test(price))){
                return res.status(400).send({status:false, message:'Invalid price'})
            }
        }

        if(currencyId){
            if(!isValid(currencyId)){
                return res.status(400).send({status:false, message:'CurrencyId is required'})
            }
            
            if(currencyId !== "INR"){
                return res.status(400).send({status:false, message:'only accepted INR'})
            }           
        }

        if(currencyFormat){
            if(!isValid(currencyFormat)){
                return res.status(400).send({status:false, message:'CurrencyFormat is required'})
            } 
            
            if(currencyFormat !==  "₹"){
                return res.status(400).send({status:false, message:'Only accepted ₹ this currency symbol'})
            }
        }

        if(availableSizes){
            if(!isValid(availableSizes)){
                return res.status(400).send({status:false, message:'AvailableSizes is required'})
            }
            let array = availableSizes.split(",").map(x=>x.toUpperCase().trim())
            for(let i=0; i<array.length; i++){
                if(!(["S", "XS", "M", "X", "L", "XXL", "XL"].includes(array[i]))){
                    return res.status(400).send({status:false, message:'Sizes only available from ["S", "XS", "M", "X", "L", "XXL", "XL"]'})
                }
            }
            if(Array.isArray(array)){
            requestBody.availableSizes = array
            }         
        }
      

        let updateData = await productModel.findOneAndUpdate({_id:findProduct._id}, requestBody, {new:true})

        res.status(200).send({status:true, message:'Product Updated Successfully', data:updateData})


    }
    catch(err)
    {
        console.log(err.message)
        res.status(500).send({status:false, Error:err.message})
    }

}

//----------------------------------------------DELETE PRODUCT-----------------------------------------------

const deleteProduct = async function(req,res){

    const paramsId = req.params.productId

    if(!isValidObjectId(paramsId)){
        return res.status(400).send({status:false, message:'params id is not valid'})
    }

    const findProduct = await productModel.findById(paramsId)
    //const findProduct1 = await productModel.find( {_id:paramsId})
    //console.log(typeof (findProduct1))
    
    if(!findProduct){
        return res.status(404).send({status:false, message:'This prouct is not exist'})
    }

    if(findProduct.isDeleted){
        return res.status(400).send({status:false, message:'This product is already deleted'})
    }

    let deleteData = await productModel.findByIdAndUpdate({_id:paramsId}, {isDeleted:true, deletedAt:Date.now()}, {new:true})

    res.status(200).send({status:false, message:'Data deleted Successfully'})

}




module.exports={createProduct,getProductsByQuery, getProductById,updateProduct,deleteProduct}


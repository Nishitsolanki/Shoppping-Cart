const mongoose=require("mongoose")

isValid = (value) => {
    if (typeof value === "undefined" || typeof value === "null") return true;
    if (typeof value === "string" && value.trim().length === 0) return true;
    if (typeof value === "object" && Object.keys(value).length === 0) return true;
    return false;
  }
  
isValidBody = (reqBody) => {
    return Object.keys(reqBody).length === 0;
  }
  
isValidString = (String) => {
      return /\d/.test(String)
    }
    
isValidPhone = (Mobile) => {
      return /^[6-9]\d{9}$/.test(Mobile)
    };
    
isValidEmail = (Email) => {
      return  /^([A-Za-z0-9._]{3,}@[A-Za-z]{3,}[.]{1}[A-Za-z.]{2,6})+$/.test(Email)
    };
    
isValidPwd = (Password) => {
       return /^(?!.* )(?=.*[a-zA-Z]).{8,15}$/.test(Password)   
    }
    
isValidPincode = (num) => {
     return /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/.test(num);
    }
  
isValidObjectId = (objectId) => {
      return mongoose.Types.ObjectId.isValid(objectId);
    }
  
isValidPrice = (price) => {
      return /^[1-9]\d{0,7}(?:\.\d{1,2})?$/.test(price);
    }
    
isValidSize = (sizes) => {
      return ['S', 'XS', 'M', 'X', 'L', 'XXL', 'XL'].includes(sizes);
    }
anyObjectKeysEmpty = (value) =>{ 
    let obArr = Object.keys(value)
    let str = ''
    obArr.forEach(e=>{
        if(value.hasOwnProperty(e) && value[e].trim() == "") {
            str+=`${e} `
        }
    }) //hasOwnProperty() method to check whether an index exists
  
    str = str.trim()
    return str==""?false:str
  }
  
isvalidCity = function (city){
    return /^[a-zA-z',.\s-]{1,25}$/.test(city)
  }
  
  
isValidStatus = (status) => {
    return ['pending', 'completed', 'cancelled'].includes(status);
  }

  module.exports={isValid,isValidBody,isValidString,isValidPhone,isValidEmail,isValidPwd,isValidPincode,isValidObjectId,isValidPrice,isValidSize,anyObjectKeysEmpty,isvalidCity,isValidStatus}
const mongoose= require("mongoose")

  
 
  
  const isValidString = (String) => {
      return /\d/.test(String)
    }
    
    const isValidPhone = (Mobile) => {
      return /^[6-9]\d{9}$/.test(Mobile)
    };
    
    const isValidEmail = (Email) => {
      return  /^([A-Za-z0-9._]{3,}@[A-Za-z]{3,}[.]{1}[A-Za-z.]{2,6})+$/.test(Email)
    };
    
    const isValidPwd = (Password) => {
       return /^(?!.* )(?=.*[a-zA-Z]).{8,15}$/.test(Password)   
    }
    
    const isValidPincode = (num) => {
     return /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/.test(num);
    }
  
    const isValidObjectIdd = (objectId) => {
      return mongoose.Types.ObjectId.isValid(objectId);
    }
  
    const isValidPrice = (price) => {
      return /^[1-9]\d{0,7}(?:\.\d{1,2})?$/.test(price);
    }
    
    const isValidSize = (sizes) => {
      return ['S', 'XS', 'M', 'X', 'L', 'XXL', 'XL'].includes(sizes);
    }
    const anyObjectKeysEmpty = (value) =>{ 
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
  
const isvalidCity = function (city){
    return /^[a-zA-z',.\s-]{1,25}$/.test(city)
  }
  


  module.exports={isValidBody,isValidString,isValidPhone,isValidEmail,isValidPwd,isValidPincode,isValidObjectIdd,isValidPrice,isValidSize,anyObjectKeysEmpty,isvalidCity,isValidStatus}
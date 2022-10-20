const validator = require("email-validator");
const mongoose= require("mongoose")

const isValidd = (value) => {
    if (typeof value === "undefined" || typeof value === "null") return true;
    if (typeof value === "string" && value.trim().length === 0) return true;
    if (typeof value === "object" && Object.keys(value).length === 0) return true;
    return false;
  }



const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};


const isValidObjectIdd = (objectId) => {
    return mongoose.Types.ObjectId.isValid(objectId);
  }

const isValidBody = function (data) {
    return Object.keys(data).length > 0;
};


let alphabetTestOfString = function (value) {
    let regex = /^[a-zA-Z\\s]{2,10}$/;
    if (regex.test(value)) {
        return true;
    }
    return false;
};

const isValidSyntaxOfEmail = function (value) {
    if (validator.validate(value.trim())) {
        return true;
    }
    return false;
};

const isValidMobileNum = function (value) {
    let user = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(value)     ///^([6-9]\d{9})$/
    return user
};

const isValidPinCode = (value) => {
    const regEx =  /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/
    const result = regEx.test(value)
    return result
}

const isValidPassword = (password) => {
    if ( /^[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(password)) {
        return true
    }
}

const validateEmail = function (mail) {
    if (/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(mail)) {
        return true;
    }
}

const idMatch = function (value){
    let user = /^[0-9a-fA-F]{24}$/.test(value)
    return user
}

const onlyNumbers = function (value){
    let user = /^[0-9]+$/.test(value)
    return user
}

const isValidPrice = (value) => {
    const regEx = /^\d+(?:\.\d+)?(?:,\d+(?:\.\d+)?)*$/
    const result = regEx.test(value)
    return result
};

const cityRegex = function (value){
    let user = /^[a-zA-Z]+$/.test(value)
    return user
}

const streetRegex = function (value){
    let user =  /^[#.0-9a-zA-Z\s,-]+$/.test(value)
    return user
}

const validString = function(value) {
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidBodyy = (reqBody) => {
    return Object.keys(reqBody).length === 0;
  }

    
const isValidStatus = (status) => {
    return ['pending', 'completed', 'cancelled'].includes(status);
  }


module.exports = {isValidd , isValid, isValidObjectIdd,isValidBody, alphabetTestOfString, isValidSyntaxOfEmail, isValidMobileNum, isValidPinCode, isValidPassword, validateEmail, idMatch, onlyNumbers, isValidPrice, cityRegex, streetRegex, validString,isValidBodyy,isValidStatus}
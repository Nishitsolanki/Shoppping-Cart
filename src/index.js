const express=require('express')
const bodyParser = require('body-parser');
const { default: mongoose } = require('mongoose')
const multer = require ('multer');
const aws = require ('aws-sdk')
const route=require("./route/route")
const app= express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use (multer().any())

mongoose.connect("mongodb+srv://sumitnegi:7KtRrUCkTMIMREOm@cluster0.diszcfl.mongodb.net/group30Database?retryWrites=true&w=majority", {useNewUrlParser:true})
.then(()=> console.log("MongoDb is connected"))
.catch(err => console.log(err))

app.use('/',route)

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
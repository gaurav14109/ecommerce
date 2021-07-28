const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema //to keep relationship with other schema
const ProductSchema = new mongoose.Schema({

    name:{
        type: String,
        required: true,
        trim:true,
        maxlength:32
    },
    sold:{
        type: Number,
        default:0
    },
    description:{
        type: String,
        required:true,
        trim:true,
        maxLength:32
    },
    price:{
        type:Number,
        required:true,
        trim:true
    },
    category:{
        type:ObjectId, //to refrence other schema to get data
        ref:'Category',  
        required:true
    }, 
    quantity:{
        type:Number,
    },
    photo:{
        data:Buffer, //binary data of the image 
        contentType:String
    },
    shipping:{  
        required:false,
        type:Boolean,
    }

},{timestamps:true})

//a book can belong mulitple category
module.exports = mongoose.model('Product',ProductSchema)
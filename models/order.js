const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema;

const CartItemSchema = new mongoose.Schema({
    product: {
        type: ObjectId,
        ref: "Product" //product reference
    },
    name: String,
    price: Number,
    count: Number
}, {timestamps: true})

const CartItem  = mongoose.model('CartItem', CartItemSchema)

//crated a cartschema for products
const OrderSchema = new mongoose.Schema(
    {
      products: [CartItemSchema], //products we have to create a product schema is defined
      transaction_id: {},
      amount: { type: Number },
      address: String,
      status: {
        type: String,
        default: "Not processed",
        enum: ["Not processed", "Processing", "Shipped", "Delivered", "Cancelled"] // enum means string objects //fixed options
        //enum for fixed set string 
      },
      updated: Date,
      user: { type: ObjectId, ref: "User" } //refering to user model id of the user is the reference
    },
    { timestamps: true }
  );
  //admin can change the status or user
  const Order = mongoose.model("Order", OrderSchema);
  
  module.exports = { Order, CartItem };
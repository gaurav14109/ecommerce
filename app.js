const express = require('express')
const mongoose = require('mongoose')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const exressValidator = require('express-validator')
//to read cookie data
require('dotenv').config()
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const catergoryRoutes = require('./routes/category')
const productRoutes = require('./routes/product')
const braintreeRoutes = require('./routes/braintree')
const orderRoutes = require('./routes/order')
//we sending data from server to client or client it should be json string not json object and then convert it to string 
//if passing a object to server cconvert to string
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser:true,
    useCreateIndex:true
}).then(()=>{ 
    console.log('connected to database')
})

//middleware 
app.use(morgan('dev')) //for logs
app.use(bodyParser.json()) //for parsing properties fo req body object which is json data
app.use(cookieParser()) // for parsing cookie data send by client
app.use(exressValidator()) //for validation user input
app.use(cors())

//route middleware
app.use('/api',authRoutes); //we can give a prefix from where url should start 
app.use('/api',userRoutes); 
app.use('/api',catergoryRoutes); 
app.use('/api',productRoutes); 
app.use('/api',braintreeRoutes);
app.use('/api',orderRoutes);
const port = process.env.PORT|| 8000
//Execute app.js first

app.listen(port , ()=>{

    console.log(`Running on port ${port}`)
})

//import body-parser to parser data from req.body form data similarily url-encoded
//morgan to log user req

//using express validator or joi to validate user input
//req.body is used when there is a object sent in body of req i.e raw data 
//for get request  we use params

//npm i braintree

/*ADMIN Can manage Orders
Admin -product update
user-profile update
Deploy
*/
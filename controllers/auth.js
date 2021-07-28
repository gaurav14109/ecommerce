const User = require('../models/users')
const {errorHandler} = require('../helpers/dbErrorHandler') 
const jwt = require('jsonwebtoken')//to generate signed token
const expressJwt = require('express-jwt') //for authorization of token
exports.signup = (req,res)=>{

    console.log(req.body)
    const user  = new User(req.body)
    user.save((err, user)=>{

        if (err){
            return res.status(400).json({err:errorHandler(err)})
        }else{
                user.salt = undefined
                user.hashed_password = undefined
                res.json({user})
        }
    })
}   
exports.signin = (req,res)=>{
    //when signed in then set jet token with user details
    //once the user have signed send the jwt token token comprise of key and user payload that contains
    //user information
    const {email, password} = req.body
    console.log(email,password)
    User.findOne({email}, (err, user)=>{

        if (err || !user){
            return res.status(400).json({error:'User does not exists'})
        }
        if (!user.authenticate(password)){

            return res.status(401).json({error:'Invalid password'})

        }
        const token = jwt.sign({_id:user._id}, process.env.JWT_SECRET_KEY)
        //Once token is there set in header or set in cookie and sent it in cookie object to client
        res.cookie('t', token,  {expire:new Date() + 9999}) //till 9999 seconds cookie is for expiry

        const {_id, name, email, role} = user
        res.json({token, user:{_id, name, email, role}});
    })   
}

exports.signout = (req,res)=> {
    res.clearCookie('t')

    res.json({message:'Signout Success'})
}
//we can use jwt verfiy also, this will automatically search for header receive from client
exports.requireSignin =  expressJwt({ //will check the JWT token in Authoriztion property of header
    secret:process.env.JWT_SECRET_KEY,
    algorithms: ["HS256"], //used for creating token
    userProperty:'auth' //this is proprty that store current logged in user details auth have token data or 
    //jwt.verify it have _id it store payload set auth property in the req
})


exports.isAuth = (req, res,next)=>{
    //authentication current user
    console.log(req.auth)//the id set in the token this decrypted by sutorization header currently logged in user
    console.log(req.profile)
    const user = req.profile && req.auth && req.profile._id == req.auth._id //check if profile id and auth id are same
    //req.auth is the property of jwt
    if (!user){
        return res.status(403).json({error:'Access denied not allowed to view other user'}) //only allowed to view logged in user
    }
    next();
}
exports.isAdmin = (req, res,next)=>{
    //authentication of admin
    if (req.profile.role == 0){
        return res.status(403).json({error:'Admin resource'})
    }

    next(); 
}

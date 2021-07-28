const express = require('express');
const router = express.Router();
const {userById, read,update,listPurchaseHistroy} = require('../controllers/user')
const {requireSignin, isAuth, isAdmin} = require('../controllers/auth');


//userId will go to params
router.get('/secret/:userId',requireSignin,isAuth, isAdmin,(req, res)=>{ //when clicked on profile

    res.json({user:req.profile})

}
)

router.get('/user/:userId',requireSignin,isAuth, read)
router.put('/user/:userId',requireSignin,isAuth, update) //will be in req.body will be a json data of the form in son form from client.
router.get('/orders/by/user/:userId',requireSignin,isAuth, listPurchaseHistroy) 
router.param('userId', userById) 
//any there is a userId in route parameter userById method will be called can make it available to req object
//when ever there is userId function will be called

module.exports = router


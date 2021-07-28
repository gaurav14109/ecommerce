const express = require('express');
const router = express.Router();
const {signup,signin, signout,requireSignin} = require('../controllers/auth')
const {userSignValidator} = require('../validator/index')

router.get('/',requireSignin,(req, res) => {

    res.send('Hi')

});
//if all fine will move to next()
//using JWT we can protect some of the particular routes
router.post('/signup',userSignValidator,signup);
router.post('/signin',signin);
router.get('/signout',signout);

module.exports = router


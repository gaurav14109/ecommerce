const express = require('express');
const router = express.Router();
const {requireSignin, isAuth, isAdmin} = require('../controllers/auth')
const {userById} = require('../controllers/user')

const {create, productById, read, remove, update, list,listRelated, listCategories, listBySearch , photo,listSearch} = require('../controllers/product')

//getting products based on sold and arrivals

router.get('/products', list) //other can have url parameters like order by, limit, sort ascor desc
router.get("/products/search", listSearch);
router.get('/products/related/:productId', listRelated) 
router.get('/products/categories', listCategories) 
router.post("/products/by/search", listBySearch);
router.get('/product/:productId', read) 
router.get('/product/photo/:productId', photo)
router.post('/product/create/:userId',requireSignin, isAuth, isAdmin, create)
router.delete('/product/:productId/:userId',requireSignin, isAuth, isAdmin, remove) //delete function will be called last time
router.put('/product/:productId/:userId',requireSignin, isAuth, isAdmin, update) 
//after all the authentication

//get will be params or id
//post, put  will be form data, request body


router.param('userId', userById)//first this will be executed param which will the user profile in req. this is to handle single id
router.param('productId', productById) //params will come here // to get the product in req packet //pass to next function

module.exports = router

//search by prooducts req will be in a body to access request we have to use post method
//when raw json data then req.body 
//if in url then req.params or query 
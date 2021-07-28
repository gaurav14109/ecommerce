const express = require('express');
const router = express.Router();
const {requireSignin, isAuth, isAdmin} = require('../controllers/auth')
const {userById} = require('../controllers/user')

const {create,catergoryById, update,read, remove, list} = require('../controllers/category')


router.get('/category', list)
router.get('/category/:categoryId', read)
router.post('/category/create/:userId',requireSignin, isAuth, isAdmin, create)
router.put('/category/:categoryId/:userId', requireSignin, isAuth, isAdmin, update)
router.delete('/category/:categoryId/:userId', requireSignin, isAuth, isAdmin, remove)
router.param('categoryId', catergoryById)
router.param('userId', userById)//first this will be executed param which will the user profile in req.


module.exports = router
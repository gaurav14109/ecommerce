const express = require('express');
const router = express.Router();
const {requireSignin, isAuth, isAdmin} = require('../controllers/auth')
const {userById, addOrderToUserHistory} = require('../controllers/user')
const {create,listOrders, getStatusValues,orderById,updateOrderStatus} = require('../controllers/order')
const {decreaseQuantity} = require('../controllers/product')

router.post('/order/create/:userId',requireSignin, isAuth,addOrderToUserHistory,decreaseQuantity, create)
router.put('/order/:orderId/status/:userId',requireSignin, isAuth,updateOrderStatus)
router.get('/order/list/:userId',requireSignin, isAuth,isAdmin, listOrders)
router.get('/order/status-values/:userId',requireSignin, isAuth,isAdmin, getStatusValues)
//when order history link is clicked it should a api
//api should show all the purchase history
router.param('userId', userById) 
router.param('orderId', orderById) 

module.exports = router
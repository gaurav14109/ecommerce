const User = require('../models/users')
const {Order, CartItem} = require('../models/order')
// id will be received by route.params method
exports.userById = (req, res, next, id) => {
    //execute the call back function
    User
        .findById(id)
        .exec((err, user) => {
            if (err || !user) {

                res
                    .status('400')
                    .json({message: 'User not found'})
            }

            req.profile = user //creating a property profile  setting user
            next(); //move to next middleware or function
        })

}

exports.read = (req, res) => {

    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    req.profile.history = undefined
    req.profile.updatedAt = undefined
    req.profile.__v = undefined
    return res.json(req.profile)
}

exports.update = (req, res) => {

    User.findOneAndUpdate({
        _id: req.profile._id
    }, {
        $set: req.body
    }, {
        new: true
    }, (err, user) => {

        if (err) {

            return res
                .status(400)
                .json({error: 'Not Authorized'})
        }
        req.profile.hashed_password = undefined
        req.profile.salt = undefined 
        req.profile.history = undefined
        req.profile.updatedAt = undefined
        req.profile.__v = undefined
        res.json(user)
    })

}

exports.addOrderToUserHistory = (req, res, next) => {

    let history = []

    req
        .body
        .order
        .products
        .forEach((item) => {

            history.push({
                _id: item._id,
                name: item.name,
                description: item.description,
                category: item.category,
                quantity: item.count,
                transaction_id: req.body.order.transaction_id,
                amount: req.body.order.amount

            })

        })

    User.findByIdAndUpdate({
        _id: req.profile._id
    }, {
        $push: {
            history: history //crate a second object for update
        }
    }, {
        new: true
    }, (err, data) => {

        if (err) {
            res
                .status(400)
                .json({error: 'Could not update purchase history'}) //updating products to history
        }
        next();
    })

}

exports.listPurchaseHistroy = (req, res)=>{

    Order.find({user:req.profile._id}).populate('user', '_id name')
    .sort('-createdAt')
    .exec((err, orders)=>{
        if (err){

            return res.status(400).json({error:'Not data present'})
        }else{

            res.json(orders)
        }

    })

}
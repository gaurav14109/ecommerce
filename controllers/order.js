const {Order, CartItem} = require('../models/order')
const {errorHandler} = require('../helpers/dbErrorHandler')

exports.orderById = (req, res, next, id) => {
    //execute the call back function
    Order
        .findById(id)
        .populate('products.product', 'name price')
        .exec((err, order) => {
            if (err || !order) {

                res
                    .status('400')
                    .json({message: 'User not found'})
            }

            req.order = order //creating a property profile  setting user
            next(); //move to next middleware or function
        })

}

exports.create = (req, res) => {

    req.body.order.user = req.profile
    const order = new Order(req.body.order)
    order.save((err, data) => {

        if (err) {
            return res
                .status(400)
                .json({error: errorHandler(err)})
        }

        res.json(data)
    })

}
exports.listOrders = (req, res) => {
    //user is field name
    Order
        .find()
        .populate('user', '_id name address',)
        .sort('-createdAt')
        .exec((err, orders) => {

            if (err) {
                return res
                    .status(400)
                    .json({error: errorHandler(err)})
            }
            res.json(orders)
        })

}

exports.getStatusValues = (req, res) => {

    res.json(Order.schema.path('status').enumValues)

}

exports.updateOrderStatus = (req, res) => {

    Order.update({
        _id: req.body.orderId
    }, {
        $set: {
            status: req.body.status
        }
    }, (err, order) => {
        if (err) {
            return res
                .status(400)
                .json({error: errorHandler(err)})
        }
        res.json(order)

    })

}
// Order Created {     order: {       products: [ [Object], [Object] ], amount:
// '41.00',       address: 'kamothe'     }   }
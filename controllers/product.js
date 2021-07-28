const Product = require('../models/product')
const formidable = require('formidable')
const fs = require('fs')
const _ = require('lodash') //provide method to handle data.
const {errorHandler} = require('../helpers/dbErrorHandler')

exports.productById = (req, res, next, id) => {
    //instead of callback can use await or execute
    Product
        .findById(id)
        .populate('category')
        .exec((err, product) => {

            if (err || !product) {

                return res
                    .status(400)
                    .json({error: 'No Such Product'})
            }
            req.product = product //store in the req object and move to next middleware i.e read

            next();

        })
}

exports.read = (req, res) => {

    req.product.photo = undefined;

    return res.json(req.product)
}

exports.create = (req, res) => {
    //for the form data

    const form = new formidable.IncomingForm() //get incoming form data directly incoming form data
    form.keepExtensions = true //keep extension of file
    form.parse(req, (err, fields, files) => {

        if (err) {

            return res
                .status(400)
                .json({error: 'Image could not be uploaded'})
        }
        //fields is the name in the form
        const {
            name,
            description,
            price,
            category,
            quantity,
            shipping
        } = fields

        if (!name || !description || !price || !category || !quantity || !shipping) {
            console.log('hi')
            return res
                .status(400)
                .json({error: 'All Fields are required'})
        }
        let product = new Product(fields)
        // console.log(files.photo.name, 'files object') .photo is the field name
        if (files.photo) {
            if (files.photo.size > 1000000) {
                console.log('hi')
                return res
                    .status(400)
                    .json({error: 'file size cannot be more than 1mb'})
            }
            product.photo.data = fs.readFileSync(files.photo.path) //read a file path of the photo from sender
            product.photo.contentType = files.photo.type
        }

        product.save((err, data) => {
            if (err) {
                console.log(err)
                return res
                    .status(400)
                    .json({error: 'Internal server error'})
            }
            res.json(data)
        })

    })
}
//since we pass data to server it should be json string
exports.remove = (req, res) => {

    let product = req
        .product
        product
        .remove((err, product) => {

            if (err || !product) {

                return res
                    .status(400)
                    .json({error: 'No Product to delete'}) //only admin can do it
            }
            res.json({deleteProduct: product, message: 'Product Deleted'})
        })
}

exports.update = (req, res) => {
    console.log('Hello')
    const form = new formidable.IncomingForm() //using formData

    form.keepExtensions = true
    //we parse the req and get fields file form the request
    form.parse(req, (err, fields, files) => {

        if (err) {

            return res
                .status(400)
                .json({error: 'image could not be uploaded'})
        }
        // const {
        //     name,
        //     description,
        //     price,
        //     category,
        //     quantity,
        //     shipping
        // } = fields

        // if (!name || !description || !price || !category || !quantity || !shipping) {

        //     return res
        //         .status(400)
        //         .json({error: 'All Fields are required'})
        // }
        let product = req.product
        product = _.extend(product, fields) //extend product we need to change value

        if (files.photo) {
            if (files.photo.size > 1000000) {

                return res
                    .status(400)
                    .json({error: 'file size cannot be more than 1mb'})
            }
            product.photo.data = fs.readFileSync(files.photo.path) //read a file path of the photo from sender
            product.photo.contentType = files.photo.type
        }

        product.save((err, data) => {

            res.json(data)
        })

    })
}

exports.list = (req, res) => {

    const orderBy = req.query.order
        ? req.query.order
        : 'asc'
    const sortBy = req.query.sort
        ? req.query.sort
        : '_id'

    const limit = req.query.limit
        ? parseInt(req.query.limit)
        : 6

    // params looks like for multiple using & /products?orderBy=desc&... query
    // parameters
    Product
        .find()
        .select('-photo')
        .populate('category')
        .sort([
            [sortBy, orderBy]
        ])
        //deleect photo
        .limit(limit)
        .exec((err, data) => {

            if (err) {

                return res
                    .status(400)
                    .json({error: 'Products not found'})
            }

            res.json(data)
        })
    //-photo means deselect photo
}

exports.listRelated = (req, res) => {

    //to get single or array we use params to send req in body i.e object is post
    const limit = req.query.limit
        ? parseInt(req.query.limit)
        : 6
    Product
        .find({
            _id: {
                $ne: req.product
            },
            category: req.product.category
        })
        .select('-photo') //showing
        //ne : product not including the actual product
        .limit(limit)
        .populate('category', '_id name') //populate id and name i.e relationship column
        .exec((err, data) => {

            res.json(data)

        })
}

exports.listCategories = (req, res) => {

    Product.distinct('category', {}, (err, categories) => {

        res.json(categories)
    })
}
// form data will be sent for product to handle file in form we can use
// formidable or multer load provide useful method

exports.listBySearch = (req, res) => {
    let order = req.body.order
        ? req.body.order
        : "desc";
    let sortBy = req.body.sortBy
        ? req.body.sortBy
        : "_id";
    let limit = req.body.limit
        ? parseInt(req.body.limit)
        : 100;
    let skip = parseInt(req.body.skip); //skip the list
    let findArgs = {}; //for all the arguments in filter
    console.log(req.body)
    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);

    for (let key in req.body.filters) { //filter object
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10] lte - less than
                findArgs[key] = {
                    $gte: req
                        .body
                        .filters[key][0], //greater than index 0 price or less than index 1 price
                    $lte: req
                        .body
                        .filters[key][1]
                };
            } else {
                findArgs[key] = req
                    .body
                    .filters[key]; //if no price
            }
        }
    }

    Product
        .find(findArgs)
        .select("-photo") //deselect photo
        .populate("category")
        .sort([
            [sortBy, order]
        ])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res
                    .status(400)
                    .json({error: "Products not found"});
            }
            res.json({size: data.length, data});
        });
};

exports.photo = (req, res, next) => {
    //for fetching the photos

    if (req.product.photo.data) {

        res.set('Content-type', req.product.photo.contentType)

        return res.send(req.product.photo.data)
    }
    next() // to handle  /favicon.ico
}

exports.listSearch = (req, res) => {
    //params means single else query for multiple
    const query = {}

    if (req.query.search) {
        query.name = {
            $regex: req.query.search,
            $options: 'i'
        } //does not see small case capital letter.

        if (req.query.category && (req.query.category != 'All')) {
            query.category = req.query.category
        }
    }

    Product
        .find(query, (err, products) => {
            if (err) {
                return res
                    .status(400)
                    .json({error: 'Not found'})
            } else {
                res.json(products)
            }
        })
        .select('-photo')

    //-photo means deselect photo
}

exports.decreaseQuantity = (req, res, next) => {

    let bulkOps = req
        .body
        .order
        .products
        .map((item) => {

            return {

                updateOne: {
                    filter: { //filter by id
                        _id: item._id
                    },
                    update: {
                        $inc: {
                            quantity: -item.count,
                            sold: +item.count
                        }
                    }
                }
            }
        }) //array of updates
        // [
        //     { updateOne: { filter: [Object], update: [Object] } }, //bulk update
        //     { updateOne: { filter: [Object], update: [Object] } }
        // ]

    console.log(bulkOps) //array of individual product id with upload
    Product.bulkWrite(bulkOps, (err, data) => {

        if (err) {
            res
                .status(400)
                .json({error: 'Error while updating count'})
        }
        next()
    })

}

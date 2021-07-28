const Category = require('../models/Category')
const {errorHandler} = require('../helpers/dbErrorHandler') 

exports.catergoryById = (req, res, next, id)=>{

        Category.findById(id).exec((err, category)=>{

            if (err || !category){
                return res.status(400).json({error:'No Such Product'})
            }

            req.category = category
            next()
    })
}

exports.create = (req, res)=>{

    const category = new Category(req.body)
    category.save((err, data)=>{

        if (err || !data){

            return res.status(400).json({error:errorHandler(err)})  //return means function is over do not excute further
        }

        res.json({data})
    })
}

exports.read = (req, res)=>{

    return res.json(req.category)

}

exports.update = (req, res)=>{
    let category = req.category
    category.name = req.body.name
    //req.body is usede when there is a object sent in body of
    //get we use params
    category.save((err, data)=>{
        res.json(data)
    })

}

exports.remove = (req, res)=>{
    let category = req.category

    category.remove((err, category)=>{

            res.json({
                category:category,
                message:'Category deleted'
            })
    })
}

exports.list = (req, res)=>{
    //we can use callback function
    Category.find().exec((err, data)=>{

        
        res.json(data)
    })
}
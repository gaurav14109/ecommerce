exports.userSignValidator = (req,res, next)=>{

    req.check('name','Name is required').notEmpty()
    req.check('email','email must be between 3 and 32 characters').matches(/.+\@.+\..+/).withMessage('Email must contain @')
    .isLength({
        min:4,
        max:32
    })

    req.check('password','password is required').notEmpty() //should not be empty
    req.check('password').isLength({min:6}).withMessage('Password should be more than 6 characters')
    .matches(/\d/) //should be a digit
    .withMessage('Password must contain a number')
    //should be in a sequence


    const errors = req.validationErrors()

    if (errors){
        
        const firstError = errors.map(error=>error.msg)[0]//taking first error only send one error
        return res.status(400).json({error:firstError})
    }

    next()

}
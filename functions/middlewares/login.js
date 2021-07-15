const validator = require('validator');

exports.loginMiddleWare = (req, res, next)=>{
    const email = validator.trim(req.body.email)
    const errors = {}
    let error
    if(!validator.isEmail(email)){
        errors.email = 'Invalid email'
        // return res.status(400).json({message: 'Invalid email'})
    }

    if(Object.keys(errors).length > 0){
        error = new Error(errors)
        error.statusCode = 400
        throw error
    }
    return next()
}
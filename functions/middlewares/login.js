const validator = require('validator');

exports.loginMiddleWare = (req, res, next)=>{
    const email = validator.trim(req.body.email)
    const errors = {}
    if(!validator.isEmail(email)){
        errors.email = 'Invalid email'
        // return res.status(400).json({message: 'Invalid email'})
    }

    if(Object.keys(errors).length > 0){
        return res.status(400).json({errors})
    }
    return next()
}
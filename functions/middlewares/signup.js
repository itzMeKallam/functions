const validator = require('validator');

exports.signupMiddleWare = (req, res, next)=>{
    const email = validator.trim(req.body.email)
    const handle = validator.trim(req.body.handle)
    const password = req.body.password
    const confirmPassword = req.body.confirmPassword
    const errors = {}
    if(!validator.isEmail(email)){
        errors.email = 'Invalid email'
        // return res.status(400).json({message: 'Invalid email'})
    }

    if(validator.isEmpty(handle)){
        errors.handle = "Handle can`t be empty"
        // return res.status(400).json({message: 'Handle can"t be empty'})
    }

    if(password !== confirmPassword){
        errors.password = "passwords haven't matched"
        // return res.status(400).json({message: 'passwords haven"t matched'})
    }

    if(Object.keys(errors).length > 0){
        return res.status(400).json({errors})
    }

    req.body.email = email
    req.body.handle = handle
    return next()
}
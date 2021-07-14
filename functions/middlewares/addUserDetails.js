const validator = require('validator')
exports.addUserDetailsMW=(req,res,next)=>{
    let userDetails = {}
    if(!validator.isEmpty(validator.trim(req.body.bio))) userDetails.bio = req.body.bio
    if(!validator.isEmpty(validator.trim(req.body.website))) {
        if(validator.trim(req.body.website).substring(0,4 !== 'http')){
            userDetails.website = `http://${validator.trim(req.body.website)}`
        } else userDetails.website = validator.trim(req.body.website)
    }
    if(!validator.isEmpty(validator.trim(req.body.location))) userDetails.location = req.body.location
    req.userDetails = userDetails
    next()
}
const {firebase, firebaseConfig, db} = require('../util/firebase')

exports.addUserDetails=(req,res, next)=>{
    return db.doc(`/users/${req.user.handle}`).update(req.userDetails).then(()=>{
        return res.status(200).json({message: 'Details added successfully'})
    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode=500
        }
        next(err)
    })

}

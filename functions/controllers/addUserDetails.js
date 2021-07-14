const {firebase, firebaseConfig, db} = require('../util/firebase')

exports.addUserDetails=(req,res)=>{
    db.doc(`/users/${req.user.handle}`).update(req.userDetails).then(()=>{
        return res.json({message: 'Details added successfully'})
    })
    .catch(error=>{
        console.error(error)
        return res.status(500).json({error: error.code})
    })

}

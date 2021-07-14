const {firebase, firebaseConfig, db} = require('../util/firebase')

exports.getUserDetails=(req,res)=>{
    let userData = {}
    db.doc(`/users/${req.user.handle}`).get()
    .then(doc=>{
        if(doc.exists){
            userData.credentials = doc.data()
            return db.collection('likes').where('userHandle', '==', req.user.handle).get()
        }
    }).then(data=>{
        userData.likes = []
        data.forEach(doc=>{
            userData.likes.push(doc.data())
        })
        return res.json(userData)
    }).catch(error=>{
        console.error(error)
        return res.status(500).json({error: error.code})
    })
}
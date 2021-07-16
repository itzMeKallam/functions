const {firebase, firebaseConfig, db} = require('../util/firebase')

exports.getUserDetail=(req,res,next)=>{
    let userData= {}
    let error
    db.doc(`/users/${req.params.handle}`).get()
    .then(doc=>{
        if(doc.exists){
            userData.user = doc.data()
            console.log('check1')
            return db.collection('screams').where('userHandle', '==', req.params.handle)
            .orderBy('createdAt', 'desc').get()
        }
        error = new Error('User not found')
        error.statusCode = 400
        throw error
    }).then(screams=>{
        userData.screams = []
        screams.forEach(scream=>{
            userData.screams.push({
                ...scream.data(),
                screamId: scream.id
            })
        })
        return res.status(200).json(userData)

    }).catch(err=>{
        if(!err.statusCode){
            err.statusCode=500
        }
        next(err)
        })
}
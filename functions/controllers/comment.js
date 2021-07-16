const {firebase, firebaseConfig, db} = require('../util/firebase')

exports.comment=(req,res, next)=>{
    let error
    if(req.body.body.trim()=== ''){
        error = new Error('Comment must not be empty')
        error.statusCode = 400
        throw error
    }
    const newComment = {
        body: req.body.body,
        screamId: req.params.screamId,
        createdAt : new Date().toISOString(),
        userHandle : req.user.handle,
        avatar: req.user.avatar
    }
    return db.doc(`/screams/${req.params.screamId}`).get()
    .then(doc=>{
        if(!doc.exists){
            error = new Error('scream not found')
            error.statusCode = 404
            throw error
        }
        return doc.ref.update({commentCount: doc.data().commentCount + 1 })
    }).then(()=>{
        return db.collection('comments').add(newComment)
    }).then(()=>{
        return res.status(201).json({newComment})
    }).catch(err=>{
        if(!err.statusCode){
            err.statusCode=500
        }
        next(err)
    })
}
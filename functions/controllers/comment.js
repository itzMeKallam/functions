const {firebase, firebaseConfig, db} = require('../util/firebase')

exports.comment=(req,res)=>{
    const newComment = {
        body: req.body.body,
        screamId: req.params.screamId,
        createdAt : new Date().toISOString(),
        userHandle : req.user.handle,
        avatar: req.user.avatar
    }
    db.doc(`/screams/${req.params.screamId}`).get()
    .then(doc=>{
        if(!doc.exists){
            return res.status(404).json({error: 'scream not found'})
        }
        return doc.ref.update({commentCount: doc.data().commentCount + 1 })
    }).then(()=>{
        return db.collection('comments').add(newComment)
    }).then(()=>{
        return res.status(201).json({newComment})
    }).catch(error=>{
        console.log(error)
        res.status(500).json({error: 'something went wrong'})
    })
}
const {db} = require('../util/firebase')
exports.scream =(req, res, next)=>{

    const newScream = {
        body: req.body.body,
        userHandle: req.user.handle,
        createdAt: new Date().toISOString(),
        avatar: req.user.avatar,
        likeCount: 0,
        commentCount: 0
    }
    db.collection('screams').add(newScream)
    .then(data=>{
        const resScream = newScream
        resScream.screamId = data.id
        return res.status(201).json({resScream})
    }).catch(err=>{
        if(!err.statusCode){
            err.statusCode=500
        }
        next(err)
        })
}
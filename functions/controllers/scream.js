const {db} = require('../util/firebase')
exports.scream =(req, res)=>{

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
        return res.json({resScream})
    }).catch(error=> {
        res.status(500).json({error: 'something went wrong'})
        console.error(error)
    })
}
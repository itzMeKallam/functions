const {db} = require('../util/firebase')

exports.getLike =(req, res, next)=>{
    const likeDocument = db.collection('likes').where("userHandle", "==", req.user.handle)
    .where("screamId", "==", req.params.screamId).limit(1)
    const screamDocument = db.doc(`/screams/${req.params.screamId}`)
    let screamData, error
    return screamDocument.get().then(doc=>{
        if(!doc.exists){
            const error = new Error('scream not found')
            error.statusCode = 422
            throw error
        }
        screamData = doc.data()
        screamData.screamId = doc.id
        return likeDocument.get()        
    }).then(data=>{
        if(!data.empty){
            error = new Error('scream already liked')
            error.statusCode = 422
            throw error
        }
        return db.collection('likes').add({
                screamId: req.params.screamId,
                userHandle: req.user.handle
            })
    }).then(()=>{
                screamData.likeCount++
                return screamDocument.update({likeCount: screamData.likeCount})
            }).then(()=>{
                return res.status(201).json(screamData)
            }).catch(err=>{
                if(!err.statusCode){
                    err.statusCode=500
                }
                next(err)
                })
}
const {db} = require('../util/firebase')

exports.getUnlike =(req, res, next)=>{
const likeDocument = db.collection('likes').where("userHandle", "==", req.user.handle)
    .where("screamId", "==", req.params.screamId).limit(1)
    const screamDocument = db.doc(`/screams/${req.params.screamId}`)
    let screamData, error
    screamDocument.get().then(doc=>{
        if(!doc.exists){
            error = new Error('scream not found')
            error.statusCode = 404
            throw error
        }
        screamData = doc.data()
        screamData.screamId = doc.id
        return likeDocument.get()
    }).then(data=>{
        if(data.empty){
            error = new Error('scream was not exist')
            error.statusCode = 400
            throw error
        }
        return db.doc(`/likes/${data.docs[0].id}`).delete()

    }).then(()=>{
        screamData.likeCount--
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
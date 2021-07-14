const {db} = require('../util/firebase')

exports.getUnlike =(req, res)=>{
const likeDocument = db.collection('likes').where("userHandle", "==", req.user.handle)
    .where("screamId", "==", req.params.screamId).limit(1)
    const screamDocument = db.doc(`/screams/${req.params.screamId}`)
    let screamData
    screamDocument.get().then(doc=>{
        if(doc.exists){
            screamData = doc.data()
            screamData.screamId = doc.id
            return likeDocument.get()
        }
        return res.status(404).json({error: 'scream not found'})
    }).then(data=>{
        if(data.empty){
            return res.status(400).json({error: 'scream already liked'})
        }
        return db.doc(`/likes/${data.docs[0].id}`).delete()

    }).then(()=>{
                screamData.likeCount--
                return screamDocument.update({likeCount: screamData.likeCount})
            }).then(()=>{
                return res.status(201).json(screamData)
            }).catch(error=>{
        console.error(error.code)
        return res.status(500).json({error: error.code})
    })
}
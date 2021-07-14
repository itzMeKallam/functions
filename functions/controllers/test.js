const {db} = require('../util/firebase')

exports.getLike =(req, res)=>{
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
            return db.collection('likes').add({
                screamId: req.params.screamId,
                userHandle: req.user.handle
            })
        }
    }).catch(error=>{

    })
}
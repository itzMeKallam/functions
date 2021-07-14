const {db} = require('../util/firebase')

exports.getLike =(req, res)=>{
    const likeDocument = db.collection('likes').where("userHandle", "==", req.user.handle)
    .where("screamId", "==", req.params.screamId).limit(1)
    const screamDocument = db.doc(`/screams/${req.params.screamId}`)
    let screamData
    return screamDocument.get().then(doc=>{
        if(doc.exists){
            screamData = doc.data()
            screamData.screamId = doc.id
            return likeDocument.get()
        }
        // return res.status(404).json({error: 'scream not found'})
        return promise.reject({error: 'scream not found'})
    }).then(data=>{
        if(!data.empty){
            console.log("check1")
            return res.status(400).json({error: 'scream already liked'})
            return promise.reject({error: 'scream already liked'})

        }
            console.log("check2")
        return db.collection('likes').add({
                screamId: req.params.screamId,
                userHandle: req.user.handle
            })
    }).then(()=>{
            console.log("check3")
                screamData.likeCount++
                return screamDocument.update({likeCount: screamData.likeCount})
            }).then(()=>{
            console.log("check4")
                return res.status(201).json(screamData)
            }).catch(error=>{
            console.log("check5")
        console.error(error.code)
        return res.status(500).json({error: error.code})
    })
}
const {db} = require('../util/firebase')
exports.getScream =(req, res)=>{
    let screamData ={}
    // console.log(req.params.screamId)
    db.doc(`/screams/${req.params.screamId}`).get()
    .then(doc=>{
    // res.status(200).json({param: req.params.screamId})
        if(!doc.exists){
            return res.status(404).json({error: 'Scream not found'})
        }

        screamData = doc.data()
        screamData.screamID = doc.id
        return db.collection('comments').orderBy('createdAt', 'desc').where('screamId', '==', doc.id).get()
    }).then(data=>{
        screamData.comments = []
        data.forEach(doc=>{
            screamData.comments.push(doc.data())
        })
        res.status(200).json(screamData)
    })
    .catch(error=>{
        console.error(error)
        res.status(500).json({message: error.code})
    })
}
const {db} = require('../util/firebase')
exports.getScream =(req, res,next)=>{
    let error
    let screamData ={}
    return db.doc(`/screams/${req.params.screamId}`).get()
    .then(doc=>{
        if(!doc.exists){
            error = new Error('scream not found')
            error.statusCode = 404
            throw error
        }

        screamData = doc.data()
        screamData.screamID = doc.id
        return db.collection('comments').orderBy('createdAt', 'desc').where('screamId', '==', doc.id).get()
    }).then(data=>{
        screamData.comments = []
        data.forEach(doc=>{
            screamData.comments.push(doc.data())
        })
        return res.status(200).json(screamData)
    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode=500
        }
        next(err)
        })
}
const {db} = require('../util/firebase')
exports.screams =(req,res,next)=>{
    db.collection('screams').orderBy('createdAt','desc').get()
    .then(data=>{
        let screams = []
        data.forEach(doc=>{
            screams.push({
                screamId: doc.id,
                body: doc.data().body,
                userHandle: doc.data().userHandle,
                createdAt: doc.data().createdAt
            })
        })
        return res.status(200).json(screams)
    }).catch(err=>{
        if(!err.statusCode){
            err.statusCode=500
        }
        next(err)
        })
}
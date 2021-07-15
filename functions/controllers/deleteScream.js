const {db} = require('../util/firebase')

exports.deleteScream =(req, res,next)=>{
    let error
    const document = db.doc(`/screams/${req.params.screamId}`)
    return document.get().then((doc)=>{
        if(!doc.exists){
            error = new Error('document was not found')
            error.statusCode = 404
            throw error
        }
        if(doc.data().userHandle !== req.user.handle){
            error = new Error('unauthoraised')
            error.statusCode = 403
            throw error
        }
        return document.delete()
    }).then(()=>{
        return res.status(202).json({message: 'scream deleted sucessfully'})
    }).catch(err=>{
        if(!err.statusCode){
            err.statusCode=500
        }
        next(err)
        })
}
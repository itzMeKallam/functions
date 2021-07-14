const {db} = require('../util/firebase')

exports.deleteScream =(req, res)=>{
    const document = db.doc(`/screams/${req.params.screamId}`)
    document.get().then((doc)=>{
        if(!doc.exists){
            res.status(404).json({error: 'document wasnt found'})
        }
        if(doc.data().userHandle !== req.user.handle){
            return res.status(403).json({error: "unauthoraised"})
        }
        document.delete()
    }).then(()=>{
        res.status(202).json({message: 'scream deleted sucessfully'})
    }).catch(error=>{
        res.status(500).json({error: error.code})
    })
}
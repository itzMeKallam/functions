const {db} = require('../util/firebase')
exports.screams =(req,res)=>{
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
        return res.json(screams)
    }).catch(error=> {
        res.status(500).json({error: 'something went wrong'})
        console.error(error)
    })
}
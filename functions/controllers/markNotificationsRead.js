const {firebase, firebaseConfig, db} = require('../util/firebase')

exports.markNotificationsRead=(req,res, next)=>{
    let batch = db.batch()
    const response = []
    req.body.forEach((notificationId)=>{
        console.log(notificationId)
        response.push(notificationId)
        const notification = db.doc(`/notifications/${notificationId}`)
        batch.update(notification, {read: true})
    })
    batch.commit().then(()=>{
        return res.status(200).json({message: 'notifications marked read'})
    }).catch(err=>{
        if(!err.statusCode){
            err.statusCode=500
        }
        next(err)
        })
}
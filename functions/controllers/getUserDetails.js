const {firebase, firebaseConfig, db} = require('../util/firebase')

exports.getUserDetails=(req,res,next)=>{
    let error
    let userData = {}
    db.doc(`/users/${req.user.handle}`).get()
    .then(doc=>{
        if(!doc.exists){
            error = new Error('user not found')
            error.statusCode = 404
            throw error
        }
        userData.credentials = doc.data()
        return db.collection('likes').where('userHandle', '==', req.user.handle).get()
    }).then(data=>{
        userData.likes = []
        data.forEach(doc=>{
            userData.likes.push(doc.data())
        })
        return db.collection('notifications').where('recipient', '==', req.user.handle)
        .orderBy('createdAt', 'desc').limit(10).get()
    }).then(data=>{
        console.log('data')
        console.log(data)
        userData.notifications = []
        data.forEach(doc=>{
            userData.notifications.push({
                ...doc.data(),
                notificationId: doc.id
            })
        })
        return res.status(200).json(userData)
    }).catch(err=>{
        if(!err.statusCode){
            err.statusCode=500
        }
        next(err)
        })
}
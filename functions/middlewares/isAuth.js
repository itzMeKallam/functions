const admin = require('firebase-admin')
const db = admin.firestore()
exports.Auth=(req, res, next)=>{
    let error
    const authHeader = req.get('Authorization')
    if(!authHeader){
        error = new Error('UnAuthorised')
        error.statusCode = 403
        throw error
    } 
    const token = authHeader.split('Bearer ')[1]
    admin.auth().verifyIdToken(token).then(decodedToken=>{
        req.user = decodedToken
        return db.collection('users')
        .where('userId', '==', req.user.uid)
        .limit(1)
        .get()
    }).then(data=>{
        req.user.handle = data.docs[0].data().handle
        req.user.avatar = data.docs[0].data().avatar
        return next()
    }).catch(err=>{
        error = new Error(err)
        error.statusCode = 500
        throw error
    })
}
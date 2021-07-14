const admin = require('firebase-admin')
const db = admin.firestore()
exports.Auth=(req, res, next)=>{
    const authHeader = req.get('Authorization')
    if(!authHeader){
        console.error('No error found')
        return res.status(403).json({error: 'UnAuthorised'})
    } 
    const token = authHeader.split('Bearer ')[1]
    admin.auth().verifyIdToken(token).then(decodedToken=>{
        req.user = decodedToken
        console.log(decodedToken)
        return db.collection('users')
        .where('userId', '==', req.user.uid)
        .limit(1)
        .get()
    }).then(data=>{
        req.user.handle = data.docs[0].data().handle
        req.user.avatar = data.docs[0].data().avatar
        return next()
    }).catch(error=>{
        console.error('Error while verifying token', error)
        res.status(403).json({error})
    })
}
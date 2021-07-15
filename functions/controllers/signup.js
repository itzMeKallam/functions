const {firebase, firebaseConfig, db} = require('../util/firebase')
let token, userId;

exports.signup =(req, res, next)=>{
    let error
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        handle: req.body.handle
    }
    db.doc(`/users/${newUser.handle}`).get()
    .then(doc=>{
        if(doc.exists){
            error = new Error('this handle is already taken')
            error.statusCode = 400
            throw error
        }
        return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
    })
    .then(data=>{
        // return res.status(201).json({doc: data})
        userId = data.user.uid
        return data.user.getIdToken()
    }).then(tokenId=>{
        token = tokenId
        const userCredentials = {
            handle: newUser.handle,
            email: newUser.email,
            userId: userId,
            avatar: `https://firebasestorage.googleapis.com/v0/b/${
                firebaseConfig.storageBucket
            }/o/avatar.png?alt=media`,
            createdAt: new Date().toISOString()
        }
        return db.doc(`/users/${newUser.handle}`).set(userCredentials)
    }).then(data=>{
        return res.status(201).json({token})
    })
    .catch(err=>{
        if(err.code === 'auth/email-already-in-use'){
            err.statusCode = 400
            err.message = 'Email is already in use'
            next(err)
        }
        err.statusCode = 500
        next(err)
    })
}
const {firebase, firebaseConfig, db} = require('../util/firebase')
let token, userId;

exports.signup =(req, res)=>{
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        handle: req.body.handle
    }
    db.doc(`/users/${newUser.handle}`).get()
    .then(doc=>{
        if(doc.exists){
            return res.status(400).json({handle: 'this handle is already taken'})
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
    .catch(error=>{
        if(error.code === 'auth/email-already-in-use'){
            return res.status(400).json({email: 'Email is already in use'})
        }
        return res.status(500).json({error: error.code})
    })
}
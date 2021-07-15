const {firebase} = require('../util/firebase')

exports.login =(req, res,next)=>{
    email = req.body.email
    password = req.body.password
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(data=>{
        return data.user.getIdToken()
    }).then(token=>{
        return res.status(200).json({token})
    }).catch(err=>{
        if(err.code === 'auth/wrong-password'){
            err.statusCode = 400
            err.message = 'Invalid password'
            next(err)
        }

        if(err.code === 'auth/user-not-found'){
            err.statusCode = 400
            err.message = 'User not found'
            next(err)
        }
        err.statusCode = 500
        next(err)
    })
}
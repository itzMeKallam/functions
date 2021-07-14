const {firebase} = require('../util/firebase')

exports.login =(req, res)=>{
    email = req.body.email
    password = req.body.password
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(data=>{
        return data.user.getIdToken()
    }).then(token=>{
        return res.status(200).json({token})
    }).catch(error=>{
        console.error(error)
        if(error.code === 'auth/wrong-password'){
            return res.status(400).json({password: 'Invalid password'})
        }

        if(error.code === 'auth/user-not-found'){
            return res.status(400).json({email: 'User not found'})
        }
        return res.status(500).json({error: error.code})
    })
}
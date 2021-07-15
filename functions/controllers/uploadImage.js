const {db, admin, firebaseConfig} = require('../util/firebase')
const path = require('path');
const os = require('os');
const fs = require('fs');
const Busboy = require('busboy');
const { v4: uuidv4 } = require('uuid');
exports.uploadImage =(req, res, next)=>{
    let imageFileName, error
    let imageToBeUploaded = {}
    const busboy = new Busboy({headers: req.headers});
    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
        if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
            error = new Error('Wrong file type submitted')
            error.statusCode = 400
            throw error
        }
        const imageExtension = filename.split('.')[filename.split(".").length - 1]
        imageFileName = `${uuidv4()}.${imageExtension}`
        const filepath = path.join(os.tmpdir(), imageFileName)
        imageToBeUploaded = {filepath, mimetype}
        file.pipe(fs.createWriteStream(filepath))
        console.log(imageToBeUploaded.filepath + 'path')
    })
    busboy.on('finish', ()=>{
        admin.storage().bucket().upload(imageToBeUploaded.filepath, {
            resumable: false,
            metadata:{
                metadata:{
                    contentType: imageToBeUploaded.mimetype
                }
            }
        }).then(()=>{
            const avatar = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`
            return db.doc(`/users/${req.user.handle}`).update({avatar})
        }).then(()=>{
            return res.status(200).json({message:'image uploaded sucessfully'})
        })
        .catch(err=>{
            if(!err.statusCode){
                err.statusCode=500
            }
            next(err)
        })
    })
    busboy.end(req.rawBody)
}
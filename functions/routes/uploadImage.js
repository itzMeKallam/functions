const express = require('express')
const router = express.Router();
const {uploadImage} = require('../controllers/uploadImage')
const {Auth} = require('../middlewares/isAuth')

router.post(
    '/', 
    Auth,
    uploadImage
    )
module.exports = router
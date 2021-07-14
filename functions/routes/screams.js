const express = require('express')
const router = express.Router();
const {screams} = require('../controllers/screams')
const {Auth} = require('../middlewares/isAuth')
router.get(
    '/', 
    Auth,
    screams
    )
module.exports = router
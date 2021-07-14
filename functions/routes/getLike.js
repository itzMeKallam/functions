const express = require('express')
const router = express.Router();
const {getLike} = require('../controllers/getLike')
const {Auth} = require('../middlewares/isAuth')
router.get(
    '/:screamId', 
    Auth,
    getLike
    )
module.exports = router
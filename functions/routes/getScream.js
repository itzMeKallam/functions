const express = require('express')
const router = express.Router();
const {getScream} = require('../controllers/getScream')
const {Auth} = require('../middlewares/isAuth')
router.get(
    '/:screamId', 
    Auth,
    getScream
    )
module.exports = router
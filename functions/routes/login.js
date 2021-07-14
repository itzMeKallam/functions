const express = require('express')
const router = express.Router();
const {login} = require('../controllers/login')
const {loginMiddleWare} = require('../middlewares/login')
router.post(
    '/', 
    loginMiddleWare,
    login
    )
module.exports = router
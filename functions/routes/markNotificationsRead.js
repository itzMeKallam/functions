const express = require('express')
const router = express.Router();
const {markNotificationsRead} = require('../controllers/markNotificationsRead')
const {Auth} = require('../middlewares/isAuth')
router.post(
    '/', 
    Auth,
    markNotificationsRead
    )
module.exports = router
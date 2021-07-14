const express = require('express')
const router = express.Router();
const {addUserDetails} = require('../controllers/addUserDetails')
const {Auth} = require('../middlewares/isAuth')
const {addUserDetailsMW} = require('../middlewares/addUserDetails')
router.post(
    '/', 
    Auth,
    addUserDetailsMW,
    addUserDetails
    )
module.exports = router
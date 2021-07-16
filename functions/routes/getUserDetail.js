const express = require('express')
const router = express.Router();
const {getUserDetail} = require('../controllers/getUserDetail')
router.get(
    '/:handle', 
    getUserDetail
    )
module.exports = router
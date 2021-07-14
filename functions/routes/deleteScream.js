const express = require('express')
const router = express.Router();
const {deleteScream} = require('../controllers/deleteScream')
const {Auth} = require('../middlewares/isAuth')
router.delete(
    '/:screamId', 
    Auth,
    deleteScream
    )
module.exports = router
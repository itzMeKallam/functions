const express = require('express')
const router = express.Router();
const {scream} = require('../controllers/scream')
router.get(
    '/', 
    (req, res)=>{
        res.send("Hello from Firebase!");
      }
    )
module.exports = router
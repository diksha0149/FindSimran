const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authCtrl')

router.get('/',(req,res)=>{
    res.send("hello");
})
router.post('/register', authCtrl.register)

router.post('/login', authCtrl.login)

router.post('/logout', authCtrl.logout)

// router.post('/refresh_token', authCtrl.generateAccessToken)

module.exports = router;
const express= require('express')
const router=express.Router();
const { auth } = require('../middleware/authenticate');

const {
    signup,
    login,
    allUsers,
  } = require("../controllers/user");

router.post('/signup',signup)
router.post('/login',login)
router.get('/users',auth,allUsers)

module.exports=router  
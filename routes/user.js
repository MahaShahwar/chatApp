const express= require('express')
const router=express.Router();
const {
    signupForm,
    loginForm,
  } = require("../controllers/user");

router.post('/signup',
  signupForm
)
router.post('/login',loginForm)

module.exports=router  
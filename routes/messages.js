const express= require('express');
const { sendMessage } = require('../controllers/message');
const router=express.Router();

const { auth } = require('../middleware/authenticate');

//router.route("/message").post(auth,sendMessage)

module.exports=router
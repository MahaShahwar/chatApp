const express= require('express');
const { sendMessage, getMessages } = require('../controllers/message');
const router=express.Router();

const { auth } = require('../middleware/authenticate');

router.route("/message").post(auth,sendMessage)
router.get('/allmessages',auth,getMessages)

module.exports=router
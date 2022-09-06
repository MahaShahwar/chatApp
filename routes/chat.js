const express= require('express')
const router=express.Router();

const {chats} = require('../controllers/chat');
const { auth } = require('../middleware/authenticate');

router.route("/chat").post(auth,chats)

module.exports=router
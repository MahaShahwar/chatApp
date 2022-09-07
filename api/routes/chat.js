const express= require('express')
const router=express.Router();

const {chats, fetchChats, createGroup, createChat} = require('../controllers/chat');
const { auth } = require('../middleware/authenticate');

router.route("/createChat").post(auth,createChat)
router.get('/allChat',auth,fetchChats)
router.post('/groups',auth,createGroup)

module.exports=router
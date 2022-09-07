const user = require('../src/models/user')
var msg=require('../src/models/message')
const chat = require('../src/models/chat')

//Send message and store in database
const sendMessage = async (req, res) => {
  console.log('in controller')
  const {content,chatId}=req.body
  

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    console.log(newMessage)
    var message = await msg.create(newMessage)
    console.log('here',message)

    
return res.status(200).send(newMessage)

    // res.send(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
}

//Get all messages of chat Id from database
const getMessages= async(req,res)=>{
  const {chatId}=req.body
  var messages = await msg.find({chat:chatId}).exec()
  
  res.status(200).send(messages)
}

module.exports = {sendMessage,getMessages}
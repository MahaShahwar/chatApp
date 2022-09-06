const user = require('../src/models/signup')
var msg=require('../src/models/message')
const chat = require('../src/models/chat')


const sendMessage = async (req, res) => {
  console.log('in controller')
  const content = req.body.content;
  const chatId=req.body.chatId
  console.log("chatid",chatId)
  

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

    message = await message.populate("sender", "name email");
    message = await message.populate("chat");
    message = await user.populate(message, {
      path: "chat.users",
      select: "name email",
    });
    
    await chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
    res.render('check2')

    // res.send(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
}

module.exports = {sendMessage}
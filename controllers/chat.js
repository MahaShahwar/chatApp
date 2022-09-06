
const user = require('../src/models/signup')
const chat = require('../src/models/chat')

const chats = (async(req,res)=>{
    try {
      console.log("in chat post")
      
    var sender=req.user._id
    // console.log("Sender ",sender)
    var selectedUser = req.body.message
    var receiver=await user.findOne({name:selectedUser})
    receiver=receiver._id
    // console.log("selected", receiver)

    if (!sender) {
        console.log("UserId param not sent with request");
        return res.sendStatus(400);
      }
    //CHeck in chat collection if user chat id exist or not
      var isChat = await chat.find({
        isGroupChat: false,
        $and: [
          { users: { $elemMatch: { $eq: sender } } },
          { users: { $elemMatch: { $eq: receiver } } },
        ],
      }).populate("users", "-password").populate("latestMessage");
    
      isChat = await user.populate(isChat, {
        path: "latestMessage.sender",
        receiver: "name email",
      })
      //If chat dont exist then create one in else
      if (isChat.length > 0) {
        // console.log("in if", isChat[0]);
        // console.log(isChat[0]._id)
        res.redirect("/message"+ "?chatID=" + isChat[0]._id);
        // res.render('message',{chatId:isChat[0]._id});
      } else {
        console.log("in else");

        var chatData = {
          chatName: sender,
          isGroupChat: false,
          users: [sender, receiver],
        };
        
        const createdChat = await chat.create(chatData);
        // console.log("createdChat---", createdChat);
        //Checking full chat in collection
          const fullChat = await chat.findOne({ _id: createdChat._id }).populate(
            "users",
            "-password"
          );
        // console.log("FullChat---", fullChat);
        
        res.redirect("/message"+ "?chatID=" + createdChat._id);

        // res.render('message',{chatId:createdChat._id});
       
      }
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }


})


const fetchChats = async (req, res) => {
    try {
      Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
        .populate("users", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(async (results) => {
          results = await User.populate(results, {
            path: "latestMessage.sender",
            receiver: "name email",
          });
          res.status(200).send(results);
        });
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  } 

  module.exports = { chats,fetchChats };
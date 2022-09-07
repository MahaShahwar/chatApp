
const user = require('../src/models/user')
const chat = require('../src/models/chat')

//create chat room
const createChat = (async(req,res)=>{
    try {
      console.log("in chat post")
      
    var sender=req.user._id
    // console.log("Sender ",sender)
    const {receiver}=req.body
    console.log(receiver)
    
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
      //If chat exist then send chat
      if (isChat.length > 0) {
        res.status(200).send(isChat[0])
      } else {
        //else create chat
        console.log("in else");

        var chatData = {
          chatName: sender,
          isGroupChat: false,
          users: [sender, receiver],
        };
        
        const createdChat = await chat.create(chatData);
          const fullChat = await chat.findOne({ _id: createdChat._id }).populate(
            "users",
            "-password"
          );
        // console.log("FullChat---", fullChat);
        
        res.status(200).send(fullChat)

        // res.render('message',{chatId:createdChat._id});
       
      }
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }


})

//fetch all chat rooms with the user(All chats of that users)
const fetchChats = async (req, res) => {
    try {
      chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
        .populate("users", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(async (results) => {
          results = await user.populate(results, {
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

  //Create group including the user

  const createGroup = async (req, res) => {
    if (!req.body.users || !req.body.name) {
      return res.status(400).send({ message: "Please Fill all the feilds" });
    }
  
    var users = JSON.parse(req.body.users);
  
    if (users.length < 2) {
      return res
        .status(400)
        .send("More than 2 users are required to form a group chat");
    }
    console.log(req.user)
  
    users.push(req.user);
  
    try {
      const groupChat = await chat.create({
        chatName: req.body.name,
        users: users,
        isGroupChat: true,
        groupAdmin: req.user,
      });
  
      console.log(req.user)
      const fullGroupChat = await chat.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
  
      res.status(200).json(fullGroupChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  };

  module.exports = { createChat,fetchChats,createGroup };
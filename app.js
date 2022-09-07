const express = require('express')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const path = require('path')
const { auth } = require('./middleware/authenticate');
const cookieParser = require("cookie-parser");
const app = express()


//Server setup
const http = require('http');
const server = http.createServer(app);

//creating socket
const {Server} = require("socket.io")
const io = new Server(server);

//Listening to this port
var port = 3000||process.env.PORT ;
server.listen(port, function () {
    console.log("Server Has Started!");
});

app.use(cookieParser());

//Connecting to routes
const user= require("./routes/user");   
const chat= require("./routes/chat");
const message= require("./routes/messages");



//Static page
// app.use('./public',express.static('public'))

//Connecting to database
require("./src/db/connection.js")


//Define data type on post method
app.use(express.json())
app.use(express.urlencoded({extended:false}))

//Signup collection to make in database
const users = require("./src/models/signup")
const msg = require("./src/models/message")
const chats = require('./src/models/chat')

//Setting up default engine we are going to use for html files in node(vanilla javascript)
app.set("view engine","ejs")

//Setting up routes[html page] Home Page

app.get('/',(req,res)=>{
    res.render('./index')
    
})

//post methods from the routes
app.use('/',user)
//getting pages
app.get('/signup',(req, res)=>{
    res.render('./SignUp')
  })

app.get('/login',(req, res)=>{
    res.render('./Login')
  })

app.get('/chat',(req,res)=>{
    console.log('in chat get')

})

app.get('/message',auth,(req,res)=>{
    res.render('./message')
})

app.get('/logout',auth,(req,res)=>{
  res.status(200).clearCookie('Token', {
    path: '/'
  });

})
app.use('/',chat)

// app.use('/',message)
    
io.on("connection",(socket) => {
    console.log('message socket connected')

    //Finding the chat id in database
    socket.on('allChat',(async function (data){
      const chatId=data.chatId
      console.log('i am here')
      chats.findByIdAndUpdate(chatId, { latestMessage: message });
          msg.find().where("chat", chatId).sort("-createdAt").exec(function(err, res){
            if(err){
                throw err;
            } 
            // Emit the messages after successfully finding chat id
            socket.emit('allmsgs', res);
        })
    }))
    
    //Receiving new messages from client
    socket.on('input',(async function  (data){
        console.log('in socket receiver side')

        const content = data.content;
        const chatId=data.chatId
        

        //Getting current user id from token
        var token = socket.request.headers.cookie.split('=')[1]
        const decoded = jwt.verify(token, "this is secret key")
        var userId = decoded.id;
        console.log('sender ID from token: ',userId)
        // Fetch the user by id 
        u=await users.findById(userId).select("-password")
        console.log('this is sender id',u._id)
      
        if (!content || !chatId) {
          sendStatus('Please enter a name and message');
          console.log("Invalid data passed into request");
        }
      //Creating new message entity in message collection
        var newMessage = {
          sender: u._id,
          content: content,
          chat: chatId,
        };
      
        try {
          var message = await msg.create(newMessage)
          message = await message.populate("sender", "name email");
          message = await message.populate("chat");
          message = await users.populate(message, {
            path: "chats.users",
            select: "name email",
          })  
          //Displaying the message on screen of all sockets
          io.sockets.emit('output',newMessage)

          // res.send(message);
        } catch (error) {
          // res.status(400);
          throw new Error(error.message);
        }
      }))

})

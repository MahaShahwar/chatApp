const express = require('express')
const { auth } = require('./middleware/authenticate');

const app = express()
require('dotenv').config();


//Listening to this port
var port = process.env.port ;
app.listen(port, function () {
    console.log("Server Has Started on port!",port);
});


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


//Setting up default engine we are going to use for html files in node(vanilla javascript)
app.set("view engine","ejs")

//Setting up routes[html page] Home Page

app.get('/',(req,res)=>{
    res.render('./index')
    
})
//Logging out after clearing the token
app.get('/logout', auth,async(req, res) => {
    res.send(token)
});

//Routes
app.use('/',user)
app.use('/',chat)
app.use('/',message)


    

const express = require('express')

const path = require('path')
const { CannotReflectMethodParameterTypeError } = require('typeorm')


const app = express()
//Connecting to database
require("../db/connection.js")

//Define data type on post method
app.use(express.json())
app.use(express.urlencoded({extended:false}))

//Signup collection to make in database
const signup = require("./signup")

//Used when we have only one static path
const static_path= path.join(__dirname,'/public')
console.log(path.join(__dirname,'/public'))
app.use(express.static(static_path))

//Setting up default engine we are going to use for html files in node
app.set("view engine","ejs")

//Setting up routes[html page] Home Page
app.get('/',(req,res)=>{
    res.render("index")
})

//Sign up page route
app.get('/signup',(req,res)=>{
    res.render("SignUp")
})

//Method on submitting signup form, saving into database
app.post('/signup',async (req,res)=>{

    var password = req.body.psw
    var passRepeat = req.body.pswRepeat 

    try{
        if(password===passRepeat){
            const newUser = new signup({
                name:req.body.user,
                email:req.body.email,
                password:password,
                age:req.body.age
            })
            const added = await newUser.save()
            //After successfully saving into database move to this page
            res.status(201).render('./index')
        }
        else{
            alert('Password not same')
        }
        
    }catch(error){
        console.log(error)
    }
})

//Login Page
app.get('/login',(req,res)=>{
    res.render("Login")
})

//Listening to this port
var port = 3000||process.env.PORT ;
app.listen(port, function () {
    console.log("Server Has Started!");
});
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const generateToken = require("../config/generateToken");


//Signup collection to make in database
const signup = require("../src/models/signup")

const signupForm=async(req,res)=>{
    var password = req.body.psw
    var passRepeat = req.body.pswRepeat 

    try{
        if(password===passRepeat){
            const hashedPass = await bcrypt.hash(password, 16)
            
            const newUser = new signup({
                name:req.body.user,
                email:req.body.email,
                password:hashedPass,
                age:req.body.age,
                
            })
            const added = await newUser.save()
            //Generating token on signup and cookie to access that token
            if(newUser){
                const token=generateToken(newUser._id)
                res.cookie("Token",token,{
                    httpOnly: true,
                })    
            }
            
            //After successfully saving into database move to this page
            allUsers(newUser.name,function(users){
                console.log("name---", newUser.name);
               
                res.render('chat',{userName:newUser.name,allUsers:users})
            })
            // res.status(201).redirect('chat')=>with('user', newUser.name);
        }
        else{
            res.send('Password not same')
        }
        
    }catch(error){
        res.send(error)
    }

}



//Login
const loginForm = async (req, res) => {
    var user = req.body.username
    var password = req.body.password
    console.log("in post login")


    try{
        const userData = await signup.findOne({name:user})
        console.log("userData", userData);
        if(await bcrypt.compare(password, userData.password)){

                const token=generateToken(userData._id)
                // res.cookie("Token",token,{
                //     httpOnly: true,
                // })
                console.log("This is token", token);
                res.status(200).send({token:token});  
        
            //After successfully saving int o database move to this page
            //passing user name to chat

            allUsers(userData.name,function(users){
                // localStorage.setItem({userName:userData.name,allUsers:users})
                res.render('chat',{userName:userData.name,allUsers:users})
                // res.redirect('chat')
            })
            // const users = await signup.find(userData.name).find({ _id: { $ne: req.user._id } });
            // console.log(users)
        }
        else{
            res.send('Invalid name or password')
        }
        
    }catch(error){
        res.send(error)
    }
  }

  //Returns all the user in database
  function allUsers(username, callback) {
    const query = { username: username };
    console.log(query)
    signup.find(query, function(err, db) {
        if (err) {
            console.log("err",err)}
        else{
            return callback(db)      
        }
        
    })
}



  module.exports = { signupForm, loginForm };

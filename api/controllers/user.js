const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const generateToken = require("../config/generateToken");


//Signup collection instance
const user = require("../src/models/user")

const signup=async(req,res)=>{
    
    const {name,email,password,age}=req.body
    const checkEmail = await user.findOne({email:email});
    if(checkEmail){
        res.status(400).send({
            message:"Email already exist"
        })
    }
    // var passRepeat = req.body.pswRepeat 

    try{
        
            const hashedPass = await bcrypt.hash(password, 16)
            console.log('here')
            
            const newUser = await user.create({
                name,
                email,
                password:hashedPass,
                age,     
            })
            console.log(newUser)
            
            //Generating token on signup and cookie to access that token
            if(newUser){
                const token=generateToken(newUser._id) 
                res.set({token: token})
                res.status(200).send({
                    _id:newUser._id,
                    name:newUser.name,
                    email:newUser.email,
                    token:token
                })
            }
        }
    catch(error){
        res.send(error)
    }

}



//Login
const login = async (req, res) => {
    //fields name in post should be same 
    const {name,password}=req.body
    console.log("in post login")

    try{
        console.log('check')
        const userData = await user.findOne({name:name})
        
        if(await bcrypt.compare(password, userData.password)){

                const token=generateToken(userData._id)
                console.log("This is token", token);
                res.status(200).send({
                    _id:userData._id,
                    name:userData.name,
                    email:userData.email,
                    token:token
                });  
        }
        else{
            res.send('Invalid name or password')
        }
        
    }catch(error){
        res.send(error)
    }
  }

//All users from database having the name start with keyword
const allUsers = async (req, res) => {
    const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await user.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
}



  module.exports = { signup, login,allUsers };

const mongoose=require("mongoose")
//creating schema
const signup = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    age:{
        type:Number,
    }
})
//Creating collection in database
const signUp=new mongoose.model("signup",signup)
module.exports=signUp
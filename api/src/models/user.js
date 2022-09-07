const mongoose=require("mongoose")
//creating schema
const user = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    age:{
        type:Number,
    }
})
//Creating collection in database(name in database is the one with "")
const users=new mongoose.model("user",user)
module.exports=users
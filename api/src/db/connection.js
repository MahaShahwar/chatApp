const mongoose = require("mongoose")
require('dotenv').config();

mongoose.connect(process.env.mongoUrl,{
   //TO prevent from depreciation warnings
    useNewUrlParser: true,
    useUnifiedTopology:true,
    
}).then(()=>{
    console.log("Successfully connected to database")
}).catch((e)=>{
    console.log(e)
})
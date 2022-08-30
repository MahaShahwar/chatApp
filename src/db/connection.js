const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://maha:mongodb1@cluster0.3mnj5.mongodb.net/chatApp?retryWrites=true&w=majority",{
   //TO prevent from depreciation warnings
    useNewUrlParser: true,
    useUnifiedTopology:true,
    
}).then(()=>{
    console.log("Successfully connected to database")
}).catch((e)=>{
    console.log(e)
})
const mongoose=require("mongoose");

function connectToDB(){
    mongoose.connect(process.env.MONGO_URI)
    .then(function(){
        console.log("connected to db")
    })
    .catch(function(err){
        console.log("Error in connecting to db")
        process.exit(1)
    })
}

module.exports=connectToDB
const mongoose = require("mongoose")


async function connectToDb(){
   await mongoose.connect("mongodb+srv://sahbhupendra1:BHupendra2222@cluster0.prbdtjf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
   console.log("Database connected")
}

module.exports = connectToDb
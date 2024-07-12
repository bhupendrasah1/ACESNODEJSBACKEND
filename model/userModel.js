const mongoose = require("mongoose")
const Schema = mongoose.Schema 

const userSchema = new Schema({
   username : {
    type : String
   },
<<<<<<< HEAD
   name : {
    type : String 
   },
   email : {
    type : String 
   }, 
   password : {
    type : String
   }
=======
   email : {
    type : String,
   },
   password : {
    type : String 
   }, 
   
>>>>>>> 69b2d873a4d42502029bb3b3d440a4a5b9fb23dc
})

const User = mongoose.model("User",userSchema)
module.exports = User
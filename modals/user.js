const mongoose = require('mongoose');

const UserSchema =  mongoose.Schema({
firstName:{
  type : String,
  required: (true,'first name is required')
},

lastName : String, 

email : {
  type : String,
  required : (true,"email is required")
},

password :{
  type: String,
   required : (true,"password is required")
},
 usertype :{
type: String,
enum: ['guest','host'],
default: 'guest'
 },

 favourites:[{
  type:mongoose.Schema.Types.ObjectId,
  ref : 'home'
 }]

}); 



module.exports = mongoose.model('User',UserSchema);

const mongoose = require('mongoose');
const homeSchema =  mongoose.Schema({
homename : {
type : String,
required : true
},

price : {
type : Number, 
required : true
},

rating : {
type : Number,
required : true
},


location : {
  type : String,
  required : true
}, 

photo :  String,
discription : String,

}); 



module.exports = mongoose.model('home',homeSchema);

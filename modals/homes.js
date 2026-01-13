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

// homeSchema.pre('findOneAndDelete', async function(next){
//   const homeid = this.getQuery()._id;
//   await favourite.deleteMany({homeid});
//   next();
// })

module.exports = mongoose.model('home',homeSchema);

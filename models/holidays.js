var mongoose = require('mongoose');

// Article Schema
var holiSchema = mongoose.Schema({
  username:{
    type: String,
    required: true
  },
  Jan: {
		type: Number,
    default: 0
	},
  Feb: {
    type: Number,
    default: 0
 },
 Mar: {
   type: Number,
   default: 0
 },
 Apr: {
   type: Number,
   default: 0
 },
 May: {
   type: Number,
   default: 0
 },
 Jun: {
   type: Number,
   default: 0
 },
 Jul: {
   type: Number,
   default: 0
 },
 Aug: {
   type: Number,
   default: 0
 },
 Sep: {
   type: Number,
   default: 0
 },
 Oct: {
   type: Number,
   default: 0
 },
 Nov: {
   type: Number,
   default: 0
 },
 Dec: {
   type: Number,
   default: 0
 }
});

var Holiday = module.exports = mongoose.model('Holiday', holiSchema);

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	Holiday.findOne(query, callback);
}

var mongoose = require('mongoose');

// Article Schema
var holiSchema = mongoose.Schema({
  username:{
    type: String,
    required: true
  },
  Jan: {
		type: Number
	},
  Feb: {
   type: Number
 },
 Mar: {
   type: Number
 },
 Apr: {
   type: Number
 },
 May: {
   type: Number
 },
 Jun: {
   type: Number
 },
 Jul: {
   type: Number
 },
 Aug: {
   type: Number
 },
 Sep: {
   type: Number
 },
 Oct: {
   type: Number
 },
 Nov: {
   type: Number
 },
 Dec: {
   type: Number
 }
});

var Holiday = module.exports = mongoose.model('Holiday', holiSchema);

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	Holiday.findOne(query, callback);
}

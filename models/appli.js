var mongoose = require('mongoose');

// Article Schema
var appSchema = mongoose.Schema({
  from:{
    type: Date,
    required: true
  },
  to:{
    type: Date,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  teamleader:{
    type: String,
    required: true
  }
});

var Application = module.exports = mongoose.model('Application', appSchema);


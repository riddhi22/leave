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
  toPerson:{
    type: String,
    required: true
  },
  fromPerson:{
    type: String,
    required: true
  },
  reason:{
    type: String,
    required: true    
  },
  status:{
    type: String,
    required: true
  },
  changesreq:{
    type: String,
    required: false
  },
  typeApp:{
    type: String,
    required: true
  }
});

var Application = module.exports = mongoose.model('Application', appSchema);


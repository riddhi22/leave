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
  toPerson:{
    type: String,
    required: true
  },
  fromPerson:{
    type: String,
    required: true
  },
   flag:{
    type: Boolean,
    required: false
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

module.exports.getAppByOID = function(appli, callback){
  var query = { _id : appli};
  Application.findOne(query, callback);
}

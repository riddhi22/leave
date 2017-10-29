var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var moment = require('moment');
//moment.format();

var User = require('../models/user');
var Application = require('../models/appli');

function compare(dateTimeA, dateTimeB) {
    var momentA = moment(dateTimeA,"YYYY-MM-DD");
    var momentB = moment(dateTimeB,"YYYY-MM-DD");
    if (momentA > momentB) return 1;
    else if (momentA < momentB) return -1;
    else return 0;
}

function dateDiff(dateTimeA, dateTimeB) {
    var momentA = moment(dateTimeA,"YYYY-MM-DD");
    var momentB = moment(dateTimeB,"YYYY-MM-DD");
    var result = momentB.diff(momentA, 'days');
    return result;
}

function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
    	req.flash('error_msg', 'Not logged in as any user, or session has expired. Login again');
        res.redirect('/users/login');
    }
}

function getUsers(req, res) {
    let query = User.find({});
    query.exec((err, user) => {
        if(err) res.send(err);
        res.json(user);
    });
}

/*
router.post('/checking', function(req, res){
	var test = req.
});
*/
// Register
router.get('/register', loggedIn , function(req, res){
	res.render('register');
});

router.get('/detail', loggedIn , function(req, res){
	res.render('detail');
});


router.get('/delete', loggedIn , function(req, res){
	res.render('delete');
});

router.get('/confirm', loggedIn , function(req, res){
	res.render('confirm');
});

router.get('/confirm1', loggedIn , function(req, res){
	res.render('confirm1');
});

// Login
router.get('/login', function(req, res){
	res.render('login');
});

router.get('/dashboard1/:username/application', loggedIn , function(req, res){
	res.render('application');
});

router.get('/dashboard2/:username/application1', loggedIn , function(req, res){
	res.render('application1');
});

router.get('/dashboard1/:username', loggedIn , function(req, res){
	res.render('dashboard1',{username : req.params.username, h1 : req.user.holidays, h2 : req.user.halfdays , h3 : req.user.nonfunc_holidays, flag : req.user.flag });
});

router.get('/dashboard2/:username', loggedIn , function(req, res){
	res.render('dashboard2',{username : req.params.username, h1 : req.user.holidays, h2 : req.user.halfdays , h3 : req.user.nonfunc_holidays, flag : req.user.flag });
});

router.get('/dashboard3/:username', loggedIn , function(req, res){
	res.render('dashboard3',{username : req.params.username });
});

router.post('/confirm', function(req, res){//	var passwrd = req.user;
	console.log(req.body.u_name);
	var newUser = new User({
		name: req.body.u_name,
		email: req.body.u_email,
		username: req.body.u_username,
		password: req.body.u_password,
		user_level: req.body.u_userlevel,
		holidays: 60,
		halfdays: 0,
		nonfunc_holidays: 0
	});

//	var newUser = req.body.User_n;
// 	console.log(newUser);
 	var pass= req.body.password;
 	console.log(pass);
 	var salt = bcrypt.genSaltSync(10);
	var hash = bcrypt.hashSync(pass, salt);
	console.log(req.user.username)
	if(bcrypt.compareSync(pass, req.user.password)){
			User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});
		req.flash('success_msg', 'User is successfully registered!');
		console.log(req.user.username);
		var url1 = '/users/dashboard3/'+req.user.username;
		res.redirect(url1);
	} else {
			req.flash('error_msg', 'Wrong password, user registeration unsucessfull');
			console.log(req.user.username);
			var url1 = '/users/dashboard3/'+req.user.username;
			res.redirect(url1);
		}
});

router.post('/confirm1', function(req, res){//	var passwrd = req.user;
 	var pass= req.body.password;
 	var username_d = req.body.username_d;
 	var salt = bcrypt.genSaltSync(10);
	var hash = bcrypt.hashSync(pass, salt);
	if(bcrypt.compareSync(pass, req.user.password)){
		User.remove({username: username_d} , function(err) {
    	if (err) {
          //  	throw err;
        	req.flash('error_msg', 'Wrong username, no user found');
            console.log(req.user.username);
			var url1 = '/users/dashboard3/'+req.user.username;
    		res.redirect(url1);
    	}
    });
		req.flash('success_msg', 'User is successfully deleted');
		var url1 = '/users/dashboard3/'+req.user.username;
		res.redirect(url1);
	} else {
			req.flash('error_msg', 'Wrong password, user deletion unsucessfull');
			console.log(req.user.username);
			var url1 = '/users/dashboard3/'+req.user.username;
			res.redirect(url1);
		}

});

router.post('/application', function(req, res){
	var from = req.body.from;
	var to = req.body.to;
	var supervisor = req.user.leader;
	var reason = req.body.reason;
	var typeApp = req.body.typeApp;
	console.log(from);
	console.log(to);
    console.log(supervisor);
	// Validation
	req.checkBody('from', 'From Date is required').notEmpty();
	req.checkBody('to', 'To Date is required').notEmpty();
	req.checkBody('reason', 'Reason is required');

	var errors = req.validationErrors();
  	User.findOneAndUpdate({ 'username': supervisor },{ $inc : { "flag" : 1 }}, function(err, doc){
    if(err){
        console.log("Something wrong when updating data!");
    	}
	console.log(doc);
	});

  	if(errors){
		res.render('application',{
			errors:errors
		});
	} else if ( compare(to,from) > 0 || typeApp=='halfday') {
		console.log("shit is in");
		console.log(compare(to,from));
		console.log(dateDiff(from,to));
		var newApplication = new Application({
			from: from,
			to: to,
			toPerson: supervisor,
			fromPerson: req.user.username,
			reason : reason,
			status: 'pending',
			typeApp: typeApp
		});
		newApplication.save(function (err) {
  			if (err) {
  				console.log('nopes again 2');
  				req.flash('error_msg', 'Application not saved, db error');
				var url1 = '/users/dashboard2/'+req.user.username;
  			};
  			console.log('yeahhhh!!');
		});
		req.flash('success_msg', 'Application Created Successfully');
		var url1 = '/users/dashboard1/'+req.user.username;
		res.redirect(url1);
	} else if ( compare(to,from) < 0) {
		req.flash('error_msg', 'The To date cannot be before From date');
		var url1 = '/users/application/';
		res.redirect(url1);
	} else if ( compare(to,from) == 0) {
		req.flash('error_msg', 'The To date cannot be same as From date');
		var url1 = '/users/application/';
		res.redirect(url1);
	}
});

router.post('/application1', function(req, res){
	var from = req.body.from;
	var to = req.body.to;
	var email = req.body.email;
	var employee = req.body.employee;
	var reason = req.body.reason;
	var typeApp = req.body.typeApp;
	console.log(employee);
	// Validation
	req.checkBody('from', 'From Date is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('to', 'To Date is required').notEmpty();
	req.checkBody('employee', 'Employee Name is required').notEmpty();
	req.checkBody('reason', 'Reason is required');

  	User.findOneAndUpdate({ 'username': employee },{ $inc : { "flag" : 1 }}, function(err, doc){
    if(err){
        console.log("Something wrong when updating data!");
    }

    console.log(doc);
});

	var errors = req.validationErrors();

	if(errors){
		res.render('application1',{
			errors:errors
		});
	} else if ( compare(to,from) > 0 || typeApp=='halfday') {
		console.log("shit is in");
		console.log(compare(to,from));
		var newApplication = new Application({
			from: from,
			email:email,
			to: to,
			toPerson: employee,
			fromPerson: req.user.username,
			reason : reason,
			status: 'pending',
			typeApp: typeApp
		});
		newApplication.save(function (err) {
  			if (err) {
  				console.log('nopes again 2');
  				req.flash('error_msg', 'Application not saved, db error');
				var url1 = '/users/dashboard2/'+req.user.username;
  			};
  			console.log('yeahhhh!! again 2');
		});
		req.flash('success_msg', 'Application Created Successfully');
		var url1 = '/users/dashboard2/'+req.user.username;
		res.redirect(url1);
	} else if ( compare(to,from) < 0) {
		req.flash('error_msg', 'The To date cannot be before From date');
		var url1 = '/users/application1/';
		res.redirect(url1);
	} else if ( compare(to,from) == 0) {
		req.flash('error_msg', 'The To date cannot be same as From date');
		var url1 = '/users/application1/';
		res.redirect(url1);
	}
});


router.get('/dashboard1/:username/profile', function(req, res){
	res.render('profiledetail' ,{u_name : req.user.name, u_email : req.user.email, u_username : req.user.username, u_userlevel : req.user.user_level});
});

router.get('/dashboard2/:username/profile', function(req, res){
	res.render('profiledetail' ,{u_name : req.user.name, u_email : req.user.email, u_username : req.user.username, u_userlevel : req.user.user_level});
});

router.get('/dashboard3/:username/profile', function(req, res){
	res.render('profiledetail' ,{u_name : req.user.name, u_email : req.user.email, u_username : req.user.username, u_userlevel : req.user.user_level});
});

router.post('/delete', function(req, res) {
    var username_d = req.body.username;
	req.checkBody('username', 'Username is required').notEmpty();
	var errors = req.validationErrors();
	console.log(username_d);
		if(errors){
		res.render('delete',{
			errors:errors
		});
	} else {
		//@Him, dekh idhar I am checking--
		var query = User.findOne({ 'username': username_d });
		console.log(query);

		if (query==null) {
			req.flash('error_msg', 'Wrong username, no user found');
        	console.log(req.user.username);
			var url1 = '/users/dashboard3/'+req.user.username;
		} else {
		query.select('name email user_level');
		query.exec(function (err, user) {
			if (err) {
		        req.flash('error_msg', 'Wrong username, no user found');
            	console.log(req.user.username);
				var url1 = '/users/dashboard3/'+req.user.username;
				throw (err);
			}
			var u_name = user.name;
			console.log('%s %s %s', user.name, user.email, user.user_level);
			var context = {
		//u_name : name,u_email : email,u_username : username,u_password : password ,u_userlevel : user_level
				u_name : user.name,
				u_email : user.email,
				u_username : username_d,
				u_userlevel : user.user_level
			}
			res.render('confirm1' ,{context});
			});
		}
	}
});

// Register User
router.post('/register', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
	var user_level = req.body.user_level;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
	req.checkBody('user_level', 'UserLevel is required').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
	console.log(user_level);
	var context = {
//u_name : name,u_email : email,u_username : username,u_password : password ,u_userlevel : user_level
		u_name : name,
		u_email : email,
		u_username : username,
		u_password : password ,
		u_userlevel : user_level
	}
	console.log(req.user.username)
	console.log(req.user.username)
	console.log(req.user.username)
	console.log(req.user.username)
	res.render('confirm' ,{context});
	}
});

passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});
//


router.post('/login',
	passport.authenticate('local', { failureRedirect: '/users/login',
									 failureFlash: 'Username or password invalid, please check again' }),
	function(req, res) {
//		var user_leve = req.body.user_level;
		var username = req.body.username;
		var query = User.findOne({ 'username': username });
//		console.log(query);
		query.select('user_level');
		query.exec(function (err, user) {
			if (err) {
		        req.flash('error_msg', 'Wrong username, no user found');
            	res.redirect('/users/login');
				throw (err);
			}
		var user_leve = user.user_level;
//		var user_leve = 'admin';
//		User.getUserByUsername(username, function(err, user){
//   		if(err) throw err;
//   		if(!user){
//   		return done(null, false, {message: 'Unknown User'});
//   		}
//		user_leve = User.user_level;
//		console.log(User.user_level);
		if (user_leve== 'employee') {
			req.flash('success_msg', 'You are logged in as employee');
			var url1 = '/users/dashboard1/'+req.user.username;
			res.redirect(url1);
		} else if (user_leve== 'super') {
			req.flash('success_msg', 'You are logged in as a Supervisor');
			var url1 = '/users/dashboard2/'+req.user.username;
			res.redirect(url1);
//junk code, just to keep past cool
		} else if (user_leve== 'team') {
			req.flash('success_msg', 'You are logged in as a Supervisor');
			var url1 = '/users/dashboard2/'+req.user.username;
			res.redirect(url1);
		} else if (user_leve== 'admin') {
			req.flash('success_msg', 'You are logged in as a Administrator');
			var url1 = '/users/dashboard3/'+req.user.username;
			res.redirect(url1);
		} else {
			res.redirect('/users/login');
			failureFlash: true;
		}
		});
  });

 //main wp appl. team leader wala kar deta hun jaldi se
 //tu delete wale ka dhund
router.get('/logout', function(req, res){
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/users/login');
});

module.exports = { getUsers };
module.exports = router;

router.get('/dashboard1/:username/formeapplications', function(req, res){
	var finded = Application.find( { $and: [ { toPerson : req.user.username }, { status: { $ne: "rejected" } }, { status: { $ne: "accepted" } }  ] }, function(err, docs) {
	    if (!err){
	        console.log(docs);
	        console.log('all inside');
	        console.log(docs.status);
	        console.log("yeah!");
	        console.log(docs[0]);
	        //	        console.log(docs[0].status);
			var counter;
	        Application.count({toPerson: req.user.username }, function(err, c) {
	        	if (err) {
	        		console.log("error");
	        	} else {
	        		counter=c;
	        		console.log(c);
	        	}
	        });
	        	        //	        console.log(docs[0].status);
			if (counter==0){
				console.log("empty huzzah !2");
				req.flash('error_msg', 'No applications addressed to you found');
				var url1 = '/users/dashboard1/'+req.user.username;
				console.log(url1);
				res.redirect(url1);
			}
			else {
	        	res.render('employee_review' ,{ applis : docs});
	   		}
	   //     process.exit();
	    } else {throw err;}
	});
});

/*
router.post('/get-maildata',function(req, res){
	var mail = req.body.mail;
	var ans = req.body.data;
	var from = req.body.from;
	var to = req.body.to;
	Application.find({email: mail,from: from,to: to}, function(err, docs) {
	    if (!err){
	    	docs[0].status = "Add_changes";
	    	docs[0].changesreq = ans;
            console.log(docs[0].changesreq);
	    }
	    else {throw err;}
	});
//	console.log(find);
});
*/
router.get('/dashboard1/:username/myapplications', function(req, res){
	var finded = Application.find({fromPerson: req.user.username }, function(err, docs) {
	    if (!err){
	        console.log(docs);
	        console.log('all inside');
	        console.log(docs.status);
	        console.log("yeah!");
	        console.log(docs[0]);
	        //	        console.log(docs[0].status);
			var counter;
	        Application.count({fromPerson: req.user.username }, function(err, c) {
	        	if (err) {
	        		console.log("error");
	        	} else {
	        		counter=c;
	        		console.log(c);
	        	}
	        });
	        	        //	        console.log(docs[0].status);
			if (counter==0){
				console.log("empty huzzah !2");
				req.flash('error_msg', 'No applications written by you found');
				var url1 = '/users/dashboard1/'+req.user.username;
				console.log(url1);
				res.redirect(url1);
			}
			else {
				res.render('allapplications1' ,{ applis : docs});
	   		}
	   //     process.exit();
	    } else {throw err;}
	});

});
router.get('/dashboard2/:username/formtapplications', function(req, res){
	var finded = Application.find( { $and: [ { toPerson : req.user.username }, { status: { $ne: "rejected" } }, { status: { $ne: "accepted" } }  ] }, function(err, docs) {
	    if (!err){
	        console.log(docs);
	        console.log('all inside');
	        console.log(docs.status);
	        console.log("yeah!");
	        console.log(docs[0]);
	        var counter;
	        Application.count({toPerson: req.user.username }, function(err, c) {
	        	if (err) {
	        		console.log("error");
	        	} else {
	        		counter=c;
	        		console.log(c);
	        	}
	        });
	        	        //	        console.log(docs[0].status);
			if (counter==0){
				console.log("empty huzzah !2");
				req.flash('error_msg', 'No applications addressed to you found');
				var url1 = '/users/dashboard2/'+req.user.username;
				console.log(url1);
				res.redirect(url1);
			}
			else {
	        	res.render('supervisior_review' ,{ applis : docs});
	   		}
	   //     process.exit();
	    } else {throw err;}
	});
});
router.get('/dashboard2/:username/mytapplications', function(req, res){
	var finded = Application.find({fromPerson: req.user.username }, function(err, docs) {
	    if (!err){
	        console.log(docs);
	        console.log('all inside');
	        console.log(docs.status);
	        console.log("yeah!");
	        console.log(docs[0]);
	        	        //	        console.log(docs[0].status);
			var counter;
	        Application.count({toPerson: req.user.username }, function(err, c) {
	        	if (err) {
	        		console.log("error");
	        	} else {
	        		counter=c;
	        		console.log(c);
	        	}
	        });
	        	        //	        console.log(docs[0].status);
			if (counter==0){
				console.log("empty huzzah !2");
				req.flash('error_msg', 'No applications written by you found');
				var url1 = '/users/dashboard2/'+req.user.username;
				console.log(url1);
				res.redirect(url1);
			}
			else {
	        	res.render('allapplications1' ,{ applis : docs});
	   		}
	   //     process.exit();
	    } else {throw err;}
	});

});

router.get('/calendar', loggedIn , function(req, res){
	res.render('calendar',{h1 : req.user.holidays, h2 : req.user.halfdays , h3 : req.user.nonfunc_holidays, flag : req.user.flag });
});


router.post('/applicationchange/accept', function(req, res){
	var id = req.body.ouid;
	var cha='accepted';
	console.log(id);
	Application.getAppByOID(id, function(err, appli){
	if(!err){
		//console.log(appli.status);
		console.log(appli);
		appli.status=cha;
		console.log(appli.typeApp);
		console.log(appli.status);
    console.log("***********************");
    if(appli.typeApp=='func'){
            User.findOneAndUpdate({ 'username': appli.fromPerson },{ $inc : { "holidays" : dateDiff(appli.to  ,appli.from) }}, function(err, doc){
              if(err){
                  console.log("Something wrong when updating data!");
              }
          });
	} else if(appli.typeApp=='nonfunc'){
            User.findOneAndUpdate({ 'username': appli.fromPerson },{ $inc : { "nonfunc_holidays" : dateDiff(appli.from,appli.to) }}, function(err, doc){
              if(err){
                  console.log("Something wrong when updating data!");
              }
          });
  	} else if(appli.typeApp=='halfday'){
            User.findOneAndUpdate({ 'username': appli.fromPerson },{ $inc : { "halfdays" : 1 }}, function(err, doc){
              if(err){
                  console.log("Something wrong when updating data!");
              }
          });
  	}
		appli.save(function(err){
    		if(err) {
    			console.log("Application not saved successfully");
    			req.flash('error_msg', 'Changes unsuccessfull');
    		} else {
    		    user_leve = req.user.user_level;
    		    if (user_leve== 'employee') {
    			    	req.flash('success_msg', 'Changes requested Successfully');
    					var url1 = '/users/dashboard1/'+req.user.username+'/formeapplications/';
    					res.redirect(url1);
    				} else if (user_leve== 'super') {
    				    req.flash('success_msg', 'Changes requested Successfully');
    					var url1 = '/users/dashboard2/'+req.user.username+'/formtapplications/';
    					res.redirect(url1);
    		//junk code, just to keep past cool
    				} else if (user_leve== 'team') {
    				    req.flash('success_msg', 'Changes requested Successfully');
    					var url1 = '/users/dashboard2/'+req.user.username+'/formtapplications/';
    					res.redirect(url1);
    				};
    			}
    		});
		}
    });
});


//	var url1 = '/users/dashboard2/'+req.user.username+'/formtapplications/';
//			res.redirect(url1);

router.post('/applicationchange/reject', function(req, res){
	var id = req.body.ouid;
	var cha='rejected';
	console.log(id);
		Application.getAppByOID(id, function(err, appli){
		if(!err){
			//console.log(appli.status);
			console.log(appli);
			appli.status=cha;
			console.log(appli.typeApp);
			console.log(appli.status);
			appli.save(function(err){
	    		if(err) {
	    			console.log("Application not saved successfully");
	    			req.flash('error_msg', 'Changes unsuccessfull');
	    		} else {
	    		    user_leve = req.user.user_level;
	    		    if (user_leve== 'employee') {
	    			    	req.flash('success_msg', 'Changes requested Successfully');
	    					var url1 = '/users/dashboard1/'+req.user.username+'/formeapplications/';
	    					res.redirect(url1);
	    				} else if (user_leve== 'super') {
	    				    req.flash('success_msg', 'Changes requested Successfully');
	    					var url1 = '/users/dashboard2/'+req.user.username+'/formtapplications/';
	    					res.redirect(url1);
	    		//junk code, just to keep past cool
	    				} else if (user_leve== 'team') {
	    				    req.flash('success_msg', 'Changes requested Successfully');
	    					var url1 = '/users/dashboard2/'+req.user.username+'/formtapplications/';
	    					res.redirect(url1);
	    				};
	    			}
	    		});
			}
	    });
	});

router.post('/application/reqchang', function(req, res){
	var id = req.body.ouid;
	console.log(id);

	Application.getAppByOID(id, function(err, appli){
   	if(err) throw err;
   	console.log(appli);
   	console.log(appli.from);
    res.render('reqchanges', { app: appli });
	});
});

router.post('/application/reqchanges', function(req, res){
	var id = req.body.ouid;
	var reason = req.body.reason;
	console.log(id);
	console.log(reason);
	//we have oid of application! (1)

	Application.getAppByOID(id, function(err, appli){
   	if(err) throw err;
   	console.log(appli);
   	//now we have applications! (2)
    console.log(appli.from);
    //the appli is of type Application in proper JSON (3)
    appli.changesreq = reason;

    appli.status="reqchanges";

    appli.flag = "true";

    appli.save(function(err){
    	if (err) {
    		console.log('you picked an application without typeApp or Something is wrong');
    	};
    });
    console.log(appli);
    user_leve = req.user.user_level;
    if (user_leve== 'employee') {
	    	req.flash('success_msg', 'Changes requested Successfully');
			var url1 = '/users/dashboard1/'+req.user.username;
			res.redirect(url1);
		} else if (user_leve== 'super') {
		    req.flash('success_msg', 'Changes requested Successfully');
			var url1 = '/users/dashboard2/'+req.user.username;
			res.redirect(url1);
//junk code, just to keep past cool
		} else if (user_leve== 'team') {
		    req.flash('success_msg', 'Changes requested Successfully');
			var url1 = '/users/dashboard2/'+req.user.username;
			res.redirect(url1);
		};
   });
});

router.post('/getapp', function(req, res){
	var id = req.body.ouid;
	console.log(id);
	Application.getAppByOID(id, function(err, appli){
		if(err) throw err;
		console.log(appli.reason);
	res.render('app', { app: appli });
	});

});

router.post('/edit', function(req, res){
	Application.findOneAndUpdate({ _id: req.body._id },
		{$set: {
        	reason: req.body.description,
          	from: req.body.from,
          	to : req.body.to,
    	 	status: 'pending' 
    	 	}
		},
		function(err, doc){
    	if(err){
        	console.log("Something wrong when updating data!");
    	}
    	var url2 = '/users/dashboard1/'+req.user.username+'/myapplications';
    	//change this
    	res.redirect(url2);
		}
	);
});

router.get('/dashboard2/:username/addingemp', function(req, res){
    var finded = User.find({leader: null}, function(err, docs) {
        if (!err){
            console.log(docs);

            res.render('addemp' ,{ applis : docs});
       //     process.exit();
        } else {throw err;}
    });
});

router.post('/addingteam', function(req, res){
   var mail = req.body.mail;
   console.log(mail);

   User.findOneAndUpdate({ email: req.body.mail }, {$set: {
        leader: req.user.username,
     }
}, function(err, doc){
    if(err){
        console.log("Something wrong when updating data!");
    }
    var url1 = '/users/dashboard2/'+req.user.username+'/addingemp';
          req.flash("Employee added Successfully");
          res.redirect(url1);
   });
});

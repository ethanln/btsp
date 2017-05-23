'use strict';

function UserDao(){
	var User = require('../model/UserModel.js');

	this.getUser = function(params, cb){
		/*User.findOne({ 'username': params.username }, function (err, user) {
			var result = {};
	  		if (err){
	  			console.log(err);

	  			result.data = null;
	  			result.message = err;
	  			cb(result);
		  	} 
		  	else{
			  	console.log('%s %s exists.', user.first_name, user.last_name);

			  	result.data = user;
			  	result.message = "User exists.";
			  	cb(result);
		  	}
		});*/
	}

	this.getUsers = function(params, cb){
		/*User.find({}, function (err, users) {
			var result = {}
	  		if (err){
	  			console.log(err);
	  			
	  			result.data = null;
	  			result.message = err;
	  			cb(result);
		  	} 
		  	else{
		  		console.log('%s %s exists.', user.first_name, user.last_name)

			  	result.data = users;
			  	result.message = "Users exists."
			  	cb(result);
		  	}
		  	
		});*/
	}

	this.addUser = function(params, cb){
		var user = new User(params);

		user.save(function(err, user, numberAffected){
			var result = {};
			if(err){
				console.log(err);

				result.data = null;
				result.message = err;
				result.isError = true;
				cb(result);
			}
			else{
				console.log('%s saved to db', user.username);

				result.data = user;
				result.message = err;
				result.isError = false;
				cb(result);
			}
		});
	}

	this.updateUser = function(params){

	}

	this.deleteUser = function(params){

	}
}

module.exports = UserDao;
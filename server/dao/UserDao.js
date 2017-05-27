'use strict';

function UserDao(){
	var User = require('../model/UserModel.js');

	this.getUser = function(key, value, cb){
		var query = {};
		query[key] = value;
		User.findOne(query, function (err, user) {
			var result = {};
	  		if (err || user == null){
	  			result.data = null;
	  			result.message = err;
	  			result.isError = true;
	  			cb(result);
		  	} 
		  	else{
			  	result.data = user;
			  	result.message = "User exists.";
			  	result.isError = false;
			  	cb(result);
		  	}
		});
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

		user.save(function(err, addedUser, numberAffected){
			var result = {};
			if(err || addedUser == null){
				result.data = null;
				result.message = err;
				result.isError = true;
				cb(result);
			}
			else{
				result.data = addedUser;
				result.message = 'Finished adding user.';
				result.isError = false;
				cb(result);
			}
		});
	}

	this.updateUser = function(key, value, user, cb){
		var query = {};
		query[key] = value;
		User.findOneAndUpdate(query, user, function(err, updatedUser){
			var result = {};
			if(err || updatedUser == null){
				result.data = null;
				result.message = err;
				result.isError = true;
				cb(result);
			}
			else{
				result.data = updatedUser;
				result.message = 'Finished updating user.';
				result.isError = false;
				cb(result);
			}
		});
	}

	this.deleteUser = function(key, value, cb){
		var query = {}
		query[key] = value;
		User.findOneAndRemove(query, function(err){
			var result = {};
			if(err){
				result.data = null;
				result.message = err;
				result.isError = true;
				cb(result);
			}
			else{
				result.data = err;
				result.message = 'Finished deleting user.';
				result.isError = false;
				cb(result);
			}
		});
	}
}

module.exports = UserDao;
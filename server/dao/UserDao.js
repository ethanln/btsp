'use strict';

function UserDao(){
	var User = require('../model/UserModel.js');

	/**
	* Gets a user entity from the database.
	*/
	this.getUser = function(key, value, cb){
		// If no key-value-pair is given, throw error.
		if(!key || !value){
			var dbError = {
				data: null,
				message: 'User not found.',
				isError: true
			};
  			cb(dbError);
  			return;
		}

		// Construct query.
		var query = {};
		query[key] = value;

		// Find User.
		User.findOne(query, function (err, user) {
			var result = {};
			// NOTE: We should still return a null value for users.
	  		if (err || user == null){
	  			// Throw error if user is non-existent in database.
	  			result.data = null;
	  			result.message = 'User not found';
	  			result.isError = true;
		  	} 
		  	else{
		  		// Return success result if User is found.
			  	result.data = user;
			  	result.message = "User exists.";
			  	result.isError = false;
		  	}
		  	cb(result);
		});
	}

	/**
	* Gets all user entities from the database.
	*/
	this.getUsers = function(cb){
		// Find all users.
		User.find({}, function (err, users) {
			var result = {}
	  		if (err){
	  			// Throw error if db communication fails.
	  			result.data = null;
	  			result.message = 'Could not get users';
	  			result.isError = true;
		  	} 
		  	else{
		  		// Return success result.
			  	result.data = users;
			  	result.message = "Fetched users."
			  	result.isError = false;
		  	}
		  	cb(result);
		});
	}

	/**
	* Adds a new user to the database.
	*/
	this.addUser = function(userData, cb){
		// If user data is not provided, throw error.
		if(!userData){
			var dbError = {
				data: null,
				message: 'No user data provided.',
				isError: true
			};
  			cb(dbError);
  			return;
		}

		// Create new user entity.
		var user = new User(userData);

		// Save user entity to the database.
		user.save(function(err, addedUser, numberAffected){
			var result = {};
			// NOTE: We should still return a null value for users.
			if(err || addedUser == null){
				// Throw error if user could not be added.
				result.data = null;
				result.message = 'Could not add user';
				result.isError = true;
			}
			else{
				// Return success result if user was added to database.
				result.data = addedUser;
				result.message = 'Finished adding user.';
				result.isError = false;
			}
			cb(result);
		});
	}

	/**
	* Updates User in Database.
	*/
	this.updateUser = function(key, value, data, cb){
		// If no key-value-pair is given, throw error.
		if(!key || !value){
			var dbError = {
				data: null,
				message: 'User not found.',
				isError: true
			};
  			cb(dbError);
  			return;
		}

		// Construct query.
		var query = {};
		query[key] = value;

		// Update user.
		User.findOneAndUpdate(query, data, function(err, updatedUser){
			var result = {};
			// NOTE: We should still return a null value for users.
			if(err || updatedUser == null){
				// Throw error is no user was found to be update, or db communications failed.
				result.data = null;
				result.message = 'Could not update user.';
				result.isError = true;
			}
			else{
				// Return success result if user was updated.
				result.data = updatedUser;
				result.message = 'Finished updating user.';
				result.isError = false;
			}
			cb(result);
		});
	}

	/**
	* Deletes User from Database.
	*/
	this.deleteUser = function(key, value, cb){
		// If no key-value-pair is given, throw error.
		if(!key || !value){
			var dbError = {
				data: null,
				message: 'User not found.',
				isError: true
			};
  			cb(dbError);
  			return;
		}

		// Construct query.
		var query = {}
		query[key] = value;

		// Remove User.
		User.findOneAndRemove(query, function(err){
			var result = {};
			if(err){
				// Throw error if db communications failed.
				result.data = null;
				result.message = 'Could not remove user.';
				result.isError = true;
			}
			else{
				// Return success result if user was successfully deleted.
				result.data = err;
				result.message = 'Finished deleting user.';
				result.isError = false;
			}
			cb(result);
		});
	}
}

module.exports = UserDao;
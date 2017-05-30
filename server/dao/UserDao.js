'use strict';

function UserDao(){
	var DbResponse = require('../util/DbResponse.js');
	var User = require('../model/UserModel.js');

	/**
	* Gets a user entity from the database.
	*/
	this.getUser = function(dbQuery, cb){
		// If no key-value-pair is given, throw error.
		if(!dbQuery){
  			cb(new DbResponse('No query parameters found.', null, DbResponse.RESPONSE_TYPE.INVALID_INPUT));
  			return;
		}

		// Find User.
		User.findOne(dbQuery.query, function (err, user) {
			var result = {};
	  		if (err){
	  			// Throw error if user is non-existent in database.
	  			result = new DbResponse('Database query failed for query ' + dbQuery.query.toString() + '.', null, DbResponse.RESPONSE_TYPE.DB_CONNECTION_FAILURE);
		  	} 
		  	else{
		  		// Return success result if User is found.
		  		result = new DbResponse('User found.', user, DbResponse.RESPONSE_TYPE.SUCCESS);
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
	  			result = new DbResponse('Database connection threw error while trying to fetch all users', null, DbResponse.RESPONSE_TYPE.DB_CONNECTION_FAILURE);
		  	} 
		  	else{
		  		// Return success result.
		  		result = new DbResponse('All users fetched.', users, DbResponse.RESPONSE_TYPE.SUCCESS);
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
  			cb(new DbResponse('No user data provided for add.', null, DbResponse.RESPONSE_TYPE.INVALID_INPUT));
  			return;
		}

		// Create new user entity.
		var user = new User(userData);

		// Save user entity to the database.
		user.save(function(err, addedUser, numberAffected){
			var result = {};
			if(err){
				// Throw error if user could not be added.
				result = new DbResponse('Could not add user', null, DbResponse.RESPONSE_TYPE.DB_CONNECTION_FAILURE);
			}
			else{
				// Return success result if user was added to database.
				result = new DbResponse('Finished adding user.', addedUser, DbResponse.RESPONSE_TYPE.SUCCESS);
			}
			cb(result);
		});
	}

	/**
	* Updates User in Database.
	*/
	this.updateUser = function(dbQuery, data, cb){
		// If no key-value-pair is given, throw error.
		if(!dbQuery){
			cb(new DbResponse('No query parameters found.', null, DbResponse.RESPONSE_TYPE.INVALID_INPUT));
  			return;
		}

		// Update user.
		User.findOneAndUpdate(dbQuery.query, data, function(err, updatedUser){
			var result = {};
			if(err){
				// Throw error is no user was found to be update, or db communications failed.
				result = new DbResponse('Could not update user.', null, DbResponse.RESPONSE_TYPE.DB_CONNECTION_FAILURE);
			}
			else{
				// Return success result if user was updated.
				result = new DbResponse('Finished updating user.', updatedUser, DbResponse.RESPONSE_TYPE.SUCCESS);
			}
			cb(result);
		});
	}

	/**
	* Deletes User from Database.
	*/
	this.deleteUser = function(dbQuery, cb){
		// If no key-value-pair is given, throw error.
		if(!dbQuery){
			cb(new DbResponse('No query parameters found.', null, DbResponse.RESPONSE_TYPE.INVALID_INPUT));
  			return;
		}

		// Remove User.
		User.findOneAndRemove(dbQuery.query, function(err){
			var result = {};
			if(err){
				// Throw error if db communications failed.
				result = new DbResponse('Could not remove user.', null, DbResponse.RESPONSE_TYPE.DB_CONNECTION_FAILURE);
			}
			else{
				// Return success result if user was successfully deleted.
				result = new DbResponse('Finished deleting user.', err, DbResponse.RESPONSE_TYPE.SUCCESS);
			}
			cb(result);
		});
	}
}

module.exports = new UserDao();
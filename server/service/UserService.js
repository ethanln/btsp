'use strict';

function UserService(){
	var UserDao = require('../dao/UserDao.js');
	var DbQuery = require('../util/DbQuery.js');
	var ServiceResponse = require('../util/ServiceResponse.js');
	var bcrypt = require('bcrypt');  
	var SALT = bcrypt.genSaltSync();
	var config = require('../config');

	/**
	* Service call to unregister user from persistent layer.
	*/
	this.registerUser = function(params, cb){

		// Check if all necessary inputs are provided.
		if(!params.first_name || !params.last_name
			|| !params.username || !params.password
			|| !params.confirmPassword || !params.email){

			cb(new ServiceResponse('Invalid inputs', null, ServiceResponse.RESPONSE_TYPE.INVALID_INPUT));
			return;
		}

		// Check if the confirmation password matches the password.
		if(params.password != params.confirmPassword){
			cb(new ServiceResponse('Password confirmation does not match password.', null, ServiceResponse.RESPONSE_TYPE.INVALID_INPUT));
			return;
		}

		// Check if user already exists.
		UserDao.getUser(new DbQuery({'username': params.username.toLowerCase()}), function(getUserDbResponse){
			if(!getUserDbResponse.data){
				// If User does not exist, hash password and create new user.
				bcrypt.hash(params.password, SALT, function(err, hash){
					if(err || hash == null){
						// Throw error if hash method fails.
						cb(new ServiceResponse('Password hashing failed.', null, ServiceResponse.RESPONSE_TYPE.SYSTEM_ERROR));
					}
					else{
						// Create user entity parameters.
						var userEntity = {
							first_name: params.first_name.toLowerCase(),
							last_name: params.last_name.toLowerCase(),
							username: params.username.toLowerCase(),
							password: hash,
							email: params.email.toLowerCase()
						};

						// Register user to db.
						UserDao.addUser(userEntity, function(addUserDbResponse){
							var result = {};
							if(addUserDbResponse.isError){
								// Throw error if db communication throws an error.
								result = new ServiceResponse('Could not register user.', null, ServiceResponse.RESPONSE_TYPE.SYSTEM_ERROR);
							}
							else{
								// Return success result after registering user.
								result = new ServiceResponse('User Registered.', addUserDbResponse.data, ServiceResponse.RESPONSE_TYPE.SUCCESS);
							}
							cb(result);
						});
					}
				});
			}
			else{
				// If user does exist, throw error.
				cb(new ServiceResponse('User ' + params.username + ' already exists.', null, ServiceResponse.RESPONSE_TYPE.INVALID_INPUT));
			}
		});
	}

	/**
	* Service call to change user password in persistent layer.
	*/
	this.changePassword = function(params, cb){
		// Make sure we have the following inputs.
		if(!params.username || !params.oldPassword
			|| !params.newPassword || !params.confirmPassword){

			cb(new ServiceResponse('Invalid inputs.', null, ServiceResponse.RESPONSE_TYPE.INVALID_INPUT));
			return;
		}

		// Check if the confirmation password matches the password.
		if(params.newPassword != params.confirmPassword){
			cb(new ServiceResponse('Password confirmation does not match password.', null, ServiceResponse.RESPONSE_TYPE.INVALID_INPUT));
			return;
		}

		// Check if the new password is equal to the old password.
		if(params.newPassword == params.oldPassword){
			cb(new ServiceResponse('New password cannot be the old password.', null, ServiceResponse.RESPONSE_TYPE.INVALID_INPUT));
			return;
		}

		UserDao.getUser(new DbQuery({'username': params.username.toLowerCase()}), function(getUserDbResponse){
			if(getUserDbResponse.isError || !getUserDbResponse.data){
				// If user doesn't exist, throw error.
				cb(new ServiceResponse('Incorrect username or password.', null, ServiceResponse.RESPONSE_TYPE.NOT_FOUND));
			}
			else{
				// Hash old password and compare with the persisted hashed password.
				bcrypt.compare(params.oldPassword, getUserDbResponse.data.password, function(err, doesMatch){
					if(doesMatch === true){
						// Hash the new password.
						bcrypt.hash(params.newPassword, SALT, function(err, hash){
							if(err || hash == null){
								// Throw error if hash method fails.
								cb(new ServiceResponse('Password hashing failed.', null, ServiceResponse.RESPONSE_TYPE.SYSTEM_ERROR));
							}
							else{
								UserDao.updateUser(new DbQuery({'username': getUserDbResponse.data.username.toLowerCase()}), {password: hash}, function(updateUserDbResponse){
									var result = {};
									if(updateUserDbResponse.isError){
										// Throw error if password change was not successful.
										result = new ServiceResponse('Could not change password.', null, ServiceResponse.RESPONSE_TYPE.SYSTEM_ERROR);
									}
									else{
										// Return success result if user update was successful.
										result = new ServiceResponse('Password changed.', updateUserDbResponse.data, ServiceResponse.RESPONSE_TYPE.SUCCESS);
									}
									cb(result);
								});
							}
						});
					}
					else{
						// Throw error if password does not match.
						cb(new ServiceResponse('Incorrect username or password.', null, ServiceResponse.RESPONSE_TYPE.NOT_AUTHORIZED));
					}
				});
			}
		});
	}

	/**
	* Service call to unregister user from the persisten layer.
	*/
	this.unregisterUser = function(params, cb){
		// Check if username is provided for the unregistration process
		if(!params.username){
			cb(new ServiceResponse('Invalid inputs.', null, ServiceResponse.RESPONSE_TYPE.INVALID_INPUT));
			return;
		}

		// Find user first.
		UserDao.getUser(new DbQuery({'username': params.username.toLowerCase()}), function(getUserDbResponse){
			if(getUserDbResponse.isError || !getUserDbResponse.data){
				// Throw error if user was no unregistered successfully.
				cb(new ServiceResponse('User does not exist.', null, ServiceResponse.RESPONSE_TYPE.NOT_FOUND));
			}
			else{
				// Delete the user from the database
				UserDao.deleteUser(new DbQuery({'username': params.username.toLowerCase()}), function(deleteUserDbResponse){
					var result = {}
					if(deleteUserDbResponse.isError){
						// Throw error if user was no unregistered successfully.
						result = new ServiceResponse('Could not delete user.', null, ServiceResponse.RESPONSE_TYPE.SYSTEM_ERROR);
					}
					else{
						// Return success result if user was unregistered successfully.
						result = new ServiceResponse('User unregistered.', deleteUserDbResponse.data, ServiceResponse.RESPONSE_TYPE.SUCCESS);
					}
					cb(result);
				});
			}
		});
	}
}

module.exports = new UserService();
'use strict';

function UserService(){
	var UserDao = require('../dao/UserDao.js');
	var DbQuery = require('../util/DbQuery.js');
	var ServiceResponse = require('../util/ServiceResponse.js');
	var bcrypt = require('bcrypt');  
	var SALT = bcrypt.genSaltSync();
	var config = require('../config');

	this.registerUser = function(params, cb){

		// Check if all necessary inputs are provided.
		if(!params.first_name
			|| !params.last_name
			|| !params.username
			|| !params.password
			|| !params.confirmPassword
			|| !params.email){

			var result = {
				data: null,
				message: 'Invalid inputs.',
				isError: true,
				code: 400
			};
			cb(result);
			return;
		}

		// Check if the confirmation password matches the password.
		if(params.password != params.confirmPassword){
			var result = {
				data: null,
				message: 'Password confirmation does not match passsword.',
				isError: true,
				code: 400
			}
			cb(result);
			return;
		}

		// Check if user already exists.
		UserDao.getUser(new DbQuery({'username': params.username.toLowerCase()}), function(dbResponse){
			if(!dbResponse.data){
				// If User does not exist, hash password and create new user.
				bcrypt.hash(params.password, SALT, function(err, hash){
					if(err || hash == null){
						// Throw error if hash method fails.
						var result = {
							data: null,
							message: 'Password hashing failed.',
							isError: true,
							code: 500
						}
						cb(result);
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
								result.data = null;
								result.message = 'Could not register user.';
								result.isError = true;
								result.code = 500;
							}
							else{
								// Return success result after registering user.
								result.data = addUserDbResponse.data;
								result.message = 'User Registered.';
								result.isError = false;
								result.code = 200;
							}
							cb(result);
						});
					}
				});
			}
			else{
				// If user does exist, throw error.
				var result = {
					data: null,
					message: 'User ' + params.username + ' already exists.',
					isError: true,
					code: 400
				};
				cb(result);
			}
		});
	}

	this.changePassword = function(params, cb){
		// Make sure we have the following inputs.
		if(!params.username 
			|| !params.oldPassword
			|| !params.newPassword
			|| !params.confirmPassword){
			var result = {
				data: null,
				message: 'Invalid inputs.',
				isError: true,
				code: 400
			};
			cb(result);
			return;
		}
		// NOTE: REFACTOR THESE BELOW.  Or make an error handling utility.
		// Check if the confirmation password matches the password.
		if(params.newPassword != params.confirmPassword){
			var result = {
				data: null,
				message: 'Password confirmation does not match passsword.',
				isError: true,
				code: 400
			}
			cb(result);
			return;
		}

		// Check if the new password is equal to the old password.
		if(params.newPassword == params.oldPassword){
			var result = {
				data: null,
				message: 'New password cannot be the old password.',
				isError: true,
				code: 400
			}
			cb(result);
			return;
		}

		UserDao.getUser(new DbQuery({'username': params.username.toLowerCase()}), function(dbResponse){
			if(dbResponse.isError || !dbResponse.data){
				// If user doesn't exist, throw error.
				var result = {
					data: null,
					message: 'Incorrect username or password',
					isError: true,
					code: 404
				};
				cb(result);
			}
			else{
				// Hash old password and compare with the persisted hashed password.
				bcrypt.compare(params.oldPassword, dbResponse.data.password, function(err, doesMatch){
					if(doesMatch === true){
						// Hash the new password.
						bcrypt.hash(params.newPassword, SALT, function(err, hash){
							if(err || hash == null){
								// Throw error if hash method fails.
								var result = {
									data: null,
									message: 'Password hashing failed.',
									isError: true,
									code: 500
								}
								cb(result);
							}
							else{
								UserDao.updateUser(new DbQuery({'username': dbResponse.data.username.toLowerCase()}), {password: hash}, function(updateUserDbResponse){
									var result = {};
									if(updateUserDbResponse.isError){
										// Throw error if password change was not successful.
										result.data = null;
										result.message = 'Could not change password.';
										result.isError = true;
										result.code = 500;
									}
									else{
										// Return success result if user update was successful.
										result.data = updateUserDbResponse.data;
										result.message = 'Password changed';
										result.isError = false;
										result.code = 200;
									}
									cb(result);
								});
							}
						});
					}
					else{
						var result = {
							data: null,
							message: 'Incorrect username or password',
							isError: true,
							code: 404
						};
						cb(result);
					}
				});
			}
		});
	}

	this.unregisterUser = function(params, cb){
		// Check if username is provided for the unregistration process
		if(!params.username){
			var result = {
				data: null,
				message: 'Invalid inputs.',
				isError: true,
				code: 400
			};
			
			cb(result);
			return;
		}

		// Find user first.
		UserDao.getUser(new DbQuery({'username': params.username.toLowerCase()}), function(getUserDbResponse){
			if(getUserDbResponse.isError || !getUserDbResponse.data){
				// Throw error if user was no unregistered successfully.
				var result = {
					data: null,
					message: 'User does not exist',
					isError: true,
					code: 404
				}
				cb(result);
			}
			else{
				// Delete the user from the database
				UserDao.deleteUser(new DbQuery({'username': params.username.toLowerCase()}), function(deleteUserDbResponse){
					var result = {}
					if(deleteUserDbResponse.isError){
						// Throw error if user was no unregistered successfully.
						result.data = null;
						result.message = 'Could not delete user';
						result.isError = true;
						result.code = 500;
					}
					else{
						// Return success result if user was unregistered successfully.
						result.data = null;
						result.message = 'User unregistered';
						result.isError = false;
						result.code = 200;
					}
					cb(result);
				});
			}
		});
	}
}

module.exports = new UserService();
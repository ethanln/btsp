'use strict';

function UserService(){
	var UDao = require('../dao/UserDao.js');
	var UserDao = new UDao();
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
			
			throw result;
		}

		// Check if the confirmation password matches the password.
		if(params.password != params.confirmPassword){
			var result = {
				data: null,
				message: 'Password confirmation does not match passsword.',
				isError: true,
				code: 400
			}

			throw result;
		}

		// Check if user already exists.
		UserDao.getUser('username', params.username.toLowerCase(), function(response){
			if(!response.data){
				// If User does not exist, hash password and create new user.
				bcrypt.hash(params.password, SALT, function(err, hash){
					var userEntity = {
						first_name: params.first_name.toLowerCase(),
						last_name: params.last_name.toLowerCase(),
						username: params.username.toLowerCase(),
						password: hash,
						email: params.email.toLowerCase()
					};

					UserDao.addUser(userEntity, cb);
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
			
			throw result;
		}

		// Check if the confirmation password matches the password.
		if(params.newPassword != params.confirmPassword){
			var result = {
				data: null,
				message: 'Password confirmation does not match passsword.',
				isError: true,
				code: 400
			}
			
			throw result;
		}

		// Check if the new password is equal to the old password.
		if(params.newPassword == params.oldPassword){
			var result = {
				data: null,
				message: 'New password cannot be the old password.',
				isError: true,
				code: 400
			}
			
			throw result;
		}

		UserDao.getUser('username', params.username.toLowerCase(), function(response){
			if(!response.data){
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
				bcrypt.compare(params.oldPassword, response.data.password, function(err, doesMatch){
					if(doesMatch === true){
						// Hash the new password.
						bcrypt.hash(params.newPassword, SALT, function(err, hash){
							UserDao.updateUser('username', response.data.username.toLowerCase(), {password: hash}, cb);
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
			
			throw result;
		}

		// Delete the user from the database
		UserDao.deleteUser('username', params.username.toLowerCase(), cb);
	}
}

module.exports = UserService;
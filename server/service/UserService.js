'use strict';

function UserService(){
	var UDao = require('../dao/UserDao.js');
	var UserDao = new UDao();
	var bcrypt = require('bcrypt');  
	var SALT = bcrypt.genSaltSync();
	var config = require('../config');

	this.registerUser = function(params, cb){

		if(!params.first_name
			|| !params.last_name
			|| !params.username
			|| !params.password
			|| !params.email){

			var result = {
				data: null,
				message: 'Invalid inputs.',
				isError: true,
				code: 400
			};
			
			throw result;
		}

		// Check if user already exists.
		UserDao.getUser('username', params.username, function(result){
			if(!result.data){
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

	this.loginUser = function(params, cb){
		// TODO: Implement
	}

	this.changePassword = function(params, cb){
		// TODO: Implement
	}

	this.deleteUser = function(params, cb){
		// TODO: Implement
	}
}

module.exports = UserService;
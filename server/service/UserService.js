'use strict';

function UserService(){
	var UserDao = require('../dao/UserDao.js');
	var bcrypt = require('bcrypt');  
	var SALT = bcrypt.genSaltSync();
	var jwt = require('jwt-simple');
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
				isError = true
			};

			throw result;
		}

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
}

module.exports = UserService;
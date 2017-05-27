'use strict';

var express = require('express');
var router = express.Router();

var UService = require('../service/UserService.js');
var UserService = new UService();
var ConnectionUtil = require('../util/connection-util.js');

router.post('/register_user', register_user);
router.post('/unregister_user', unregister_user);
router.post('/update_password', update_password);

function register_user(req, res){
	ConnectionUtil.setConnectionTimeout(0, req, function(){
		console.log("connection timed out.");
	});

	console.log("Registering user...");
	try{
		UserService.registerUser(req.body, function(result){
			if(result.isError){
				console.log(result.message);
				res.send500(result.message, result.data);
			}
			else{
				console.log("Finished registering user.");
				res.json(result);		
			}
		});
	}
	catch(err){
		if(err.code){
			console.log(err.message);
			eval("res.send" + [err.code] + "(err.message, err.data)");
		}
		else{
			console.log(err);
			res.send500("System error occurred.", err)
		}
	}
}

function unregister_user(req, res){
	ConnectionUtil.setConnectionTimeout(0, req, function(){
		console.log("connection timed out.");
	});

	console.log("Unregistering user...");
	try{
		UserService.unregisterUser(req.body, function(result){
			if(result.isError){
				console.log(result.message);
				res.send500(result.message, result.data);
			}
			else{
				console.log("Finished unregistering user.");
				res.json(result);		
			}
		});
	}
	catch(err){
		if(err.code){
			console.log(err.message);
			eval("res.send" + [err.code] + "(err.message, err.data)");
		}
		else{
			console.log(err);
			res.send500("System error occurred.", err)
		}
	}
}

function update_password(req, res){
	ConnectionUtil.setConnectionTimeout(0, req, function(){
		console.log("connection timed out.");
	});

	console.log("Updating password...");
	try{
		UserService.changePassword(req.body, function(result){
			if(result.isError){
				console.log(result.message);
				res.send500(result.message, result.data);
			}
			else{
				console.log("Finished changing password.")
				res.json(result);
			}
		});
	}
	catch(err){
		if(err.code){
			console.log(err.message);
			eval("res.send" + [err.code] + "(err.message, err.data)");
		}
		else{
			console.log(err);
			res.send500("System error occurred.", err)
		}
	}
}

module.exports = router;

'use strict';

var express = require('express');
var router = express.Router();

var UserService = require('../service/UserService.js');
var ConnectionUtil = require('../util/connection-util.js');

router.post('/register_user', register_user);
router.post('/unregister_user', unregister_user);
router.post('/update_password', update_password);

function register_user(req, res){

	ConnectionUtil.setConnectionTimeout(0, req, function(){
		console.log("connection timed out.");
	});

	// Fetch client ip.
	var ip = req.ip;

	console.log(ip + " ====> Registering user...");
	try{
		UserService.registerUser(req.body, function(result){
			if(result.isError){
				console.log(ip + " ====> " + result.message);
				eval('res.send' + result.responseType + '(result.message, result)');
			}
			else{
				console.log(ip + " ====> Finished registering user.");
				res.json(result);		
			}
		});
	}
	catch(err){
		console.log(ip + " ====> " + err);
		res.send500("System error occurred.", err)
	}
}

function unregister_user(req, res){
	ConnectionUtil.setConnectionTimeout(0, req, function(){
		console.log("connection timed out.");
	});

	// Fetch client ip.
	var ip = req.ip;

	console.log(ip + " ====> Unregistering user...");
	try{
		UserService.unregisterUser(req.body, function(result){
			if(result.isError){
				console.log(ip + " ====> " + result.message);
				eval('res.send' + result.responseType + '(result.message, result)');
			}
			else{
				console.log(ip + " ====> Finished unregistering user.");
				res.json(result);		
			}
		});
	}
	catch(err){
		console.log(ip + " ====> " + err);
		res.send500("System error occurred.", err);
	}
}

function update_password(req, res){
	ConnectionUtil.setConnectionTimeout(0, req, function(){
		console.log("connection timed out.");
	});

	// Fetch client ip.
	var ip = req.ip;

	console.log(ip + " ====> Updating password...");
	try{
		UserService.changePassword(req.body, function(result){
			if(result.isError){
				console.log(ip + " ====> " + result.message);
				eval('res.send' + result.responseType + '(result.message, result)');
			}
			else{
				console.log(ip + " ====> Finished changing password.")
				res.json(result);
			}
		});
	}
	catch(err){
		console.log(ip + " ====> " + err);
		res.send500("System error occurred.", err);
	}
}

module.exports = router;

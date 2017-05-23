'use strict';

var express = require('express');
var router = express.Router();

var UserService = require('../service/UserService.js');

var ConnectionUtil = require('../util/connection-util.js');

router.post('/register_user', registerUser);

function registerUser(req, res){
	ConnectionUtil.setConnectionTimeout(0, req, function(){
		console.log("connection timed out.");
	});

	UserService.registerUser(req.body, function(result){
		res.json(result);		
	});
}

module.exports = router;

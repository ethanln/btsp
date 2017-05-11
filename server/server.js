'use strict';

global.isUndefined = function(thing){
	return (typeof thing == "undefined");
}

// indexed connected users
var connected_users = {};

// intantiate security protocol
/*
var crypto = require('crypto');
var fs = require('fs');
var privateKey = fs.readFileSync('privatekey.pem').toString();
var certificate = fs.readFileSync('certificate.pem').toString();
var credentials = crypto.createCredentials({key: privateKey, cert: certificate});
*/

// instantiate app instance
var app = require('./app');
var http = require('http');
var config = require('./config');

var server = http.createServer(app);

// set security protocol.
//server.setSecure(credentials);

// run loop process
server.listen(parseInt(config.port));

// initialize event handlers
server.on('error', onError);
server.on('listening', onListen);
server.on('connection', onConnection);

function onError(error){
	if(error.syscall != 'listen'){
		throw error;
	}

	switch(error.code){
		case 'EACCES':
			console.error('Port ' + port + ' requires elevated priviledges');
			process.exit(1);
			break;

		case 'EADDRINUSE':
			console.error('Port ' + port + ' is already in use');
			process.exit(1);
			break;

		default:
			throw error;
	}
}

function onListen(){
	console.log('listening on port ' + server.address().port);
}

function onConnection(socket){
	socket._fd = socket.fd;
	connected_users[socket._fd] = socket.remoteAddress;

	console.log('User ' + connected_users[socket._fd] + ' has connected');

	socket.on('close', function(){
		console.log('User ' + connected_users[socket._fd] + ' has disconnected');
		delete connected_users[socket._fd];
	});
}

module.exports = app;
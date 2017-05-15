'use strict';

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config.js').persistent_config;
var app = express();

// set app main client directory.
app.use(express.static('../client/views'));

//instantiate customizeResponse object
app.use(require('./util/customizeResponse'));

//
var dbPath = config.connection_string;
mongoose.connect(dbPath);
app.connection = mongoose.connection;
app.connection.on('error', handleDBError);

// set up data object parser, will handle converting http body data into object instances.
var urlencode = {
	type : 'application/x-www-form-urlencoded',
	extended : true
};
app.use(bodyParser.urlencoded(urlencode));

// query all plugin dependencies
var plugins = require('./config.js').plugins;

// iterate all plugin dependencies
console.log('--loading plugins...');
Object.keys(plugins).forEach(function(element, key, _array){

	// for each plugin, query all controllers with their route components.
	var routes = require(plugins[element] + '/controller');
	routes = Object(routes);

	// store each route component as endpoint into express application.
	for(var key in routes){
		app.use(element, routes[key]);
	}
});
console.log('--plugins loaded.');

module.exports = app;

function handleDBError(err){
	console.log(err);
	console.log('Error connecting to DB. Is MongoDB running? Try "sudo service mongod start". If mongod is an unrecognized service, you will need to install MongoDB.');
}
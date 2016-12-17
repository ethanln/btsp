'use strict';

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();

// set app main client directory.
app.use(express.static("../client/views"));

// set up data object parser, will handle converting http body data into object instances.
var urlencode = {
	type : 'application/x-www-form-urlencoded',
	extended : true
};
app.use(bodyParser.urlencoded(urlencode));

// query all plugin dependencies
var plugins = require('../config.js').plugins;

// iterate all plugin dependencies
Object.keys(plugins).forEach(function(element, key, _array){

	// for each plugin, query all controllers with their route components.
	var routes = require(plugins[element]);
	routes = Object(routes);

	// store each route component as endpoint into express application.
	for(var key in routes){
		app.use(element, routes[key]);
	}
});

module.exports = app;
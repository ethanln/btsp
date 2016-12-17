'use strict';

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();
app.use(express.static("../client/views"));

var plugins = require('../config.js').plugins;

Object.keys(plugins).forEach(function(element, key, _array){
	console.log(element);
});
/*
app.get("/stuff", function(req, res){
	console.log("stuff");
});*/

module.exports = app;
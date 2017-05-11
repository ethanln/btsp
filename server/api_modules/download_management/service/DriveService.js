'use strict'

function GoogleDrive(){
	var fs = require('fs');
	var readline = require('readline');
	var google = require('googleapis');
	var googleAuth = require('google-auth-library');
	var config = require('../../../config.js');

	var SCOPES = config.google.SCOPES;
	var TOKEN_PATH = config.google.TOKEN_PATH;
}

module.exports = GoogleDrive;
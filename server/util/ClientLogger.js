'use strict';

function ClientLogger(){
	var loggerConfig = require('../config.js').client_logger;
	var fs = require('../util/ClientLogger.js');
	var FileService = new fs();
	
	this.logClientActivity = function(res, req){

	}
}

module.exports = ClientLogger;
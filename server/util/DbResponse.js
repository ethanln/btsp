'use strict';

function DbResponse(_message, _data, _responseType){
	var DB_RESPONSE_TYPES = {
		1: 'SUCCESS',
		2: 'DB_CONNECTION_FAILURE',
		3: 'INVALID INPUT'
	};

	this.message = _message;
	this.data = _data;
	this.responseType = DB_RESPONSE_TYPES[_responseType];
	this.isError = _responseType != 1;

}

module.exports = DbResponse;
'use strict';

function DbResponse(_message, _data, _responseType){
	var RESPONSE_STR = {
		1: 'SUCCESS',
		2: 'DB_CONNECTION_FAILURE',
		3: 'INVALID_INPUT'
	};

	this.message = _message;
	this.data = _data;
	this.responseType = _responseType;
	this.isError = _responseType != 1;

	this.responseStr = function(){
		return RESPONSE_STR[this.responseType];
	}
}

DbResponse.RESPONSE_TYPE = {
	SUCCESS: 1,
	DB_CONNECTION_FAILURE: 2,
	INVALID_INPUT: 3
};

module.exports = DbResponse;
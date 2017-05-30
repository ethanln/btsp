'use script';

function ServiceResponse(_message, _data, _responseType){
	var RESPONSE_STR = {
		200: 'SUCCESS',
		400: 'INVALID_INPUT',
		401: 'NOT_AUTHORIZED',
		404: 'NOT_FOUND',
		500: 'SYSTEM_ERROR'
	};

	this.message = _message;
	this.data = _data;
	this.responseType = _responseType;
	this.isError = _responseType != 200;

	this.responseStr = function(){
		return RESPONSE_STR[this.responseType];
	}
}

ServiceResponse.RESPONSE_TYPE = {
	SUCCESS: 200,
	INVALID_INPUT: 400,
	NOT_AUTHORIZED: 401,
	NOT_FOUND: 404,
	SYSTEM_ERROR: 500
};


module.exports = ServiceResponse;
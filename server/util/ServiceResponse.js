'use script';

function ServiceResponse(_message, _data, _code){
	this.message = _message;
	this.data = _data;
	this.code = _code;
	this.isError = _code !== 200;
}

module.exports = ServiceResponse;
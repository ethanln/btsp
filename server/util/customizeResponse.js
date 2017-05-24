'use strict';

module.exports = function customizeResponse (req, res, next){
	[400,401,403,404, 408, 500].forEach(function (code) {
		res['send'+code] = function sendCode (description, data) {
			this.status(code).send({
				code: code,
				descrption: description,
				data: data
			});
		}
	});
	next();
};
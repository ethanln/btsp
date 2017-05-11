
var config = {
	port : 8080,
	domain : 'localhost',
	plugins : {
		'/download_management' : './api_modules/download_management'
	},
	google:{
		SCOPES: [
			'https://www.googleapis.com/auth/drive.metadata.readonly'
		],
		TOKEN_PATH: '../../../cache.js'
	}
};

module.exports = config;
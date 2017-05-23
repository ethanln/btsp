
var config = {
	port : 8080,
	domain : 'localhost',
	plugins : {
		'/download_management' : '.'
	},
	audio_config: {
		url_src: "https://youtu.be/",
		url_video_output: "../video_output",
		url_audio_output: "../music_output"
	},
	persistent_config: {
		connection_string: "mongodb://localhost/btsp_db"
	}
};

module.exports = config;
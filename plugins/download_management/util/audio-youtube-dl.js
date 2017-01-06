'use strict'

var youtubedl = require('youtube-dl');
var BASE_URL = "https://youtu.be/";

var AudioYoutubeDL = {
	toMP3 : function (video_id, size, write_to_url){

		youtubedl.getInfo(BASE_URL + video_id, [], {maxBuffer:size}, function(err, info) {
			if(err){
				throw err;
			}
		});

		youtubedl.exec(BASE_URL + video_id, ['-x', '--audio-format', 'mp3'], {maxBuffer:size, cwd: '../music_output'}, function(err, output) {
		  if (err){
			throw err;
		  } 
		  console.log(output.join('\n'));
		});
	}
}

module.exports = AudioYoutubeDL;
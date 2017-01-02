'use strict'

var youtubedl = require('youtube-dl');
var fs = require('fs');
//var ffmpeg = require('ffmpeg');

var videoDownloader = {
	download : function (url, size, write_to_url){
		var video = youtubedl(url,
		  // Optional arguments passed to youtube-dl. 
		  ['--format=18'],
		  // Additional options can be given for calling `child_process.execFile()`. 
		  { cwd: __dirname, maxBuffer : size});
		 
		// Will be called when the download starts. 
		video.on('info', function(info) {
		  console.log('Download started');
		  console.log('filename: ' + info.filename);
		  console.log('size: ' + info.size);
		});

		video.on('end', function(e){
			console.log("finished");
			convert(write_to_url);
		});
		 
		video.pipe(fs.createWriteStream(write_to_url));
	}
}

var ffmpeg = require('fluent-ffmpeg');
var ffmpegPath = '';

if(process.platform === 'win32'){
    var ffmpegPath = './bin/ffmpeg/ffmpeg.exe';
}
else{
    var ffmpegPath = './bin/ffmpeg/ffmpeg';
}

//ffmpeg.setFfmpegPath(ffmpegPath);
/**
 *    input - string, path of input file
 *    output - string, path of output file
 *    callback - function, node-style callback fn (error, result)        
 */
function doConvert(input, output, callback) {
	
    ffmpeg(input)
        .output(output)
        .on('end', function() {                    
            console.log('conversion ended');
            callback(null);
        }).on('error', function(err){
            console.log('error: ', err);
            callback(err);
        }).run();
}

function convert(loc){
	console.log("converting " + loc + "...");
	doConvert('./stuff.mp4', './output.mp3', function(err){
	   if(!err) {
	       console.log('conversion complete');
	       //...
	   }
	   else{
	   	console.log("error");
	   }
	});
}

module.exports = videoDownloader;
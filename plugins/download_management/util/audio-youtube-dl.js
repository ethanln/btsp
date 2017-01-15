'use strict'

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

var youtubedl = require('youtube-dl');
var ffmpeg1 = require('ffmpeg');
var ffmpeg2 = require('fluent-ffmpeg');
var fs = require('fs');

var BASE_URL = "https://youtu.be/";
var VIDEO_OUTPUT_URL = '../video_output';
var AUDIO_OUTPUT_URL = '../music_output';

var AudioYoutubeDL = {
	toMP3 : function(video_id, size, time_interval, task_id, _filename, cb){
		console.log("Downloading...")
		var video = youtubedl(BASE_URL + video_id,
		  // Optional arguments passed to youtube-dl. 
		  ['--format=18'],
		  // Additional options can be given for calling `child_process.execFile()`. 
		  { cwd: VIDEO_OUTPUT_URL });

		// set filename, if one is provided.
		var filename = _filename ? _filename : null;
		console.log(filename);

		// Will be called when the download starts. 
		video.on('info', function(info) {
		  console.log('Downloading ' + info._filename + "...");
		  console.log('size: ' + info.size);
		  // set filename for audio if non is provided.
		  if(!filename){
		  	filename = info._filename.replace(".mp4", "");
		  	filename = filename.replace(/\W+/g, "_");
		  }
		});

		// Will be called when download finishes.
		video.on('end', function(){
			if(time_interval){
				// apply time interval to video
				applyTimeInterval(filename, task_id, time_interval, cb);
			}
			else{
				// start audio conversion.
				extractAudio(filename, task_id, cb);
			}
		});
		 
		// pipe video data stream to directory.
		video.pipe(fs.createWriteStream(VIDEO_OUTPUT_URL + '/out_' + task_id + '.mp4'));
	},
	readBytes : function(fileLoc){
		fs.open(fileLoc, 'r', function(status, fd) {
		    if (status) {
		        console.log(status.message);
		        return;
		    }
		    var buffer = new Buffer(100);
		    fs.read(fd, buffer, 0, 100, 0, function(err, num) {
		        console.log(buffer.toString('utf8', 0, num));
		        //for(var i = 0; i < num; i++){

		        //}
		    });
		});
	}
}

function applyTimeInterval(filename, task_id, time_interval, cb){
	console.log("Applying time interval...");

	try{
		ffmpeg2(VIDEO_OUTPUT_URL + '/out_' + task_id + '.mp4')
	    .setStartTime(time_interval[0])
	    .setDuration(time_interval[1])
	    .output(VIDEO_OUTPUT_URL + '/out_' + task_id + '_cut.mp4')

	    .on('end', function(err) {   
	        if(!err){
	          	console.log('Time interval extraction done.');

          		// delete old mp4 file.
	          	var filePath = VIDEO_OUTPUT_URL + '/out_' + task_id + '.mp4'; 
				fs.unlinkSync(filePath);

	          	// begin extracting audio.
	      		extractAudio(filename, task_id + '_cut', cb);
	        }                 
	    })
	    .on('error', function(err){
	        console.log('could not extract time interval.');

	    }).run();
	}
	catch(e){
		throw 'Time interval extraction failed.';
	}
}

function extractAudio(filename, task_id, cb){
	// i'll have to check first if the filename already exists, and if it does, change its name first.
	console.log("Extracting audio...");
	try {
		// load mp4 file
		var process = new ffmpeg1(VIDEO_OUTPUT_URL + '/out_' + task_id + '.mp4');
		process.then(function (video) {
			// Callback mode
			console.log("Saving audio file...")
			video.fnExtractSoundToMP3(AUDIO_OUTPUT_URL + '/' + filename, function (error, file) {
				
				if (!error){
					console.log('Audio file: ' + file + ' - download finished!');
				}
				else{
					console.log('Could not finish download for audio file: ' + file);
				}
				var filePath = VIDEO_OUTPUT_URL + '/out_' + task_id + '.mp4'; 
				fs.unlinkSync(filePath);

				cb(AUDIO_OUTPUT_URL + '/' + filename + ".mp3", filename + ".mp3");
			});
		}, 
		function (err) {
			console.log('Error occurred during download.');
			var filePath = VIDEO_OUTPUT_URL + '/out_' + task_id + '.mp4'; 
			fs.unlinkSync(filePath);
		});
	} 
	catch (e) {
		throw 'Audio conversion failed.';
	}
}

module.exports = AudioYoutubeDL;
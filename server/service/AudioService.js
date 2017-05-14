
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};


function AudioService(){
	/*
	* Private member variables.
	*/
	var youtubedl = require('youtube-dl');
	var ffmpeg1 = require('ffmpeg');
	var ffmpeg2 = require('fluent-ffmpeg');
	var fs = require('./FileService.js');
	var FileService = new fs();

	var audioConfig = require('../config').audio_config;
	
	var BASE_URL = audioConfig.url_src;
	var VIDEO_OUTPUT_URL = audioConfig.url_video_output;
	var AUDIO_OUTPUT_URL = audioConfig.url_audio_output;

	FileService.safeCreateDirectory(VIDEO_OUTPUT_URL);
	FileService.safeCreateDirectory(AUDIO_OUTPUT_URL);

	/**
	* Private methods.
	*/

	function applyTimeInterval(params, cb){
		console.log("Applying time interval... (" + params.time_interval[0] + " - " + params.time_interval[1] + ")");

		try{
			ffmpeg2(VIDEO_OUTPUT_URL + '/out_' + params.task_id + '.mp4')
		    .setStartTime(params.time_interval[0])
		    .setDuration(params.time_interval[1])
		    .output(VIDEO_OUTPUT_URL + '/out_' + params.task_id + '_cut.mp4')

		    .on('end', function(err) {   
		        if(!err){
		          	console.log('Time interval extraction done.');

	          		// delete old mp4 file.
		          	var filePath = VIDEO_OUTPUT_URL + '/out_' + params.task_id + '.mp4'; 
		          	FileService.safeDeleteFile(filePath);

		          	// begin extracting audio.
		          	params.task_id = params.task_id + '_cut';
		      		extractAudio(params, cb);
		        }                 
		    })
		    .on('error', function(err){
		    	// print result server side.
		    	var message = 'could not extract time interval.'
		        console.log(message);

		        // send back error.
		        cb('', '', message, true);

		    }).run();
		}
		catch(e){
			cb('', '', 'Time interval extraction failed.', true);
		}
	}

	function extractAudio(params, cb){
		// i'll have to check first if the filename already exists, and if it does, change its name first.
		console.log("Extracting audio...");
		try {
			// load mp4 file
			var process = new ffmpeg1(VIDEO_OUTPUT_URL + '/out_' + params.task_id + '.mp4');
			process.then(function (video) {
				// Callback mode
				console.log("Saving audio file...")

				// Destination srouce file.
				var dir = AUDIO_OUTPUT_URL + '/' + params.username;
				FileService.safeCreateDirectory(dir);
				var fileDestination = dir + '/' + params.filename;

				video.fnExtractSoundToMP3(fileDestination, function (error, file) {
					var message = '';
					var isError = false;

					if (!error){
						message = 'Audio file: ' + file + ' - download finished!';
					}
					else{
						message = 'Could not finish download for audio file: ' + file;
						isError = true;
					}
					// Safe delete mp4 file.
					var filePath = VIDEO_OUTPUT_URL + '/out_' + params.task_id + '.mp4'; 
					FileService.safeDeleteFile(filePath);

					// print result server side.
					console.log(message);

					// send back success result.
					cb(fileDestination + ".mp3", params.filename + ".mp3", isError);
				});
			}, 
			function (err) {
				// print result server side.
				var message = 'Error occurred during download.';
				console.log(message);

				// close connection to file source.
				var filePath = VIDEO_OUTPUT_URL + '/out_' + params.task_id + '.mp4'; 
				FileService.safeDeleteFile(filePath);

				// send back error.
				cb('', '', message, true);
			});
		} 
		catch (e) {
			cb('', '', 'Audio conversion failed.', true);
		}
	}

	/**
	* Public methods.
	*/
	this.toMP3 = function(params, cb){
		console.log("Downloading...")
		var video = youtubedl(BASE_URL + params.video_id, ['--format=18'], { cwd: VIDEO_OUTPUT_URL });

		// set filename, if one is provided.
		var filename = params.filename ? params.filename : null;

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
			params.filename = filename;
			if(params.time_interval){
				// apply time interval to video
				applyTimeInterval(params, cb);
			}
			else{
				// start audio conversion.
				extractAudio(params, cb);
			}
		});

		// pipe video data stream to directory.
		video.pipe(FileService.createOutStream(VIDEO_OUTPUT_URL + '/out_' + params.task_id + '.mp4'));
	}
}

module.exports = AudioService;
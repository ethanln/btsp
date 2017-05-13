'use strict';

var express = require('express');
var router = express.Router();

var time = require('../../../util/time-util.js');

var AudioService = require('../service/AudioService.js');

var connectionUtil = require('../../../util/connection-util.js')

router.post('/extract_audio', extractAudio);

function extractAudio(req, res){

	// Handle socket connection time out events.
	connectionUtil.setConnectionTimeout(0, req, function(){
		console.log("connection timed out");
	});

	var size = 300000 * 10000;

	if(!req.body.video_id){
		res.statusCode = 500;
		res.send("Could not download audio.");
	}

	var time_interval = null;
	if(req.body.startTime
		&& req.body.endTime){
		time_interval = [];
		time_interval[0] = time.getSeconds(req.body.startTime, req.body.endTime);
		time_interval[1] = time.getDeltaSeconds(req.body.startTime, req.body.endTime);
	}

	var audioService = new AudioService();

	try{
		var params = {
			video_id: req.body.video_id,
			size: size,
			time_interval: time_interval,
			task_id: '1',
			filename: req.body.filename,
			username: req.body.username
		};

		audioService.toMP3(params, function(fileLoc, filename, resultMessage, isError){
			if(!isError){
				res.statusCode = 200;
			}
			else{
				res.statusCode = 500;
			}

			res.json({
				filename: filename,
				fileLoc: fileLoc,
				resultMessage : resultMessage,
				isError: isError
			});
		});
		
	}
	catch(e){
		res.send500("Could not download audio");
	}
}

module.exports = router;
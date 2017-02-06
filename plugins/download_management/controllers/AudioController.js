'use strict';

var express = require('express');
var router = express.Router();

var time = require('../util/time.js');

var dl = require('../util/audio-youtube-dl.js');

var connectionUtil = require('../util/connection-util.js')

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

	try{
		//(video_id, size, time_interval, task_id, fileName) 
		dl.toMP3(req.body.video_id, size, time_interval, '1', req.body.filename, function(fileLoc, filename, resultMessage, isError){
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
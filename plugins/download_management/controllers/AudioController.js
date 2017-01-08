'use strict';

var express = require('express');
var router = express.Router();

var time = require('../util/time.js');

var dl = require('../util/audio-youtube-dl.js');

router.post('/extract_audio', extractAudio);

function extractAudio(req, res){

	var size = 300000 * 10000;

	console.log(req.body);
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

		console.log(time_interval[0]);
		console.log(time_interval[1]);
	}

	try{
		//(video_id, size, time_interval, task_id, fileName) 
		dl.toMP3(req.body.video_id, size, time_interval, '1', req.body.filename);
	}
	catch(e){
		res.statusCode = 500;
		res.send("Could not download audio.");
	}
}

module.exports = router;
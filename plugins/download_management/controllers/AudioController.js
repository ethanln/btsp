'use strict';

var express = require('express');
var router = express.Router();

var dl = require('../util/audio-youtube-dl.js');

router.post('/extract_audio', extractAudio);

function extractAudio(req, res){

	var size = 300000 * 10000;
	var loc = "stuff.mp4";
	console.log(req.body);
	if(!req.body.video_id){
		res.statusCode = 500;
		res.send("Could not download audio.");
	}

	try{
		dl.toMP3(req.body.video_id, size, loc);
	}
	catch(e){
		res.statusCode = 500;
		res.send("Could not download audio.");
	}
}

module.exports = router;
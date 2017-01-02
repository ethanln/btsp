'use strict';

var express = require('express');
var router = express.Router();

var dl = require('../util/video-dl.js');

router.post('/extract_audio', extractAudio);

function extractAudio(req, res){
	var url = 'https://youtu.be/Hjp5GXMuvMs';
	var size = 5000 * 5000;
	var loc = "stuff.mp4";
	dl.download(url, size, loc);
}

module.exports = router;
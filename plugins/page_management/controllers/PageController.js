'use strict';

var express = require('express');
var router = express.Router();

router.post("/create_page", CreatePage);
router.post("/delete_page", DeletePage);
router.get("/get_page_directory", GetPageDirectory);

function CreatePage(req, res){
	console.log("Create Page");
}

function DeletePage(req, res){
	console.log("Delete Page");
}

function GetPageDirectory(req, res){
	console.log("Get Page Directory");
}

module.exports = router;
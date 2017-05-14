'use strict'

function FileService(){
	var fs = require('fs');

	/**
	* Safely create directory.
	*/
	this.safeCreateDirectory = function(directory){
		var directoryTokens = directory.split('/');
		var dir = "";
		for(var i in directoryTokens){
			dir += directoryTokens[i];
			if(directoryTokens[i] == '..' || directoryTokens[i] == '.'){
				dir += '/';
				continue;
			}

			try{
				fs.statSync(dir);
			}
			catch(err){
				fs.mkdirSync(dir);
			}

			if(i < directoryTokens.length - 1){
				dir += "/";
			}
		}
	}

	this.readBytes = function(fileLoc){
		fs.open(fileLoc, 'r', function(status, fd) {
		    if (status) {
		        console.log(status.message);
		        return;
		    }
		    var buffer = new Buffer(100);
		    fs.read(fd, buffer, 0, 100, 0, function(err, num) {
		        console.log(buffer.toString('utf8', 0, num));
		    });
		});
	}

	this.safeDeleteFile = function(fileLoc){
		try{
			fs.unlinkSync(fileLoc);
		}
		catch(err){
			console.log("File to-be-delted does not exist " + fileLoc);
		}
	}

	this.createOutStream = function(fileLoc){
		try{
			return fs.createWriteStream(fileLoc);
		}
		catch(err){
			return fs.createWriteStream('');
		}
	}
}

module.exports = FileService;
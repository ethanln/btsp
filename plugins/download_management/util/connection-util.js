'use strict';

var connectionUtility = {
	setConnectionTimeout : function(timeout, req, cb){
		req.socket.setTimeout(timeout, function(){
			cb();
		});
	}
};

module.exports = connectionUtility;

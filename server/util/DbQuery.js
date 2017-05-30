'use strict';

function DbQuery(query){
	if(query){
		this.query = query;
	}
	else{
		this.query = {};
	}

	this.addQuery = function(key, value){
		this.query[key] = value;
	}
}

module.exports = DbQuery;
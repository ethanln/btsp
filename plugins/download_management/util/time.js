'use strict';

var timeConverter = {
	getDeltaSeconds: function(time1, time2){
		var timeOne = time1.split(":");
		var timeTwo = time2.split(":");

		var hours = Math.abs(timeOne[0] - timeTwo[0]);
		var min = Math.abs(timeOne[1] - timeTwo[1]);
		var sec = Math.abs(timeOne[2] - timeTwo[2]);

		console.log("hours: " + hours);
		console.log("min: " + min);
		console.log("sec: " + sec);

		return (hours * 60 * 60) + (min * 60) + sec;
	},
	getSeconds: function(time){
		var timeTokens = time.split(":");

		var hours = Math.abs(timeTokens[0]);
		var min = Math.abs(timeTokens[1]);
		var sec = Math.abs(timeTokens[2]);

		return (hours * 60 * 60) + (min * 60) + sec;
	}
}

module.exports = timeConverter;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SessionSchema = new Schema({
	token_id: String,
	session_id: String,
	date_submission: Date,
	is_expired: Boolean,
	user_id: int
});

module.exports = mongoose.model('Session', SessionSchema);
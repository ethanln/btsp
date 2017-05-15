var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	first_name: String,
	last_name: String,
	username: String,
	password: String,
	email: String
});

module.exports = mongoose.model('User', userSchema);
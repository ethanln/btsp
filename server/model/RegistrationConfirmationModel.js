var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RegistrationConfirmationSchema = new Schema({
	first_name: String,
	last_name: String,
	username: String,
	password: String,
	email: String,
	confirmation_id: String
});

module.exports = mongoose.model('RegistrationConfirmation', RegistrationConfirmationSchema);
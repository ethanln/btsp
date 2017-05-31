var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PasswordUpdateConfirmationSchema = new Schema({
	user_id: String,
	password: String,
	confirmation_id: String
});

module.exports = mongoose.model('PasswordUpdateConfirmation', PasswordUpdateConfirmationSchema);
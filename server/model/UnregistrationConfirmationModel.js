var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UnregistrationConfirmationSchema = new Schema({
	user_id: String,
	confirmation_id: String
});

module.exports = mongoose.model('UnregistrationConfirmation', UnregistrationConfirmationSchema);
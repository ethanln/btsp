var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConfirmationSchema = new Schema({
	confirmation_id: String,
	time_stamp: Date,
	is_confirmed: Boolean
});

module.exports = mongoose.model('Confirmation', ConfirmationSchema);
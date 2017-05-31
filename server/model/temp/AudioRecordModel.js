var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AudioRecordSchema = new Schema({
    user_id: int,
    audio_src: String
});

module.exports = mongoose.model('AudioRecord', AudioRecordSchema);
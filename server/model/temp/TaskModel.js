var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var TaskSchema = new Schema({
    task_id: int,
    task_type: String,
    task_data: Object,
    submit_date: Date
});

module.exports = mongoose.model('Task', TaskSchema);

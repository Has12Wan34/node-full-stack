const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    type: String,
    text: String,
    groupId: String,
    userId: String
});

const MessageModel = mongoose.model('Message', messageSchema);

module.exports = MessageModel;
const { Schema } = require('mongoose')

const ChatHistorySchema = new Schema({

})

const ChatHistory = mongoose.model("ChatHistory",ChatHistorySchema);
module.exports = ChatHistory;
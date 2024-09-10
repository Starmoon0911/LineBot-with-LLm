const mongoose = require('mongoose');
const { Schema } = mongoose;

const ChatHistorySchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    message: {
        human: {
            message: { type: String, required: true }
        },
        model: {
            message: { type: String, required: true },
            functionCall: { 
                type: Map, // Using Map to handle arbitrary function call objects
                of: Schema.Types.Mixed
            }
        }
    }
});

const ChatHistory = mongoose.model('ChatHistory', ChatHistorySchema);
module.exports = ChatHistory;

const mongoose = require('mongoose')
const { Schema } = require('mongoose');

const ChatHistorySchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    messages: [
        {
            human: {
                message: {
                    type: String,
                    required: true
                }
            },
            model: {
                message: {
                    type: String,
                    required: true
                },
                props: {
                    type: Schema.Types.Mixed,  // 可混合任何類型
                    default: null              // 當沒有 function_call 時為 null
                }
            }
        }
    ]
});

module.exports = mongoose.model("ChatHistory", ChatHistorySchema);


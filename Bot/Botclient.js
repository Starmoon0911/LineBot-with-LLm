require('dotenv').config();
const line = require('@line/bot-sdk');
const AI = require('../agent/AIEngine');
const createConnection = require('../database/mongodb');
const ChatHistory = require('../database/schemas/ChatHistory.model')
class BotClient extends line.Client {
    constructor() {
        super({
            channelId: process.env.LINE_CHANNEL_ACCESS_TOKEN,
            channelSecret: process.env.LINE_CHANNEL_SECRET,
            channelAccessToken: process.env.channelAccessToken
        });

        /**
         * @type {import('@Agent/AIEngine')}
         */
        this.AI = new AI({
            gemini_api_key: process.env.API_KEY
        });
        this.mongodb = createConnection({ url:process.env.MONGODB_URL })
    }

}

module.exports = BotClient;

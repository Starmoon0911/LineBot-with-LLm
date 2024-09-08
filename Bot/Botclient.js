require('dotenv').config();
const line = require('@line/bot-sdk');
const AI = require('../agent/AIEngine');
const createConnection = require('../database/mongodb');
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
    }

}

module.exports = BotClient;

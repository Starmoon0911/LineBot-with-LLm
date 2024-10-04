require('dotenv').config();
const AI = require('../agent/AIEngine')
/**
        * @type {import('@Agent/AIEngine')}
        */


async function run() {
    client = new AI({
        gemini_api_key: process.env.API_KEY
    });
    await client.initializeAgent();

    const response = await client.sendMessage('幫我查詢一下南投市中心附近的一般藥局有哪些','nm')
    console.log(response);
}

run()
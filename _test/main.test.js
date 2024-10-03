require('dotenv').config();
const AI = require('../agent/AIEngine')
const aiInstance = new AI({ gemini_api_key: process.env.API_KEY });

aiInstance.sendMessage('What is 3 * 12', '用戶ID').then(response => {
    console.log(response);
}).catch(err => {
    console.error(err);
});
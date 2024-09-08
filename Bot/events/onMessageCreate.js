require('dotenv').config();
const { handleCommandEvent } = require('./onCommandCreate.js');
const path = require('node:path');

const HandleMessageEvent = (event, client) => {

    if (event.type === 'message' && event.message.type === 'text') {
        const text = event.message.text;
        const prefix = (process.env.prefix || '/').trim();
        /**
         * 檢查有沒有前綴，來判斷是指令還是普通訊息
         * @type {import '@Handler/CommandHandler.js'}
         * 
        */
        if(text.startsWith(prefix)) handleCommandEvent(event, client);


    }
}
module.exports = HandleMessageEvent;
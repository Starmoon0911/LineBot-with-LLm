require('dotenv').config();
const { handleCommandEvent } = require('./onCommandCreate.js');
const path = require('node:path');
const processAudio = require('../handler/VoiceHandler.js');
const handleTextMessage = require('../handler/TextMessage.js')
const HandleMessageEvent = async (event, client) => {
    const replyToken = event.replyToken;
    // 處理音訊
    if (event.type === 'message' && event.message.type === 'audio') {
        console.log('Processing audio');
        try {
            const audioSaved = await processAudio(event, client);
            console.log('Audio saved response:', audioSaved);
            await handleTextMessage(audioSaved.text, event.source.userId, client, replyToken)
        } catch (error) {
            console.error('Error processing audio:', error);
        }
    }

    /**
     * 處理文字輸入
     */
    if (event.type === 'message' && event.message.type === 'text') {
        const text = event.message.text;
        const prefix = (process.env.prefix || '/').trim();


        /**
         * 檢查有沒有前綴，來判斷是指令還是普通訊息
         * @type {import '@Handler/CommandHandler.js'}
         */
        if (text.startsWith(prefix)) {
            return handleCommandEvent(event, client);
        }

        // 調用新的處理函數來處理文本消息
        await handleTextMessage(text, event.source.userId, client, replyToken);
    }
};

module.exports = HandleMessageEvent;
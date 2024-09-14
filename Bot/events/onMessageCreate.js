require('dotenv').config();
const { handleCommandEvent } = require('./onCommandCreate.js');
const path = require('node:path');

const HandleMessageEvent = async (event, client) => {
    /**
     * 處理文字輸入
     */

    if (event.type === 'message' && event.message.type === 'text') {
        const text = event.message.text;
        const prefix = (process.env.prefix || '/').trim();
        const replyToken = event.replyToken;
        /**
         * 檢查有沒有前綴，來判斷是指令還是普通訊息
         * @type {import '@Handler/CommandHandler.js'}
         * 
        */
        if (text.startsWith(prefix)) return handleCommandEvent(event, client);
        try {
            const raw_response = await client.AI.sendMessage(text, event.source.userId);

            const response = raw_response?.content?.replace(/```json\n|\n```/g, '');
            const JsonResponse = JSON.parse(response)
            const responseContent = JsonResponse.response
                console.log(responseContent)
            // 構建符合 LINE API 格式的回應訊息
            await client.replyMessage(replyToken, [{
                type: 'text',
                text: responseContent
            }]);


        } catch (error) {
            console.error('Error:', error);
            return await client.replyMessage(replyToken, {
                type: 'text',
                text: '發生錯誤，請稍後再試'
            });
        }

    }
}
module.exports = HandleMessageEvent;
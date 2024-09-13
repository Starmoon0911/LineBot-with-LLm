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
            // 提取 AIMessage 中的 content 屬性，它是包含 JSON 字串的部分
            const content = raw_response.content;
            const clean_response = content
                .replace(/```json/g, '')
                .replace(/```/g, '').trim();
            // 將清理後的內容解析為 JSON 對象
            const parsed_response = JSON.parse(clean_response);

            // 提取 response 內的 content
            const responseContent = parsed_response?.res_msg?.content;
            if (!responseContent) {
                return await client.replyMessage(replyToken, {
                    type: 'text',
                    text: '無法取得有效的回應，請重試'
                });
            }

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
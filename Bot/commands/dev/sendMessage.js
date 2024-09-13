const fs = require('fs');

module.exports = {
    name: 'say',
    async execute(args, client, replyToken) {
        try {
            console.log(args);

            // 檢查是否提供了有效的參數
            if (!args[0]) {
                return await client.replyMessage(replyToken, {
                    type: 'text',
                    text: '請輸入要求回復的內容'
                });
            }

            // 呼叫 AI 模型取得回應
            const raw_response = await client.AI.sendMessage(args[0]);
            console.log('Raw Response:', raw_response);

            // 提取 AIMessage 中的 content 屬性，它是包含 JSON 字串的部分
            const content = raw_response.content;
            console.log('Content:', content);
 
            // 移除多餘的 ```json 和 ``` 標籤，並將其轉換為有效的 JSON 字串
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
};

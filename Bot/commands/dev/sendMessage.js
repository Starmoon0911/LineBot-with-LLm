const fs = require('fs');

module.exports = {
    name: 'say',
    async execute(args, client, replyToken) {
        try {
            console.log(args);
            if (args[0] === '' || args[0] === undefined) {
                return await client.replyMessage(replyToken, {
                    type: 'text',
                    text: '請輸入要求回復的內容'
                });
            }

            // 呼叫 AI 模型取得回應
            const response = await client.AI.sendMessage(args[0]);

            console.log(replyToken, response.content);
            /**
             * 構建符合 LINE API 格式的回應訊息
             * @param {object} 
             */
            await client.replyMessage(replyToken, [{
                type: 'text',
                text: response.content
            }]);
        } catch (error) {
            console.log(error);
            return;
        }
    }
};

// 新的函數來處理文本消息
const handleTextMessage = async (text, userId, client, replyToken) => {
    try {
        // 發送消息並獲取響應
        const raw_response = await client.AI.sendMessage(text, userId);

        // 解析響應內容
        const response = raw_response?.content?.replace(/```json\n|\n```/g, '');
        const JsonResponse = JSON.parse(response);
        const responseContent = JsonResponse.response;

        console.log(responseContent);

        // 構建符合 LINE API 格式的回應訊息
        await client.replyMessage(replyToken, [{
            type: 'text',
            text: responseContent
        }]);

    } catch (error) {
        console.error('Error:', error);
        await client.replyMessage(replyToken, {
            type: 'text',
            text: '發生錯誤，請稍後再試'
        });
    }
};

module.exports = handleTextMessage;
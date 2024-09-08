// commands/hello.js
module.exports = {
    name: 'hello',
    async execute(args, client, replyToken) {
        const responseText = '你好！這是來自 Hello 命令的回應。';  
        await client.replyMessage(replyToken, {
          type: 'text',
          text: responseText,
        });
      }
  };
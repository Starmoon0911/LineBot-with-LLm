require('dotenv').config();
const CommandHandler = require('../handler/CommandHandler');
const path = require('node:path');
const fs = require('fs');
let commandModules = null;

async function getCommands() {
  if (commandModules) {
    return commandModules;
  }

  // 獲取所有 .js 文件的路徑
  const files = await CommandHandler(path.resolve(__dirname, '../commands'));

  // 將每個 .js 文件動態載入為模組
  commandModules = {};
  for (const file of files) {
    const commandName = path.basename(file, '.js'); // 使用文件名作為命令名
    try {
      const commandModule = require(file);
      commandModules[commandModule.name] = commandModule; // Use `name` as key
    } catch (err) {
      console.error(`無法加載命令模組 ${file}: ${err.message}`);
    }
  }

  return commandModules;
}

async function handleCommandEvent(event, client) {
  if (event.type === 'message' && event.message.type === 'text') {
    const replyToken = event.replyToken;

   
    const text = event.message.text;
    const prefix = (process.env.prefix || '/').trim();
    // 去掉命令前綴
    const commandName = text.replace(prefix, '').split(' ')[0];
    const args = text.slice(prefix.length + commandName.length).trim().split(' '); // 提取命令參數
    // 確保命令模組已經加載
    const commands = await getCommands();
    // 根據 `name` 查找命令
    const command = Object.values(commands).find(cmd => cmd.name === commandName);
    if (command) {
      await command.execute(args, client, replyToken);
    } else {
      await client.pushMessage(event.source.userId, {
        type: 'text',
        text: `未知的命令: ${text}`,
      });
    }
  }
}

module.exports = {
  handleCommandEvent,
};

require('dotenv').config();
const CommandHandler = require('../handler/CommandHandler');
const path = require('node:path');
const fs = require('fs');
let commandModules = null;

/**
 * 獲取所有命令模組並將其動態載入。
 * 首先會檢查是否已經存在命令模組，如果存在，則直接返回。
 * 否則，會獲取所有 .js 檔案的路徑，然後將每個 .js 檔案動態載入為模組。
 * 將每個模組的 `name` 作為鍵，儲存在 `commandModules` 對象中。
 *
 * @returns {Promise<Object>} 包含所有命令模組的對象。
 */
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


/**
 * 處理命令事件並執行相關的命令。
 * 當接收到一條文字訊息時，會檢查其是否為命令，如果是，則執行相應的命令。
 *
 * @param {Object} event - 事件物件，包含訊息內容和來源等資訊。
 * @param {Object} client - 聊天機器人用戶端，用於發送回應訊息。
 *
 * @returns {Promise<void>} 無返回值。
 */
async function handleCommandEvent(event, client) {
  if (event.type === 'message' && event.message.type === 'text') {
    const replyToken = event.replyToken;

    // 取得訊息文字內容
    const text = event.message.text;
    // 取得命令前綴，如果未設置，則使用預設的 '/'
    const prefix = (process.env.prefix || '/').trim();
    // 去掉命令前綴，並取得命令名稱
    const commandName = text.replace(prefix, '').split(' ')[0];
    // 提取命令參數
    const args = text.slice(prefix.length + commandName.length).trim().split(' ');
    // 確保命令模組已經加載
    const commands = await getCommands();
    // 根據 `name` 查找命令
    const command = Object.values(commands).find(cmd => cmd.name === commandName);
    if (command) {
      // 執行找到的命令
      await command.execute(args, client, replyToken);
    } else {
      // 如果找不到命令，則發送錯誤訊息
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

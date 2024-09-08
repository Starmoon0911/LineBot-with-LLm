const fs = require('node:fs');
const path = require('node:path');

// 將 fs.readdir 包裝成一個 Promise 函數
const readDirAsync = (dirPath) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
      if (err) {
        return reject(err);
      }
      resolve(files);
    });
  });
};

// 這個函數遞迴遍歷指定路徑，並將所有 .js 文件的路徑推送到 index 陣列
const CommandHandler = async (directoryPath) => {
  const index = [];
  try {
    const files = await readDirAsync(directoryPath);
    // 遍歷目錄中的每個項目
    for (const file of files) {
      const fullPath = path.resolve(directoryPath, file.name);
      if (file.isDirectory()) {
        // 如果是子目錄，則遞迴處理
        const subDirFiles = await CommandHandler(fullPath);
        index.push(...subDirFiles);
      } else if (file.isFile() && path.extname(file.name) === '.js') {
        // 如果是 .js 文件，則將其路徑推送到 index 陣列
        index.push(fullPath);
      }
    }
  } catch (err) {
    console.error(`無法處理目錄 ${directoryPath}: ${err.message}`);
  }
  return index;

};

module.exports = CommandHandler;

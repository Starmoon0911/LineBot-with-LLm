require('dotenv').config();
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data'); // 引入 form-data 模塊

// 假設 Flask API 的 URL
const FLASK_API_URL = process.env.FLASK_API_URL ? process.env.FLASK_API_URL + '/whisper' : 'http://127.0.0.1:5000/whisper';

const processAudio = async (event, client) => {
    // 取得音訊檔案流
    const audioStream = await client.getMessageContent(event.message.id);

    // 保存音訊檔案到臨時文件
    const tempFilePath = path.join(__dirname, '../../_AudioTemp', `${event.message.id}.wav`);
    const writeStream = fs.createWriteStream(tempFilePath);

    return new Promise((resolve, reject) => {
        audioStream.pipe(writeStream);

        writeStream.on('finish', async () => {
            try {
                // 確保文件讀取完成
                const formData = new FormData();
                formData.append('file', fs.createReadStream(tempFilePath)); // 使用 createReadStream 而不是 readFileSync

                // 發送 POST 請求
                const response = await axios.post(FLASK_API_URL, formData, {
                    headers: {
                        ...formData.getHeaders(), // 使用 form-data 的 headers
                        'Content-Type': 'multipart/form-data'
                    }
                });

                // 刪除臨時文件
                fs.unlink(tempFilePath, (err) => {
                    if (err) {
                        console.error('Error deleting temp file:', err);
                    }
                });

                // 回傳 API 響應
                resolve(response.data);
            } catch (error) {
                // 刪除臨時文件
                fs.unlink(tempFilePath, (err) => {
                    if (err) {
                        console.error('Error deleting temp file:', err);
                    }
                });

                console.error('Error processing audio:', error);
                reject({ success: false, message: error.message });
            }
        });

        writeStream.on('error', (error) => {
            console.error('Error writing temp file:', error);
            reject({ success: false, message: error.message });
        });
    });
};

module.exports = processAudio;

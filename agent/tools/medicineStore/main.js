//https://data.nantou.gov.tw/dataset/690fb4db-088c-4b1d-a944-5bb3aa4374a6/resource/b234e2cd-6a4e-46aa-9a49-d81a4ae1dca2/download/11.csv

const axios = require('axios');
const csv = require('csv-parser');
const { Readable } = require('stream');
const { DynamicTool } = require('@langchain/core/tools');

// 定義 restaurantTool
const medicineTool = new DynamicTool({
    name: 'restaurantTool',
    description: '這個工具能查詢南投縣高齡友善藥局.',
    func: async () => {
        const csvUrl = 'https://data.nantou.gov.tw/dataset/690fb4db-088c-4b1d-a944-5bb3aa4374a6/resource/b234e2cd-6a4e-46aa-9a49-d81a4ae1dca2/download/11.csv';
        const results = [];

        try {
            // 下載 CSV 檔案
            const response = await axios.get(csvUrl, { responseType: 'arraybuffer' });
            const csvData = response.data.toString('utf-8');

            // 使用 csv-parser 轉換 CSV 為 JSON
            const stream = Readable.from(csvData.split('\n'));

            return new Promise((resolve, reject) => {
                stream
                    .pipe(csv())
                    .on('data', (data) => results.push(data))
                    .on('end', () => {
                        // 將結果轉換為 JSON 字串
                        const jsonString = JSON.stringify(results);
                        resolve(jsonString);
                    })
                    .on('error', (error) => {
                        reject(`CSV parsing error: ${error.message}`);
                    });
            });
        } catch (error) {
            console.error('Error:', error.message);
            throw new Error(`Failed to fetch or parse CSV: ${error.message}`);
        }
    }
});

// 將工具導出
module.exports = medicineTool;

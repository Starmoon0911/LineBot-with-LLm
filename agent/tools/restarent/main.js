const axios = require('axios');
const csv = require('csv-parser');
const { Readable } = require('stream');
const { DynamicTool } = require('@langchain/core/tools');

// 定義 restaurantTool
const restaurantTool = new DynamicTool({
    name: 'restaurantTool',
    description: '這個工具能查詢南投縣高齡友善餐廳在哪.',
    func: async () => {
        const csvUrl = 'https://data.nantou.gov.tw/dataset/c9fa664a-a9f8-4471-927b-dfd7b09743d9/resource/c949f4a7-682f-4a20-a97d-b2875ab1d052/download/cuserspil3388pil3388desktop27.csv';
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
module.exports = restaurantTool;

require('dotenv').config();
const Weather = require('../agent/tools/Weather/client');

const client = new Weather(process.env.weather_api_key);
 // 計算明天的時間
 const tomorrow = new Date();
 tomorrow.setDate(tomorrow.getDate() + 1);
 const startTime = tomorrow.toISOString().split('T')[0] + ' 00:00:00';
 const endTime = tomorrow.toISOString().split('T')[0] + ' 23:59:59';
client.get7daysWeather('南投市')
    .then((weather) => {
        // 使用 JSON.stringify 將回傳的資料轉換成可讀的字串，縮排 2 格
        console.log(weather);
    })
    .catch((error) => {
        console.error("Error fetching weather data:", error);
    });

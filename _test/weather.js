require('dotenv').config();
const Weather = require('../agent/tools/Weather/client');

const client = new Weather(process.env.weather_api_key);

client.get7daysWeather('南投市')
    .then((weather) => {
        // 使用 JSON.stringify 將回傳的資料轉換成可讀的字串，縮排 2 格
        console.log(JSON.stringify(weather.records, null, 2));
    })
    .catch((error) => {
        console.error("Error fetching weather data:", error);
    });

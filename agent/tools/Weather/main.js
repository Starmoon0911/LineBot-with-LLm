require('dotenv').config();
const Weather = require('./client.js');
const client = new Weather(process.env.weather_api_key);
const { DynamicStructuredTool } = require('@langchain/core/tools');
const WeatherSchema = require('./schema.js');
const WeatherTool = new DynamicStructuredTool({
    name: 'Weather',
    description: '這個工具能查詢今天和明天的天氣，並且以json格式回傳',
    schema: WeatherSchema,
    func: async ({ location }) => {
        try {
            const weather = await client.get7daysWeather(location);
            console.log(JSON.stringify(weather.weatherData))
            return JSON.stringify(weather.weatherData); // 確保返回正確的結果
        } catch (error) {
            console.error("Error fetching weather data:", error);
            throw new Error("Failed to fetch weather data");
        }
    }
});


module.exports = WeatherTool;

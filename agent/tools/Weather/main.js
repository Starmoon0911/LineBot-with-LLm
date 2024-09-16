require('dotenv').config()
const Weather = require('./client.js');
const client = new Weather(process.env.weather_api_key)
const { DynamicStructuredTool } = require('@langchain/core/tools')
const WeatherSchema = require('./schema.js')

const WeatherTool = new DynamicStructuredTool({
    name: 'Weather',
    description: '一個可以取得天氣的工具',
    schema: WeatherSchema,
    func: async ({ location }) => {
        const weatherData = await client.get7daysWeather(location);
        return `${weatherData}`
    },
})

module.exports = WeatherTool;
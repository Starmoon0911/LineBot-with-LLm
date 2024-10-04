const { default: axios } = require("axios");
require('dotenv').config();
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai')
class Weather {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.init()
    }
    async init() {
        this.llm = new ChatGoogleGenerativeAI({
            model: 'gemini-1.5-pro',
            temperature: 1.0,
            apiKey: process.env.API_KEY
        })
    }
    async invoke(input) {
        const aiMsg = await this.llm.invoke([
            [
                "system",
                "使用簡單易懂的語言，避免專業術語。說明每個時間段的天氣狀況、降雨機率、氣溫範圍、風速和濕度。強調天氣對日常生活的影響，比如出門的建議。使用親切的語氣，讓內容感覺友好和溫暖。"
            ],
            [
                "human",
                `${input}`
            ]
        ])
        return aiMsg.content;
    }

    async get7daysWeather({ location = '南投市' }) {
        const _format = 'JSON';
        const _location = location;
        const requestURL = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-D0047-023?Authorization=${this.apiKey}&format=${_format}&locationName=${_location}&elementName=WeatherDescription`;

        try {
            const response = await axios.get(requestURL);
            // 確認資料是否成功取得
            if (response.data.success === 'true') {
                // 提取 weatherElement -> time -> elementValue
                const weatherData = response.data.records.locations[0].location[0].weatherElement[0].time.map(t => {
                    return {
                        startTime: t.startTime,
                        endTime: t.endTime,
                        elementValue: t.elementValue[0].value
                    };
                });
                const formtedWeather = await this.invoke(JSON.stringify(weatherData))
                // 只返回前兩筆資料
                return {
                    success: true,
                    weatherData: formtedWeather
                };
            }
            return { success: false, message: response.data.message };
        } catch (error) {
            console.error("Error fetching weather data:", error);
            throw error; // 將錯誤拋出，讓呼叫方處理
        }
    }
}

module.exports = Weather;

const { default: axios } = require("axios");

class Weather {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    async get7daysWeather({ localtion = '南投市' }) {
        const _format = 'JSON';
        const _localtion = localtion;
        const requestURL = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-D0047-023?Authorization=${this.apiKey}&format=${_format}&locationName=${_localtion}&elementName=WeatherDescription`;

        try {
            const response = await axios.get(requestURL);
            // 假設 API 回傳的資料在 response.data 中
            if (response.data.success === 'true') return response.data;
            return { success: false, message: response.message }
        } catch (error) {
            console.error("Error fetching weather data:", error);
            throw error; // 將錯誤拋出，讓呼叫方處理
        }
    }
}

module.exports = Weather;

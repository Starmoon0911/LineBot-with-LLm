const { default: axios } = require("axios");

class Weather {
    constructor(apiKey) {
        this.apiKey = apiKey;
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

                // 只返回前兩筆資料
                return {
                    success: true,
                    weatherData: weatherData.slice(0, 2) // 取前兩筆
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

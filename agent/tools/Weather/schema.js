const { z } = require('zod');

// 定義有效的地點名稱（可根據實際需求調整）
const validLocations = [
    '南投市', '埔里鎮', '草屯鎮', '竹山鎮',
    '集集鎮', '名間鄉', '中寮鄉', '鹿谷鄉',
    '水里鄉', '魚池鄉', '國姓鄉', '信義鄉', '仁愛鄉'
];

// 整體天氣資料的結構
const WeatherSchema = z.object({
    location: z.enum(validLocations).describe('要查詢的地方名稱，必須為其一'),
});

module.exports = WeatherSchema;

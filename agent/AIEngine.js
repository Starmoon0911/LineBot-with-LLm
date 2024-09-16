require('dotenv').config();
const { HarmBlockThreshold, HarmCategory } = require('@google/generative-ai')
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { HumanMessage, SystemMessage } = require('@langchain/core/messages');
const prompt = require('./SystemPrompt/index');
const ChatHistory = require('../database/schemas/ChatHistory.model')
const WeatherTool = require('./tools/Weather/main')
class AI {
    constructor(options) {
        if (options?.gemini_api_key === undefined || options?.gemini_api_key === null) {
            throw new Error("Gemini API key is required");
        }
        if (typeof options.gemini_api_key !== "string") {
            throw new Error("Gemini API key must be a string");
        }
        /**
         * 創建新的gemoni API
         */
        this.gemini = new ChatGoogleGenerativeAI({
            model: "gemini-1.5-flash",
            apiKey: options.gemini_api_key,
            safetySettings: [
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH
                }
            ],
            tools:[WeatherTool]
        });
        /**
         * 定義一個空的指定回復訊息，之後可以直接調用
         */
        this.res_msg = { userId: '', message: null }
        this.status = 'processing'
        this.getResponseWithTools = this.gemini.bindTools([
            WeatherTool
        ])
    }
    async saveChat(userId, HumanMessage, AiResponse, function_call) {

        try {
            const newChat = new ChatHistory({
                userId: userId,
                messages: [{
                    human: {
                        message: HumanMessage
                    },
                    model: {
                        message: AiResponse,
                        function_call: function_call
                    }
                }]
            })
            await newChat.save();
            console.log('成功保存臨時對話紀錄')
        } catch (error) {
            console.error('Error saving chat:', error);
        }
    }
    async getChatHistory(userId) {
        try {
            console.log('正在取得臨時對話紀錄')
            const chatHistory = await ChatHistory
                .find({ userId: userId })
                .limit(3)
                .sort({ _id: -1 })  // 按 _id 降序排序，最近的記錄會在前面


            if (!chatHistory) return []
            var index = [];
            await chatHistory.forEach(element => {
                index.push(element.messages)
            })

            return index
        } catch (error) {
            console.log(error);
            return { message: 'Failed to fetch ChatHistory' }
        }
    }

    async sendMessage(input, userId) {
        const chathistory = await this.getChatHistory(userId);
        console.log('正在取得回應')
        try {
            const Systemformmated = await prompt.format({
                input: input,  // 添加 input 變數
                prompt: input, // 如果模板中需要 `prompt`，保留這個
                status: this.status,
                res_msg: this.res_msg,
                now_date: new Date(),
                history: chathistory
            });

            const messages = [
                new HumanMessage(Systemformmated),
            ];
            // 使用 await 來等待 gemini.invoke() 執行完成
            const result = await this.gemini.invoke(messages);
            if (result.response_metadata.finishReason === "STOP") {
                const responseContent = result?.content?.replace(/```json\n|\n```/g, '');
                this.saveChat(userId, input, responseContent, result.tool_calls)
            }
            return result;
        } catch (error) {
            console.error("Error sending message:", error);
            throw error;
        }
    }


}

module.exports = AI;

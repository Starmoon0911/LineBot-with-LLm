require('dotenv').config();
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { HumanMessage, SystemMessage } = require('@langchain/core/messages');
const prompt = require('./SystemPrompt/index');
const ScamTool = require('./tools/Scam/main')
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
            apiKey: options.gemini_api_key
        });
        /**
         * 定義一個空的指定回復訊息，之後可以直接調用
         */
        this.res_msg = { userId: '', message: null }
        this.status = 'processing'
        this.getResponseWithTools = this.gemini.bindTools([

        ])
    }

    async sendMessage(input) {
        const Systemformmated = await prompt.format({
            status: this.status,
            res_msg: this.res_msg,
            system: {}
        })
        const messages = [
            new SystemMessage(Systemformmated),
            new HumanMessage(input),
        ];

        try {
            // 使用 await 來等待 gemini.invoke() 執行完成
            const result = await this.gemini.invoke(messages);
            return result;
        } catch (error) {
            console.error("Error sending message:", error);
            throw error;
        }
    }

}

module.exports = AI;

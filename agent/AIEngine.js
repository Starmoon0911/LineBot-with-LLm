require('dotenv').config();
const { HarmBlockThreshold, HarmCategory } = require('@google/generative-ai');
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { HumanMessage, SystemMessage } = require('@langchain/core/messages');
const ChatHistory = require('../database/schemas/ChatHistory.model');
const WeatherTool = require('./tools/Weather/main'); // 引入WeatherTool
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const calculatorTool = require('./tools/calculator/main');
const { createToolCallingAgent, AgentExecutor } = require('langchain/agents');
const { TavilySearchResults } = require('@langchain/community/tools/tavily_search')
class AI {
    constructor(options) {
        if (!options?.gemini_api_key) {
            throw new Error("Gemini API key is required");
        }
        if (typeof options.gemini_api_key !== "string") {
            throw new Error("Gemini API key must be a string");
        }

        // 初始狀態
        this.status = 'initializing';
        this.tools = [];
        this.res_msg = { userId: '', message: null };

        // 創建 gemini LLM 實例
        this.llm = new ChatGoogleGenerativeAI({
            model: "gemini-1.5-flash",
            apiKey: options.gemini_api_key,
            safetySettings: [
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH }
            ],
        });

        // 初始化代理和工具
        this.initializeAgent();
    }
    async initializeAgent() {
        try {
            this.tools = [
                WeatherTool,
                calculatorTool,
                new TavilySearchResults({ maxResults: 1, apiKey: process.env.tavily_apiKey }),
            ];
            this.prompt = ChatPromptTemplate.fromMessages([
                ["system", "你使用繁體中文回答，並且很會使用function calls"],//使用*繁體中文*回答。你的目標是提供使用者準確、完整的資訊。你目前服務的專案是: '2024南投山城黑克松競賽 三人行 demo機'，請不要當個復讀機。回答時不要用markdown格式，內容不能過長，列出幾點就好。你可以去政府opendata查詢資料，提供使用者正確的資訊。現在時間:{now_date}
                ["human", "{input}"],
                ["placeholder", "{agent_scratchpad}"],
            ]);
            

            this.agent = await createToolCallingAgent({
                llm: this.llm,
                tools: this.tools,
                prompt: this.prompt,
            });

            this.AgentExecutor = new AgentExecutor({
                agent: this.agent,
                tools: this.tools,
                //verbose: true,
            });

            // 初始化完成
            this.status = 'ready';
        } catch (error) {
            console.error('Error initializing agent:', error);
            this.status = 'error';
        }
    }
    async saveChat(userId, humanMessage, aiResponse, function_call) {
        try {
            const newChat = new ChatHistory({
                userId,
                messages: [
                    { human: { message: humanMessage }, model: { message: aiResponse, function_call } }
                ]
            });
            await newChat.save();
            console.log('成功保存臨時對話紀錄');
        } catch (error) {
            console.error('Error saving chat:', error);
        }
    }
    async getChatHistory(userId) {
        try {
            console.log('正在取得臨時對話紀錄');
            const chatHistory = await ChatHistory.find({ userId }).limit(2).sort({ _id: -1 });
    
            // 確保每個訊息都有內容
            return chatHistory.length
                ? chatHistory.flatMap(chat => chat.messages.map(msg => {
                    if (msg.human.message) {
                        return new HumanMessage({ content: msg.human.message });
                    } else if (msg.model.message) {
                        return new SystemMessage({ content: msg.model.message });
                    }
                    return null;
                }).filter(Boolean))  // 過濾掉空的訊息
                : [];
        } catch (error) {
            console.error('Error fetching chat history:', error);
            return [];
        }
    }
    

    async sendMessage(input, userId) {
        if (this.status !== 'ready') {
            throw new Error('Agent is not ready yet.');
        }
    
        if (!input || !userId) {
            throw new Error('Input or UserId is missing.');
        }
    
        const chathistory = await this.getChatHistory(userId);
        console.log('正在取得回應');
    
        try {
            const result = await this.AgentExecutor.invoke({
                input: input,
                now_date: new Date().toISOString(),  // 確保時間格式正確
            });
    
            if (result.output) {
                await this.saveChat(userId, input, result.output, null);
            }
    
            return result.output;
        } catch (error) {
            console.error("Error sending message:", error.message);
            throw new Error('Failed to send message: ' + error.message);
        }
    }
    


}

module.exports = AI;

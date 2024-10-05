require('dotenv').config();
const { HarmBlockThreshold, HarmCategory } = require('@google/generative-ai');
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { HumanMessage, SystemMessage } = require('@langchain/core/messages');
const { ChatMessageHistory } = require('@langchain/community/stores/message/in_memory');
const WeatherTool = require('./tools/Weather/main'); // 引入WeatherTool
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const calculatorTool = require('./tools/calculator/main');
const { createToolCallingAgent, AgentExecutor } = require('langchain/agents');
const { TavilySearchResults } = require('@langchain/community/tools/tavily_search');
const restaurantTool = require('./tools/restarent/main');
const medicineTool = require('./tools/medicineStore/main');

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

        // 初始化聊天歷史記錄存儲
        this.messageHistory = new ChatMessageHistory();
    }

    async initializeAgent() {
        try {
            this.tools = [
                WeatherTool,
                calculatorTool,

                restaurantTool,
                medicineTool
            ];
            this.prompt = ChatPromptTemplate.fromMessages([
                ["system", `使用繁體中文回答，並且會使用functioncalls，時間:${new Date()}。對話紀錄:{history}`],
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
            });

            // 初始化完成
            this.status = 'ready';
            console.log('初始化完成。狀態:' + this.status);
        } catch (error) {
            console.error('Error initializing agent:', error);
            this.status = 'error';
        }
    }

    async saveChat(userId, humanMessage, aiResponse) {
        try {
            this.messageHistory.addMessage(new HumanMessage({ content: humanMessage }));
            this.messageHistory.addMessage(new SystemMessage({ content: aiResponse }));
            console.log('成功保存臨時對話紀錄');
        } catch (error) {
            console.error('Error saving chat:', error);
        }
    }
    async getChatHistory() {
    try {
        console.log('正在取得臨時對話紀錄');
        const historyMessages = await this.messageHistory.getMessages();

        // 使用陣列來收集最新的三條訊息（人類和AI）
        const formattedHistory = [];
        
        // 只收集人類和AI訊息
        for (const msg of historyMessages) {
            if (msg instanceof HumanMessage || msg instanceof SystemMessage) {
                // 在陣列前面插入新的訊息
                formattedHistory.unshift({
                    sender: msg instanceof HumanMessage ? 'Human' : 'AI',
                    content: msg.content
                });

                // 確保陣列不超過四條訊息
                if (formattedHistory.length > 4) {
                    formattedHistory.pop(); // 刪除最舊的訊息
                }
            }
        }

        // 將陣列轉換成所需格式的物件
        const result = {};
        formattedHistory.forEach((msg, index) => {
            result[`${msg.sender} - ${index}`] = msg.content;
        });

        return result;
    } catch (error) {
        console.error('Error fetching chat history:', error);
        return {};
    }
}

    

    async sendMessage(input, userId) {
        if (this.status !== 'ready') {
            throw new Error('Agent is not ready yet. use initializeAgent() func to init it');
        }

        if (!input) {
            throw new Error('Input is missing.');
        }
        const history = await this.getChatHistory();
        console.log('正在取得回應');

        try {
            const message = {
                input: input,
                history: history,
                now_date: new Date().toISOString(),
            };
            console.log('本次對話總字數:'+ JSON.stringify(message).length)
            const result = await this.AgentExecutor.invoke(message);

            if (result.output) {
                await this.saveChat(userId, input, result.output);
            }

            return result.output;
        } catch (error) {
            console.error("Error sending message:", error.message);
            throw new Error('Failed to send message: ' + error.message);
        }
    }
}

module.exports = AI;

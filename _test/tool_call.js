const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { TavilySearchResults } = require('@langchain/community/tools/tavily_search');
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const { HarmBlockThreshold, HarmCategory } = require('@google/generative-ai');
const { pull } = require('langchain/hub');
require('dotenv').config();
const weatherTool = require('../agent/tools/Weather/main')
const { AgentExecutor, createToolCallingAgent } = require('langchain/agents')
// Define the tools the agent will have access to.
const tools = [
    weatherTool,
    new TavilySearchResults({ maxResults: 1, apiKey: process.env.tavily_apiKey }),
];
async function run() {

    // Get the prompt to use - you can modify this!
    // If you want to see the prompt in full, you can at:
    // https://smith.langchain.com/hub/hwchase17/openai-functions-agent
    const prompt = ChatPromptTemplate.fromMessages([
        ["system", "你是一個專案的AI應用程式"],
        ["human", "{input}"],
        ["placeholder", "{agent_scratchpad}"],
    ]);
    const llm = new ChatGoogleGenerativeAI({
        model: "gemini-1.5-flash",
        apiKey: process.env.API_KEY,
        safetySettings: [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH }
        ],
    });

    const agent = await createToolCallingAgent({
        llm,
        tools,
        prompt,
    });

    const agentExecutor = new AgentExecutor({
        agent,
        tools,
    });

    const result = await agentExecutor.invoke({
        input: "你好，南投市天氣怎麼樣",
    });

    console.log(result);

    /*
      {
        input: 'what is the weather in wailea?',
        output: "The current weather in Wailea, HI is 64°F with clear skies. The high for today is 82°F and the low is 66°F. If you'd like more detailed information, you can visit [The Weather Channel](https://weather.com/weather/today/l/Wailea+HI?canonicalCityId=ffa9df9f7220c7e22cbcca3dc0a6c402d9c740c755955db833ea32a645b2bcab)."
      }
    */
}
run()

const { OllamaFunctions } = require("@langchain/community/experimental/chat_models/ollama_functions")

const model = new OllamaFunctions({
  temperature: 0.1,
  model: "mistral",
});


async function run() {
    const response = await model.invoke('hello');
    console.log(response.output.text);
}
run()
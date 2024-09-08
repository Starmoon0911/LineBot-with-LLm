const main = require('./main.txt');
const { PromptTemplate } = require('@langchain/core/prompts');

const prompt = PromptTemplate.fromTemplate(
    `${main}`
)
module.exports = prompt;
const fs = require('fs')
const main = fs.readFileSync('./agent/SystemPrompt/main.txt', 'utf8');
const { PromptTemplate } = require('@langchain/core/prompts');

const prompt = PromptTemplate.fromTemplate(
    `
    ${main}
    `
)
module.exports = prompt;
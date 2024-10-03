const { z } = require('zod')
const { DynamicStructuredTool } = require('@langchain/core/tools')

const calculatorSchema = z.object({
    operation: z
        .enum(["add", "subtract", "multiply", "divide"])
        .describe("The type of operation to execute."),
    number1: z.number().describe("The first number to operate on."),
    number2: z.number().describe("The second number to operate on."),
});
module.exports = calculatorSchema
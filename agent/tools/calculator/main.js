const calculatorSchema = require('./schema')
const { DynamicStructuredTool } = require('@langchain/core/tools')

const calculatorTool = new DynamicStructuredTool({
    name: "calculator",
    description: "Can perform mathematical operations.",
    schema: calculatorSchema,
    func: async ({ operation, number1, number2 }) => {
        // Functions must return strings
        if (operation === "add") {
            return `${number1 + number2}`;
        } else if (operation === "subtract") {
            return `${number1 - number2}`;
        } else if (operation === "multiply") {
            return `${number1 * number2}`;
        } else if (operation === "divide") {
            return `${number1 / number2}`;
        } else {
            throw new Error("Invalid operation.");
        }
    },
});
module.exports = calculatorTool;
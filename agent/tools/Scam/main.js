const { DynamicStructuredTool } = require('@langchain/core/tools');
const ScamSchame = require('./schame')
const ScamTool = new DynamicStructuredTool({
    name: 'Scam',
    description: 'Tool for detecting scams',
    schema: ScamSchame,
    func: async ({ isScam }) => {
        if(isScam) console.log('Scam detected') 
    }
})
module.exports = ScamTool;
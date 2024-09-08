const { z } = require('zod');

const ScamSchame = z.object({
    operation: z
        .enum([true, false])
        .describe('根據使用者形容的場景去判斷其中是否可能包含詐騙'),
    isScam: z.boolean().describe('true代表有可能是詐騙，false帶表有可能不是')
})

module.exports = ScamSchame;
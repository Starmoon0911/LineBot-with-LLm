const fs = require('fs');
const path = require('path');
const GoogleGenerativeAI = require('@google/generative-ai')
function fileToGenerativePart(path, mimeType) {
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(path)).toString("base64"),
            mimeType,
        },
    };
}

module.exports = fileToGenerativePart;
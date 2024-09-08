require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genai = new GoogleGenerativeAI(process.env.gemini_api_key);
console.log(genai)
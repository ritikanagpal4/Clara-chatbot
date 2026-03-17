import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

export const config = {
    port: process.env.PORT || 5000,
    groqApiKey: process.env.GROQ_API_KEY,
    tavilyApiKey: process.env.TAVILY_API_KEY,
    nodeEnv: process.env.NODE_ENV || 'development',
    maxIterations: 5,
    model: 'llama-3.3-70b-versatile',
};

// Validate required environment variables
const requiredVars = ['GROQ_API_KEY', 'TAVILY_API_KEY'];
requiredVars.forEach(varName => {
    if (!process.env[varName]) {
        console.warn(`⚠️  Warning: ${varName} is not set`);
    }
});

export default config;

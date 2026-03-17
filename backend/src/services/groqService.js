import Groq from 'groq-sdk';
import config from '../config/index.js';

let groqClient = null;

export function getGroqClient() {
    if (!groqClient) {
        groqClient = new Groq({
            apiKey: config.groqApiKey,
        });
    }
    return groqClient;
}

export default getGroqClient;

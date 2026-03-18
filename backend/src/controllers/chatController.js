import chat from '../services/chatService.js';
import { getCacheStats } from '../services/cacheService.js';
import { v4 as uuidv4 } from 'uuid';

export async function handleChat(req, res) {
    try {
        const { prompt, threadId: clientThreadId } = req.body;

        if (!prompt || !prompt.trim()) {
            return res.status(400).json({ 
                success: false,
                error: 'Prompt is required' 
            });
        }

        // Use provided threadId or generate a new one
        const threadId = clientThreadId || uuidv4();

        console.log(`\n🤖 Received prompt: "${prompt.substring(0, 50)}..."`);
        console.log(`📌 Thread ID: ${threadId}`);
        
        const finalResponse = await chat(prompt, threadId);

        res.json({
            success: true,
            text: finalResponse,
            threadId: threadId,
        });
    } catch (error) {
        console.error(`❌ Chat error: ${error.message}`);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
}

// Optional: Endpoint to get cache stats
export function getCacheStatus(req, res) {
    try {
        const stats = getCacheStats();
        res.json({
            success: true,
            cache: stats,
        });
    } catch (error) {
        console.error(`❌ Cache stats error: ${error.message}`);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
}

export default handleChat;

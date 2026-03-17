import chat from '../services/chatService.js';

export async function handleChat(req, res) {
    try {
        const { prompt } = req.body;

        if (!prompt || !prompt.trim()) {
            return res.status(400).json({ 
                success: false,
                error: 'Prompt is required' 
            });
        }

        console.log(`\n🤖 Received prompt: "${prompt.substring(0, 50)}..."`);
        
        const finalResponse = await chat(prompt);

        res.json({
            success: true,
            text: finalResponse,
        });
    } catch (error) {
        console.error(`❌ Chat error: ${error.message}`);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
}

export default handleChat;

import getGroqClient from './groqService.js';
import { performWebSearch } from './searchService.js';
import { getThreadMessages, addMessageToThread } from './cacheService.js';
import config from '../config/index.js';

const client = getGroqClient();

export async function chat(prompt, threadId) {
    // Get messages from thread context (includes system message and previous messages)
    const messages = getThreadMessages(threadId);
    
    // Add the current user message
    const userMessage = {
        role: "user",
        content: prompt,
    };
    messages.push(userMessage);
    addMessageToThread(threadId, userMessage);

    let finalResponse = "";
    let iterationCount = 0;

    while (iterationCount < config.maxIterations) {
        iterationCount++;
        console.log(`\n📍 Iteration ${iterationCount}: Processing chat completion...`);

        const chatCompletion = await client.chat.completions.create({
            model: config.model,
            messages: messages,
            tools: [
                {
                    type: "function",
                    function: {
                        name: "webSearch",
                        description: "Search the latest information and realtime data on the internet using Tavily API",
                        parameters: {
                            type: "object",
                            properties: {
                                query: {
                                    type: "string",
                                    description: "The search query string to search on the web"
                                }
                            },
                            required: ["query"],
                            additionalProperties: false
                        }
                    }
                }
            ],
            tool_choice: 'auto'
        });

        const choice = chatCompletion.choices[0]?.message;
        if (!choice) {
            throw new Error("No response from model");
        }

        messages.push(choice);
        console.log(`📝 Assistant content: ${choice?.content ? '✓ Present' : '✗ Empty'}`);
        console.log(`🔧 Tool calls: ${choice?.tool_calls?.length || 0}`);

        // If no tool calls, break the loop
        if (!choice?.tool_calls || choice.tool_calls.length === 0) {
            finalResponse = choice?.content || "";
            console.log("✅ No tool calls - response ready");
            break;
        }

        // Handle tool calls
        for (const tool of choice?.tool_calls || []) {
            const functionName = tool?.function?.name;
            const functionParams = tool?.function?.arguments;

            console.log(`🛠️  Executing tool: ${functionName}`);

            if (functionName === "webSearch") {
                try {
                    const params = typeof functionParams === "string" ? JSON.parse(functionParams) : functionParams;
                    const searchResult = await performWebSearch(params.query);
                    const toolResult = JSON.stringify(searchResult);

                    messages.push({
                        role: "tool",
                        tool_call_id: tool.id,
                        name: functionName,
                        content: toolResult,
                    });

                    console.log(`📎 Tool result added to conversation`);
                } catch (toolErr) {
                    console.error(`❌ Tool execution error: ${toolErr.message}`);
                    throw toolErr;
                }
            }
        }
    }

    if (iterationCount >= config.maxIterations) {
        throw new Error(`Max iterations (${config.maxIterations}) reached`);
    }

    // Add assistant response to thread context
    const assistantMessage = {
        role: "assistant",
        content: finalResponse,
    };
    addMessageToThread(threadId, assistantMessage);

    return finalResponse;
}

export default chat;

import NodeCache from 'node-cache';

// Initialize cache with 30 minutes TTL (1800 seconds)
const cache = new NodeCache({ stdTTL: 1800, checkperiod: 600 });

/**
 * @typedef {Object} ThreadContext
 * @property {Array<{role: string, content: string}>} messages
 * @property {number} createdAt
 * @property {number} lastUpdated
 */

/**
 * Get or create a thread context
 */
export function getThreadContext(threadId) {
  let context = cache.get(threadId);
  
  if (!context) {
    context = {
      messages: [
        {
          role: "system",
          content: "You are Clara, a helpful smart assistant. When users ask about recent events, current information, or real-time data, use the webSearch tool to find the latest information. Always provide accurate and helpful responses. Maintain context from the conversation history.",
        },
      ],
      createdAt: Date.now(),
      lastUpdated: Date.now(),
    };
    cache.set(threadId, context);
    console.log(`📌 New thread created: ${threadId}`);
  } else {
    console.log(`📌 Thread found: ${threadId}`);
  }
  
  return context;
}

/**
 * Add a message to thread context
 */
export function addMessageToThread(threadId, message) {
  const context = getThreadContext(threadId);
  context.messages.push(message);
  context.lastUpdated = Date.now();
  cache.set(threadId, context);
  console.log(`💬 Message added to thread ${threadId}`);
}

/**
 * Get all messages for a thread
 */
export function getThreadMessages(threadId) {
  const context = getThreadContext(threadId);
  return context.messages;
}

/**
 * Clear a specific thread
 */
export function clearThread(threadId) {
  const deleted = cache.del(threadId);
  console.log(`🗑️  Thread ${threadId} cleared. Keys deleted: ${deleted}`);
  return deleted > 0;
}

/**
 * Get cache stats with full thread data
 */
export function getCacheStats() {
  const keys = cache.keys();
  const threads = {};

  keys.forEach((key) => {
    const threadData = cache.get(key);
    threads[key] = {
      messageCount: threadData?.messages?.length || 0,
      messages: threadData?.messages || [],
      createdAt: new Date(threadData?.createdAt).toISOString(),
      lastUpdated: new Date(threadData?.lastUpdated).toISOString(),
    };
  });

  return {
    totalThreads: keys.length,
    threads: threads,
    cacheStats: cache.getStats(),
  };
}

export default {
  getThreadContext,
  addMessageToThread,
  getThreadMessages,
  clearThread,
  getCacheStats,
};

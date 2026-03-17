import webSearch from '../utils/webSearch.js';

export async function performWebSearch(query) {
    try {
        console.log(`🔍 Web search query: ${query}`);
        const result = await webSearch(query);
        console.log(`✅ Web search completed for: ${query}`);
        return result;
    } catch (error) {
        console.error(`❌ Web search error: ${error.message}`);
        throw error;
    }
}

export default performWebSearch;

import { tavily } from "@tavily/core";

let tvly = null;

function getTavily() {
    if (!tvly) {
        tvly = tavily({
            apiKey: process.env.TAVILY_API_KEY,
        });
    }
    return tvly;
}

async function webSearch(query) {
    console.log(`Performing web search for query: ${query}`);
    const tvlyClient = getTavily();
    const response = await tvlyClient.search(query);
    console.log(`Web search response for query "${query}":`, response);
    const finalResponse = response.results.map(result => result.content).join("\n\n");
    return finalResponse;
}

export default webSearch;
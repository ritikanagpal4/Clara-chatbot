import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        if (!prompt || !prompt.trim()) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        // Call the Express LLM server
        const llmServerUrl = process.env.LLM_SERVER_URL || "http://localhost:5000";
        
        const response = await fetch(`${llmServerUrl}/api/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("LLM Server error:", error);
            return NextResponse.json({ error: error.error || "LLM server error" }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
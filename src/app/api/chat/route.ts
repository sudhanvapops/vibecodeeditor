import { type NextRequest, NextResponse } from "next/server";

import { ChatMessage, ChatRequest } from "./types";
import { codeLamma, Perplexity } from "./AI_Models"



// Genrates Response based on the model selected
export async function POST(req: NextRequest) {

    try {

        const body: ChatRequest = await req.json()
        const { message, history = [], model } = body

        if (!message || typeof message !== "string") {
            return NextResponse.json(
                { error: "Message is required and must be a string" },
                { status: 400 }
            )
        }

        // keep only the last 10 valid messages to avoid long context overload
        const validHistory = Array.isArray(history)
            ? history.filter(msg =>
                msg &&
                typeof msg === "object" &&
                typeof msg.role === "string" &&
                typeof msg.content === "string" &&
                ["user", "assistant"].includes(msg.role)
            ) : []


        // To Avoid Chat overflow
        const recentHistory = validHistory.slice(-10)

        const messages: ChatMessage[] = [
            ...recentHistory,
            { role: "user", content: message }
        ]


        // Send to llm
        // Generate ai response
        const aiResponse = await generateAIResponse(messages, model)

        return NextResponse.json<{ response: string; timestamp: string }>({
            response: aiResponse,
            timestamp: new Date().toISOString(),
        });

    } catch (error) {

        console.error("Chat API Error:", error);

        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        return NextResponse.json(
            {
                error: "Failed to generate AI response",
                details: errorMessage,
                timestamp: new Date().toISOString(),
            },
            { status: 500 }
        );
    }

}


// Generating AI Response
async function generateAIResponse(messages: ChatMessage[], model: string): Promise<string> {

    // Normalize model name to lower case
    const selected = model.toLowerCase();

    // Route to correct provider
    switch (selected.trim()) {
        case "code-lamma":
            return await codeLamma(messages)
        case "perplexity":
            return await Perplexity(messages)
        default:
            throw new Error(`Unsupported model: ${model}`);
    }
}
import { type NextRequest, NextResponse } from "next/server";

interface ChatMessage {
    role: "user" | "assistant"
    content: string
}

interface ChatRequest {
    message: string
    history: ChatMessage[]
}


export async function POST(req: NextRequest) {

    try {

        const body: ChatRequest = await req.json()
        const { message, history = [] } = body

        if (!message || typeof message !== "string") {
            return NextResponse.json(
                { error: "Message is required and must be a string" },
                { status: 400 }
            )
        }

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

        const aiResponse = await generateAIResponse(messages)

        return NextResponse.json({
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

async function generateAIResponse(messages: ChatMessage[]): Promise<string> {

    const systemPrompt = `You are a helpful AI coding assistant. You help developers with:
- Code explanations and debugging
- Best practices and architecture advice  
- Writing clean, efficient code
- Troubleshooting errors
- Code reviews and optimizations

Always provide clear, practical answers. Use proper code formatting when showing examples.`;


    const fullMessages = [
        { role: "system", content: systemPrompt },
        ...messages
    ]

    const prompt = fullMessages
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join("\n\n");


    try {

        const response = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                // Sellect model by user
                model: "codellama:latest",
                prompt: prompt,
                stream: false,
                options: {
                    temperature: 0.7, // Controls randomness (0-1)
                    max_tokens: 1000, // Maximum response length
                    top_p: 0.9, // controls diversity
                },
            }),
        });

        const data = await response.json()

        if (!data.response) {
            throw new Error("No response from AI model");
        }

        return data.response.trim();

    } catch (error) {
        console.error("AI generation error:", error);
        throw new Error("Failed to generate AI response");
    }

}

// Perplexity

// interface ChatMessage {
//     role: "system" | "user" | "assistant";
//     content: string;
// }

// async function generateAIResponse(messages: ChatMessage[]): Promise<string> {
//     const systemPrompt = `You are a helpful AI coding assistant. You help developers with:
// - Code explanations and debugging
// - Best practices and architecture advice  
// - Writing clean, efficient code
// - Troubleshooting errors
// - Code reviews and optimizations

// Always provide clear, practical answers. Use proper code formatting when showing examples.`;

//     const fullMessages = [
//         { role: "system" as const, content: systemPrompt },
//         ...messages
//     ];

//     try {
//         const response = await fetch("https://api.perplexity.ai/chat/completions", {
//             method: "POST",
//             headers: {
//                 "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                 model: "sonar", // Select model by user preference
//                 messages: fullMessages,
//                 max_tokens: 1000,
//                 temperature: 0.7, // Controls randomness (0-1)
//                 top_p: 0.9, // Controls diversity
//                 stream: false,
//                 return_citations: false,
//                 return_images: false,
//                 return_related_questions: false,
//                 presence_penalty: 0,
//                 frequency_penalty: 0.1
//             }),
//         });

//         if (!response.ok) {
//             const errorData = await response.json().catch(() => ({}));
//             throw new Error(`Perplexity API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
//         }

//         const data = await response.json();
        
//         if (!data.choices?.[0]?.message?.content) {
//             throw new Error("No response from Perplexity AI model");
//         }

//         return data.choices[0].message.content.trim();

//     } catch (error) {
//         console.error("AI generation error:", error);
//         throw new Error("Failed to generate AI response");
//     }
// }
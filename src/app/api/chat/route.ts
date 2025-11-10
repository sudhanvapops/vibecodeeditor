import { type NextRequest, NextResponse } from "next/server";

interface ChatMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

interface ChatRequest {
    message: string
    history: ChatMessage[]
    model: string
}

// Building Prompt
const systemPrompt = `You are a helpful AI coding assistant. You help developers with:
- Code explanations and debugging
- Best practices and architecture advice  
- Writing clean, efficient code
- Troubleshooting errors
- Code reviews and optimizations

Always provide clear, practical answers. Use proper code formatting when showing examples.`;

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
            return await Ollama(messages,)
        case "perplexity":
            return await Perplexity(messages)
        default:
            throw new Error(`Unsupported model: ${model}`);
    }
}



// Ollama
async function Ollama(messages: ChatMessage[]): Promise<string> {

    // Merges everything
    const fullMessages = [
        { role: "system", content: systemPrompt },
        ...messages
    ]

    // Converts this into a single text block:
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
                // TODO: Sellect model by user
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
async function Perplexity(messages: ChatMessage[]): Promise<string> {

    try {

        if (!process.env.PERPLEXITY_API_KEY) {
            throw new Error("Missing PERPLEXITY_API_KEY in environment variables");
        }

        // Ensure messages alternate between user and assistant
        const formattedMessages: ChatMessage[] = [
            { role: "system" as const, content: systemPrompt }
        ];

        // Track the last role to ensure alternation
        let lastRole: "user" | "assistant" | null = null;

        for (const msg of messages) {
            // Skip consecutive messages from the same role
            if (msg.role === lastRole) {
                continue;
            }

            // Only add user and assistant messages (system is already added)
            if (msg.role === "user" || msg.role === "assistant") {
                formattedMessages.push({
                    role: msg.role,
                    content: msg.content
                });
                lastRole = msg.role;
            }
        }

        // Ensure the conversation ends with a user message
        if (lastRole !== "user") {
            // Find the last user message and add it
            const lastUserMessage = messages.reverse().find(m => m.role === "user");
            if (lastUserMessage) {
                formattedMessages.push({
                    role: "user",
                    content: lastUserMessage.content
                });
            }
        }

        const response = await fetch("https://api.perplexity.ai/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "sonar",
                messages: formattedMessages,
                max_tokens: 1000,
                temperature: 0.7,
                top_p: 0.9,
                stream: false,
                return_citations: false,
                return_images: false,
                return_related_questions: false,
                presence_penalty: 0,
                frequency_penalty: 0.1
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Perplexity API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();

        if (!data.choices?.[0]?.message?.content) {
            throw new Error("No response from Perplexity AI model");
        }

        return data.choices[0].message.content.trim();

    } catch (error) {
        console.error("AI generation error:", error);
        throw new Error("Failed to generate AI response");
    }
}
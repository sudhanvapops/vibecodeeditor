import { systemPrompt } from "../consts";
import { ChatMessage } from "../types";


// Ollama
export async function Ollama(messages: ChatMessage[]): Promise<string> {

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


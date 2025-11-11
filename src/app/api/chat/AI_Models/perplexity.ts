import { ChatMessage } from "../types";
import { systemPrompt } from "../consts"


function prepareHistoryForPerplexity(messages: ChatMessage[]) {
    const mergedMessages: ChatMessage[] = [];

    for (const msg of messages) {
        const last = mergedMessages[mergedMessages.length - 1];

        // If last message has same role, merge content
        if (last && last.role === msg.role) {
            last.content += `\n\n${msg.content}`;
        } else {
            // Otherwise, push new message block
            mergedMessages.push({
                role: msg.role,
                content: msg.content
            });
        }
    }

    return mergedMessages;
}


// Perplexity
export async function Perplexity(messages: ChatMessage[]): Promise<string> {
    try {

        if (!process.env.PERPLEXITY_API_KEY) {
            throw new Error("Missing PERPLEXITY_API_KEY in environment variables");
        }

        // Merge consecutive messages (user or assistant)
        const mergedMessages = prepareHistoryForPerplexity(messages);

        // Build final message list for API
        // Add system prompt at the start to define assistant behavior
        const formattedMessages: ChatMessage[] = [
            { role: "system", content: systemPrompt },
            ...mergedMessages
        ];

        // Ensure the last message is from the user
        const lastMessage = formattedMessages[formattedMessages.length - 1];
        if (lastMessage.role !== "user") {
            const lastUserMessage = [...mergedMessages].reverse().find(m => m.role === "user");
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

        // Handle HTTP or API-level errors
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                `Perplexity API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`
            );
        }

        // Parse and extract model response
        const data = await response.json();

        if (!data.choices?.[0]?.message?.content) {
            throw new Error("No response from Perplexity AI model");
        }

        // Return the clean assistant response
        return data.choices[0].message.content.trim();

    } catch (error) {
        // Log and rethrow generic error
        console.error("AI generation error:", error);
        throw new Error("Failed to generate AI response");
    }
}
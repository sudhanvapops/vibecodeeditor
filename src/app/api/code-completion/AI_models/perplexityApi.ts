// Perplexity
export async function Perplexity(prompt: string): Promise<string> {
    try {
        const response = await fetch("https://api.perplexity.ai/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "sonar", // or another Perplexity model
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: 300,
                temperature: 0.7,
                top_p: 0.9,
                return_citations: false,
                search_domain_filter: ["perplexity.ai"],
                return_images: false,
                return_related_questions: false,
                search_recency_filter: "month",
                top_k: 0,
                stream: false,
                presence_penalty: 0,
                frequency_penalty: 1
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Perplexity API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        let suggestion = data.choices?.[0]?.message?.content || "";

        // Clean up the suggestion
        if (suggestion.includes("```")) {
            const codeMatch = suggestion.match(/```[\w]*\n?([\s\S]*?)```/);
            suggestion = codeMatch ? codeMatch[1].trim() : suggestion;
        }

        return suggestion;
    } catch (error) {
        console.error("Perplexity AI generation error:", error);
        return "// AI suggestion unavailable";
    }
}


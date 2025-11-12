
// code-lamma
export async function codeLamma(prompt: string) {
    try {
        const response = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "codellama:latest",
                prompt,
                stream: false,
                option: {
                    // IF this is high it can think out of context 
                    // ? Read More
                    temperature: 0.7,
                    max_tokens: 300,
                },
            }),
        });

        if (!response.ok) {
            throw new Error(`AI service error: ${response.statusText}`)
        }

        const data = await response.json()
        let suggestion = data.response

        // Clean up the suggestion
        if (suggestion.includes("```")) {
            const codeMatch = suggestion.match(/```[\w]*\n?([\s\S]*?)```/)
            suggestion = codeMatch ? codeMatch[1].trim() : suggestion
        }

        return suggestion
    } catch (error) {
        console.error("AI generation error:", error)
        return "// AI suggestion unavailable"
    }
}
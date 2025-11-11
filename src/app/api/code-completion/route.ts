import { type NextRequest, NextResponse } from "next/server";
import { CodeContext, CodeSuggestionRequest } from "./types"

import { analyzeCodeContext } from "./helper/analtize_content"
import { buildPrompt } from "./helper/buildPrompt"


export async function POST(req: NextRequest) {

    try {

        const body: CodeSuggestionRequest = await req.json()

        const { fileContent, cursorLine, cursorColumn, suggestionType, fileName } =
            body;

        // Validate input
        if (!fileContent || cursorLine < 0 || cursorColumn < 0 || !suggestionType) {
            return NextResponse.json(
                { error: "Invalid input parameters" },
                { status: 400 }
            );
        }


        const context = analyzeCodeContext(fileContent, cursorLine, cursorColumn, fileName)

        const prompt = buildPrompt(context, suggestionType)

        const suggestion = await generateSuggestion(prompt)


        return NextResponse.json({
            suggestion,
            context,
            metadata: {
                language: context.language,
                framework: context.framework,
                position: context.cursorPosition,
                generatedAt: new Date().toISOString(),
            },
        });

    } catch (error: any) {
        console.error("Context analysis error:", error);
        return NextResponse.json(
            { error: "Internal server error code-completion", message: error.message },
            { status: 500 }
        );
    }
}


async function generateSuggestion(prompt: string): Promise<string> {

    try {
        const response = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                // ! Improve make an env 
                // model: "codellama:latest",
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
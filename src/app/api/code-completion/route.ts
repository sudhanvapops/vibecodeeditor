import { type NextRequest, NextResponse } from "next/server";
import { CodeSuggestionRequest } from "./types"

import { analyzeCodeContext } from "./helper/analtize_content"
import { buildPrompt } from "./helper/buildPrompt"
import { codeLamma } from "./AI_models";


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

        // TODO: Add Model
        const suggestion = await generateSuggestion(prompt,"")


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


async function generateSuggestion(prompt: string, model: string): Promise<string> {

    switch (model) {
        case "code-lamma":
            return await codeLamma(prompt)
        // case "perplexity":
        //     break
        default:
            throw new Error(`Unsupported model: ${model}`)
    }

   
}
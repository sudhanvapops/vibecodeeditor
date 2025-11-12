export interface CodeSuggestionRequest {
    fileContent: string;
    cursorLine: number;
    cursorColumn: number;
    suggestionType: string;
    fileName?: string;
    model: string
}

export interface CodeContext {
    language: string;
    framework: string;
    beforeContext: string;
    currentLine: string;
    afterContext: string;
    cursorPosition: { line: number; column: number };
    isInFunction: boolean;
    isInClass: boolean;
    isAfterComment: boolean;
    incompletePatterns: string[];
}

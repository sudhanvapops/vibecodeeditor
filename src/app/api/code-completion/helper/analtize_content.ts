import { CodeContext } from "../types";

// Helper functions for code analysis
function detectLanguage(content: string, fileName?: string): string {
    if (fileName) {
        const ext = fileName.split(".").pop()?.toLowerCase();
        const extMap: Record<string, string> = {
            ts: "TypeScript",
            tsx: "TypeScript",
            js: "JavaScript",
            jsx: "JavaScript",
            py: "Python",
            java: "Java",
            go: "Go",
            rs: "Rust",
            php: "PHP",
        };
        if (ext && extMap[ext]) return extMap[ext];
    }

    // Content-based detection
    if (content.includes("interface ") || content.includes(": string"))
        return "TypeScript";
    if (content.includes("def ") || content.includes("import ")) return "Python";
    if (content.includes("func ") || content.includes("package ")) return "Go";

    return "JavaScript";
}

function detectFramework(content: string): string {
    if (content.includes("import React") || content.includes("useState"))
        return "React";
    if (content.includes("import Vue") || content.includes("<template>"))
        return "Vue";
    if (content.includes("@angular/") || content.includes("@Component"))
        return "Angular";
    if (content.includes("next/") || content.includes("getServerSideProps"))
        return "Next.js";

    return "None";
}


function detectInFunction(lines: string[], currentLine: number): boolean {
    for (let i = currentLine - 1; i >= 0; i--) {
        const line = lines[i];
        if (line?.match(/^\s*(function|def|const\s+\w+\s*=|let\s+\w+\s*=)/))
            return true;
        if (line?.match(/^\s*}/)) break;
    }
    return false;
}


function detectInClass(lines: string[], currentLine: number): boolean {
    for (let i = currentLine - 1; i >= 0; i--) {
        const line = lines[i];
        if (line?.match(/^\s*(class|interface)\s+/)) return true;
    }
    return false;
}


function detectAfterComment(line: string, column: number): boolean {
    const beforeCursor = line.substring(0, column);
    return /\/\/.*$/.test(beforeCursor) || /#.*$/.test(beforeCursor);
}


function detectIncompletePatterns(line: string, column: number): string[] {
    const beforeCursor = line.substring(0, column);
    const patterns: string[] = [];

    if (/^\s*(if|while|for)\s*\($/.test(beforeCursor.trim()))
        patterns.push("conditional");
    if (/^\s*(function|def)\s*$/.test(beforeCursor.trim()))
        patterns.push("function");
    if (/\{\s*$/.test(beforeCursor)) patterns.push("object");
    if (/\[\s*$/.test(beforeCursor)) patterns.push("array");
    if (/=\s*$/.test(beforeCursor)) patterns.push("assignment");
    if (/\.\s*$/.test(beforeCursor)) patterns.push("method-call");

    return patterns;
}


export function analyzeCodeContext(
    content: string,
    line: number,
    column: number,
    fileName?: string
): CodeContext {

    const lines = content.split("\n");
    const currentLine = lines[line] || "";

    // Get surrounding context (10 lines before and after)
    const contextRadius = 10;
    const startLine = Math.max(0, line - contextRadius);
    const endLine = Math.min(lines.length, line + contextRadius);

    const beforeContext = lines.slice(startLine, line).join("\n");
    const afterContext = lines.slice(line + 1, endLine).join("\n");

    // Detect language and framework
    const language = detectLanguage(content, fileName);
    const framework = detectFramework(content);

    // Analyze code patterns
    const isInFunction = detectInFunction(lines, line);
    const isInClass = detectInClass(lines, line);
    const isAfterComment = detectAfterComment(currentLine, column);
    const incompletePatterns = detectIncompletePatterns(currentLine, column);

    return {
        language,
        framework,
        beforeContext,
        currentLine,
        afterContext,
        cursorPosition: { line, column },
        isInFunction,
        isInClass,
        isAfterComment,
        incompletePatterns,
    };
}

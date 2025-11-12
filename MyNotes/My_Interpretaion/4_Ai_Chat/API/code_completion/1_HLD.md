1. Purpose

This system provides context-aware code suggestions (like GitHub Copilot) by analyzing code around the user’s cursor, generating a prompt, and passing it to an AI model (like Code Llama or Perplexity AI) to get code completions.


2. API Endpoint (POST)

Handles incoming requests from the frontend (like a code editor or IDE plugin).
Request body = CodeSuggestionRequest, which contains:
fileContent → Entire code file as text
cursorLine, cursorColumn → Position of cursor
suggestionType → e.g. “complete function”, “fix bug”, etc.
fileName → Optional, helps detect language

Performs validation, then:
Calls analyzeCodeContext() → Extracts context (language, framework, code surroundings, patterns, etc.)
Builds a prompt with buildPrompt()
Sends it to a model using generateSuggestion()
Returns JSON with:
suggestion
context
metadata (language, framework, cursor position, etc.)
### HLD Chat API

Purpose

This file defines a POST API endpoint for handling chat requests from your frontend.
It:
Receives the user message + chat history.
Validates input.
Builds a prompt combining history and system instructions.
Sends it to an AI model (like Ollama locally).
Returns the model’s reply to the frontend.


1. Entry point

export async function POST(req: NextRequest)
→ Handles incoming chat POST requests.

2. Core logic

Parses request JSON.
Validates fields.
Prepares chat messages for the AI model.
Calls generateAIResponse(messages).
Returns a formatted JSON response.

3. AI model handler

generateAIResponse(messages)
→ Prepares a final prompt with system instructions + chat history, sends it to your AI model (e.g., Ollama’s localhost:11434/api/generate endpoint), and returns the generated text.
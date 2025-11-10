### Working

Frontend sends a request

await fetch("/api/chat", {
  method: "POST",
  body: JSON.stringify({
    message: "Explain my React code",
    history: [...recentMessages],
  })
})


So the server receives a JSON body:

{
  "message": "Explain my React code",
  "history": [
    { "role": "user", "content": "previous message" },
    { "role": "assistant", "content": "previous reply" }
  ]
}


You keep only the last 10 valid messages to avoid long context overload:


4. Construct the full chat context

const messages: ChatMessage[] = [
  ...recentHistory,
  { role: "user", content: message }
];

This ensures the AI model receives:
Past 10 exchanges
Plus the latest user query

5. AI response generation

Adds a system prompt (to define the assistant’s behavior):
const systemPrompt = `You are a helpful AI coding assistant...`

Merges everything:
const fullMessages = [
  { role: "system", content: systemPrompt },
  ...messages
];

Converts this into a single text block:
const prompt = fullMessages
  .map((msg) => `${msg.role}: ${msg.content}`)
  .join("\n\n");


Now prompt looks like this:
system: You are a helpful AI coding assistant...
user: Explain this React component
assistant: It's a useEffect hook...
user: Why use useCallback?


6. Send to AI model
This uses Ollama’s local REST API to generate a response.
Send back to the frontend

<!-- Todo -->
- Make Ollama, Perplexity and add others ai
- frontend selects modal and backend choes what function to call based on that
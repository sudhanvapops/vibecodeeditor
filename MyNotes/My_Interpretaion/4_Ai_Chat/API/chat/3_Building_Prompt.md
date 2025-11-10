### Building Prompt

1. It extracts:

message — The current user message
history — The previous conversation
model — Which model to use (e.g., "perplexity" or "code-llama")


2. Build the complete message array
Now you combine the history + the new user message:
const messages: ChatMessage[] = [
  ...recentHistory,
  { role: "user", content: message }
];

You combine your system prompt and all conversation messages:
const fullMessages = [
  { role: "system", content: systemPrompt },
  ...messages
];

In Ollama
You flatten that structured chat history into a single long text block: 
In PErplexity You leave as it is 


#### Example
system: You are a helpful AI coding assistant.
user: Hi, what is a closure in JS?
assistant: A closure is when a function remembers variables from its scope.
user: Show me an example.


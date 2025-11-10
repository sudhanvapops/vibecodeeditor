### Data Flow (Step-by-Step)

1. User Input

- User types into the Textarea (input state).
- Presses Enter or clicks “Send”.
- handleSendMessage(e) runs.

2. Message Creation

Inside handleSendMessage:
Creates a new ChatMessage object for the user:

const newMessage = {
  role: "user",
  content: input.trim(),
  timestamp: new Date(),
  id: Date.now().toString(),
  type: "chat" | "code_review" | "error_fix" | "optimization",
};

Adds it to messages state:
setMessages((prev) => [...prev, newMessage]);
Clears input (setInput("")).
Sets isLoading = true.


3. API Request

Then it prepares a context-aware prompt:
const contextualMessage = getChatModePrompt(chatMode, input.trim());

and sends it to /api/chat:

const response = await fetch("/api/chat", {
  method: "POST",
  body: JSON.stringify({
    message: contextualMessage,
    history: messages.slice(-10).map(...),
    stream: streamResponse,
    mode: chatMode,
    model,
  }),
});

So the API gets:
The latest message
The last 10 previous messages (context)
The selected model (e.g., gpt-6)
Flags like “stream” or “mode”



4. API Response

If successful, it receives a response like:
{ "response": "Here's your optimized code...", "tokens": 150, "model": "gpt-6" }

Then appends a new assistant message to the chat:
setMessages((prev) => [...prev, {
  role: "assistant",
  content: data.response,
  tokens: data.tokens,
  model: data.model,
  ...
}]);

Finally, isLoading = false.


5. UI Rendering

Because messages changed:
React re-renders.
It maps through filteredMessages:
{filteredMessages.map((msg) => (...))}
Displays each as a chat bubble using Tailwind + markdown renderer.

Also:
useEffect detects message change and scrolls to bottom.
If isLoading is true, a “typing/loading” bubble appears temporarily.


6. Optional Data Flows

- Export Chat: Converts messages → JSON → triggers download.
- Filter/Search: Recalculates filteredMessages based on filterType/searchTerm.
- Mode Switch (Tabs): Changes chatMode and modifies prompt behavior.
- Settings Menu: Toggles autoSave, streamResponse, clears messages, or downloads chat.


User Input → handleSendMessage()
      ↓
   setMessages([...userMessage])
      ↓
     fetch("/api/chat") 
      ↓
   AI Response → setMessages([...assistantMessage])
      ↓
     re-render
      ↓
   UI auto-scrolls to bottom

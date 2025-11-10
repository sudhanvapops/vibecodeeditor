### handleSendMessage



What it does:

e.preventDefault() to stop form submission.
Guards: If !input.trim() or already isLoading, it returns early.
Builds messageType based on chatMode (maps to chat/code_review/error_fix/optimization).
Creates newMessage: ChatMessage representing the user message (role: "user").
id uses Date.now().toString() (simple unique-ish id).
setMessages(prev => [...prev, newMessage]) — appends the user message to UI immediately (optimistic update).
Clears input and sets isLoading = true so UI shows loader and disables actions.
Builds contextualMessage = getChatModePrompt(chatMode, input.trim()).
Calls fetch("/api/chat", { method: "POST", headers, body: JSON.stringify({ message: contextualMessage, history: messages.slice(-10)..., stream: streamResponse, mode: chatMode, model, }), }).
Sends the last 10 messages from the current messages state as history (context).


On response.ok, await response.json(), then appends assistant reply:
setMessages(prev => [...prev, { role: "assistant", content: data.response, tokens: data.tokens, model: data.model || "AI Assistant", ... }])

On non-ok or catch, appends a generic assistant error message.
finally sets isLoading = false.


<!-- Todo -->
Compute historyForRequest to include the new user message.
If streamResponse true: implement streaming read on the client and update assistant message progressively (append partial content).
Use AbortController to cancel in-flight fetches if component unmounts.
Use optimistic UI but also handle cases where server returns error (then possibly mark user message as failed).
Persist messages (localStorage or server) if autoSave is true.



Streaming flag but no streaming client handling: the code includes stream: streamResponse in request body, but current front-end does await response.json() — that expects the server to return full JSON. If streamResponse is true and server streams (SSE / ReadableStream chunks), this front-end will fail unless server sends final JSON. To support streaming client-side, you must use the ReadableStream APIs (e.g., response.body.getReader() and read chunks incrementally) and update assistant message content progressively. As-is, the stream flag only works if server supports both modes and when streaming = true it still returns a final JSON object (or not actually streaming).


is a React hook callback that fetches AI code suggestions for the Monaco editor.

It uses state updates, editor APIs, and a backend API (/api/code-completion) to get completions based on the user’s cursor position.

fetchSuggestion is called whenever you want to fetch a new suggestion (like “auto-complete” or “AI hint”) for the code that the user is currently editing in Monaco Editor.

It:
- Reads the current code and cursor position
- Sends it to your backend API
- Receives a suggested completion
- Updates the state with that suggestion


Uses the functional form of setState so you always get the latest state.
It checks conditions:
    - If suggestions are disabled → do nothing.
    - If editor doesn’t exist → do nothing.
    - It creates a newState where isLoading: true — meaning, we’re fetching a suggestion.


### 4 Getting code + cursor

These are Monaco APIs:
    - model.getValue() → gives the entire code as text.
    - cursorPosition.lineNumber and .column → give cursor location.
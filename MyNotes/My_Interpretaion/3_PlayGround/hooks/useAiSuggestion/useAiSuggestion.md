

1. 🎯 Goal

- The useAISuggestions hook manages AI-powered code completions in your editor (like Monaco).
- It handles:
    - Fetching AI suggestions from /api/code-completion
    - Showing them visually in the editor
    - Letting user accept or reject them
    - Toggling suggestion system on/off


🧩 Main Responsibilities
Component	        Purpose
fetchSuggestion()	Sends current file + cursor info to AI backend and gets suggestion
acceptSuggestion()	Inserts suggestion into the editor
rejectSuggestion()	Clears suggestion highlight/overlay
clearSuggestion()	Removes any existing decoration and resets state
toggleEnabled()	    Turns AI suggestions ON/OFF
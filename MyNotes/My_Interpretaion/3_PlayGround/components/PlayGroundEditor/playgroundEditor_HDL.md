### 🎯 Purpose

PlaygroundEditor is a code editor component built using Monaco Editor (the same editor that powers VS Code).

1. It provides:
    - Real-time editing
    - AI code suggestions (inline completions)
    - Tab to accept suggestion
    - Escape to reject suggestion
    - Smart triggers for AI suggestions on certain keystrokes
    - Context awareness (don’t show suggestions if user moved away)

Essentially, it mimics GitHub Copilot-like behavior inside Monaco.


### ⚙️ Key Features
Feature	Description

AI Inline Suggestions	Displays AI-generated code completions inline, near the cursor
Smart Triggering	    Automatically triggers suggestions after certain characters (e.g., ., =, {)
Tab Accept Logic	    Accepts AI suggestion with Tab (but avoids double acceptance bugs)
Escape Reject Logic	    Rejects AI suggestion and hides it
Position Awareness	    Shows suggestion only when cursor matches expected position
Cleanup Logic	Clears  suggestions when cursor moves or user types manually
Dynamic Language Mode	Automatically detects file type and sets correct syntax highlighting


PlaygroundEditor
 ├── useRef hooks (to store Monaco editor, monaco instance, provider, flags)
 ├── useEffect (to handle lifecycle: mount, update, unmount)
 ├── Inline Completion Provider (core AI suggestion handler)
 ├── Event Listeners (keyboard, cursor, content changes)
 ├── Helper Functions (accept/reject/clear suggestions)
 └── Renders <Editor /> from @monaco-editor/react

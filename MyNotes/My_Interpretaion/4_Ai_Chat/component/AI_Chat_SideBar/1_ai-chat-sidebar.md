### Ai Chat Side Bar HLD

The purpose:

1. It gives users an AI chat assistant with:
    - Chatting
    - Code review
    - Bug fixing
    - Code optimization
    - All inside a side drawer UI that overlays your current page.


2. Main building blocks (modules inside this file):

| Section                                | Description                                                                  |
| -------------------------------------- | ---------------------------------------------------------------------------- |
| **Imports**                            | UI components, hooks, icons, markdown libs                                   |
| **Interfaces**                         | Defines message shape (`ChatMessage`) and props (`AIChatSidePanelProps`)     |
| **`MessageTypeIndicator`**             | Small component that shows the type of message (review, fix, etc.)           |
| **Main Component (`AIChatSidePanel`)** | The full panel UI + logic                                                    |
| **State hooks**                        | Control data (messages, mode, filters, etc.)                                 |
| **Effects**                            | For auto-scrolling and cleanup                                               |
| **Helper functions**                   | Like `scrollToBottom`, `getChatModePrompt`, `exportChat`, etc.               |
| **JSX Return**                         | Divided into logical UI sections: overlay → header → tabs → messages → input |



3. Core  Dependencies
ReactMarkdown + remark + rehype → Renders markdown with syntax highlighting and math support.

4. Core Features
    - Multiple chat modes (chat / review / fix / optimize)
    - Persistent chat messages in memory
    - Filter and search messages
    - Export chat to JSON
    - Copy and resend message
    - Auto-scroll to bottom
    - Streaming mode toggle
    - Auto-save setting
    - Mobile-friendly + animations

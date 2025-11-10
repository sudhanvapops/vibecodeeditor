### getChatModePrompt(mode, content)


What it does

Builds a contextual prompt sent to the API depending on chatMode:
    - review → prefix asking for code review and best practices
    - fix → prefix asking to fix issues
    - optimize → prefix asking for performance improvements
    - default → returns content unchanged (normal chat)


Adds meta-instructions so the AI knows the intent of the user input. Good for controlling responses without changing server logic.


<!-- Todo -->
Keep prompt length reasonable. Consider explicit instruction about response format (e.g., "respond with a numbered list" or "respond with code only in triple-backticks") if you need structured responses.
If you support streaming, ensure server handles partial prompts properly.


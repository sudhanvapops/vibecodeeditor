writePrompt, currentLine, handling Enter, Backspace, Up/Down history... ALL of that is your custom logic.

xterm.js does NOT provide:

- A shell
- A prompt ($ )
- Command execution
- History navigation
- Cursor movement logic for typed text
- Backspace handling
- Printing next prompt after command
- Interpreting Enter key
- Running or killing processes
- Built-in commands like clear or history

xterm gives you:

A text grid display
APIs like write(), writeln()
Keyboard input events (onData)
Ability to render colored text
Ability to attach addons (fit, search)

When connecting xterm to a real backend shell (Node, Bash, PTY)
→ The server handles prompts, history, execution, etc.
→ You don’t need to write your own shell logic.

In that case:
You pipe server PTY → xterm
xterm input → PTY stdin
Done.
But WebContainer has no shell, only processes.
So you must simulate a shell.

#### writePrompt + how the terminal prompt works

writePrompt is a small but extremely important function.
It controls when the terminal shows:
"$"
and resets internal state so the next command can be typed cleanly.

. \r\n → moves cursor to new line
Carriage return + newline.

"$ " → prints the actual shell prompt
Just like a real CLI.

currentLine.current = ""
This clears whatever the user typed last time.
Because if you don’t reset it, the next command will start with leftover characters.
cursorPosition.current = 0

"cursor is now at the beginning of a fresh line"
No characters typed yet

This is critical for:
Backspace logic
History logic
Input insertion logic

WHy use callback?

Because this function is:
Used inside event handlers
Passed to other hooks
Referenced from expensive logic (executeCommand)

Using useCallback ensures:
The function identity does NOT change on every render
Prevents infinite re-renders
Keeps your terminal stable
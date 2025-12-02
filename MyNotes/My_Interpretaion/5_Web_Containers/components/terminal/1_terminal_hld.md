### Terminal HLD

🔭 High-Level Design (HLD)
This file defines a React terminal component that:
Uses xterm.js to render a terminal in the browser.
Connects to a WebContainer instance (like Stackblitz/WebContainer API) to actually run commands.
Simulates a simple shell experience:
- $ prompt

command history (↑ / ↓ to navigate)
basic built-ins: clear, history
Ctrl+C to kill the running process
Adds extra UX features:
Search inside terminal output
Copy selection to clipboard
Download full terminal log as .txt
Clear screen
“Mac-style” window header with status (Connected indicator)

Exposes imperative methods to parent components using forwardRef + useImperativeHandle:
writeToTerminal(text)
clearTerminal()
focusTerminal()


### Main Building Blocks

Props & Ref Interface
    TerminalProps: allows passing webContainerInstance, theme (light/dark), CSS class, etc.
    TerminalRef: methods the parent can call on this terminal.

Internal State & Refs
term: the actual xterm Terminal instance.
fitAddon, searchAddon: xterm addons.
isConnected: whether we’ve “connected” to WebContainer.

CLI state:
    currentLine: text the user is currently typing.
    cursorPosition: position in that line.
    commandHistory + historyIndex: for ↑ / ↓.
    currentProcess: the running WebContainer process.

terminalRef: DOM div where xterm will mount.


### Terminal Setup

initializeTerminal:
Creates the xterm instance.
Applies theme (light / dark).
Loads addons: fit, web links, search.
Hooks onData to your input handler.
Prints a welcome message + first $ prompt.


### Command Handling

writePrompt: prints \r\n$ and resets current line.
handleTerminalInput: interprets every character coming from the keyboard:
Enter = execute the current line.
Backspace = delete character.
Ctrl+C = kill process.
Up / Down arrows = cycle through history.
Normal characters = append to currentLine and show them.
executeCommand:
Handles built-ins: clear, history, empty line.
Otherwise:
Parses command & args.
Calls webContainerInstance.spawn(cmd, args, { terminal: { cols, rows } }).
Pipes process output into the terminal.
Waits for process exit, then shows a new prompt.


WebContainer Connection

connectToWebContainer:
Writes “Connected / Ready” messages.
Sets isConnected so UI shows green dot & “Connected”.
Utility Actions
clearTerminal: clears and reprints header + prompt.
copyTerminalContent: copies selected text from the terminal to clipboard.
downloadTerminalLog: walks through xterm’s buffer and creates a downloadable .txt file.
searchInTerminal: uses SearchAddon to jump to the next match.
Effects
useEffect #1:

Initializes the terminal on mount.
Sets up a ResizeObserver to auto-fit terminal on container resize.
Cleans up: kills running processes, disposes terminal.
useEffect #2:
When webContainerInstance becomes available, calls connectToWebContainer() once.

UI / JSX
Outer container: nice card with border, background, flex column.
Header:
Traffic light dots (red, yellow, green).
Title + “Connected” indicator.
Right-side buttons: Search, Copy, Download, Clear.

Body:
The div referenced by terminalRef that xterm attaches to.
Styled background according to theme.
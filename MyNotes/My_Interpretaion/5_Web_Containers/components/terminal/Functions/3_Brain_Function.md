### executeCommand — the brain of your custom shell

This is the MOST important function in the entire component.
It decides:
- What a “command” is
- How built-in commands behave (clear, history)
- How commands are sent to WebContainer
- How output is streamed
- How the next prompt appears


Add History
commandHistory.current.push(command);
historyIndex.current = -1; // reset to -1
historyIndex tells you which command in history the user is currently viewing.

History:
0: ls
1: npm install
2: node app.js

If user presses ↑ (Up arrow):
  historyIndex = 2 → "node app.js"
Next ↑:
  historyIndex = 1 → "npm install"
Next ↑:
  historyIndex = 0 → "ls"


### Built-in commands (your custom shell features)

These do NOT go to WebContainer.
They are handled inside your app.

(A) clear
Clears the terminal screen.
This is NOT a system clear — just xterm's screen clear.

(B) history
Prints all previous commands.

(C) Empty command (press Enter on blank line)
Typing nothing should just show the next $ .


### Parse command + arguments

Example:
npm install react

Produces:
cmd = "npm"
args = ["install", "react"]


### Execute command inside WebContainer

This is the real execution engine.
WebContainer spawns a real Node.js or shell process inside the sandbox.

### Store process reference
currentProcess.current = process;

This allows you to:
Kill it using Ctrl+C
Track status
Prevent overlapping commands


### Pipe output from WebContainer → xterm
WebContainer uses a ReadableStream for output.
You pipe it into a WritableStream that writes to xterm.
So anything printed by the process appears in your terminal.

The terminal waits until the process ends before printing new $ .


### Handle unknown commands
ouputs command not found if there are no command found like that


### Why Core
✔ Built-in shell commands
✔ Sending real commands to WebContainer
✔ Output streaming
✔ Error handling
✔ Prompt management
✔ Process lifecycle
### handleTerminalInput

This function turns raw keystrokes into meaningful actions like:
Typing characters
Running commands
Using Backspace
Navigating command history with ↑ / ↓
Killing running processes with Ctrl+C
Updating cursor and currentLine state

This is the shell input engine.

When user presses Enter:
Whatever they typed in currentLine is passed to executeCommand.
executeCommand runs it, prints output, then prints new $ .


### Backspace (\u007F)
What happens:
Removes last character from your input buffer (currentLine)
Moves cursor back (cursorPosition--)

Updates display using:
\b  \b
Which is:
Move cursor left
Replace character with space
Move cursor left again

### Ctrl + C (\u0003)
This behaves like real shells:
If a process is running → kill it
Print ^C
Start new $ prompt
This is old Unix behavior.


### ↑ up arrow ('\u001b[A')
How it works:
If not browsing history → start at last command.
Otherwise → move one command UP in history.
Clear the current input line visually.
Write the historic command.
Update currentLine and cursorPosition.
This replicates Bash behavior EXACTLY.

clears the current line
term.current.write('\r$ ' + ' '.repeat(currentLine.current.length) + '\r$ ');

This does three operations in a single write:
Return to start of line
Overwrite the entire previous input with spaces
Return again and print a fresh $ prompt
This is how real terminals overwrite lines without clearing the whole screen.

\r → Carriage return (move cursor to column 0 of current line)
$ → Write a new prompt over the old one
After executing that line:

\r$ → Move to start and print $
' '.repeat(14) → Overwrite characters with spaces
\r$ → Reset cursor at fresh prompt


### ↓ Arrow (\u001b[B)
Down arrow either:
Moves forward in history
Or returns to empty line


### Default: normal character input

This handles:

A–Z
a–z
numbers
symbols
tab
spaces

Inserts character at the correct cursor position inside currentLine
Moves cursor forward
Displays the typed character in xterm


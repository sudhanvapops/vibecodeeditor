### Utiltiy Function

### clearTerminal
clears the terminal

### copyTerminalContent
Behaviors:
The user highlights text in terminal
This function copies the selected text to clipboard

Important:
xterm.getSelection() only returns selected text, not the whole terminal
If no selection → does nothing

### downloadTerminalLog
Reads entire xterm buffer line by line
Converts it to plain text
Creates a .txt file
Triggers a browser download


### initializeTerminal

the setup / boot process for xterm

This function:

Creates the actual Terminal instance from xterm.js
Loads addons (fit, search, links)
Applies theming
Hooks keyboard input
Prints welcome message
Prints the first $ prompt
This is like “booting” your terminal.


### Attach terminal to DOM
terminal.open(terminalRef.current);
This draws xterm into the <div ref={terminalRef}>.


### Save terminal and addons to refs
You store active instances so:
Other functions can call fit()
You can run searches
You can write output later (from WebContainer)

### Hook keyboard input
terminal.onData(handleTerminalInput);
This is the “brain connection” between xterm and your shell logic.


### Fit terminal size

setTimeout(() => {
  fitAddonInstance.fit();
}, 100);

xterm needs the DOM to be rendered first
After a small delay, you resize the terminal correctly
Ensures the rows/columns match the container size
Without this, text might wrap weirdly until screen is resized.
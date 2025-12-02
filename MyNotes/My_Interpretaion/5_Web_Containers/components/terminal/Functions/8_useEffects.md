### Use effects

When the terminal gets created
How it resizes automatically
How connection happens
Cleanup on unmount
And finally, how the component renders the UI

### 1. First useEffect — Terminal Initialization + Resize Handling

### Add ResizeObserver
Xterm does NOT automatically adjust when the parent div changes size.
Without this, resizing your layout causes:
Text wrapping issues
Misaligned cursor
Weird rendering glitches
fitAddon.fit() recalculates:
Columns
Rows
Layout

#### Cleanup on unmount
clens 


### 2. Second useEffect — Connect to WebContainer
If WebContainer becomes available AFTER terminal loads
And we haven't already connected
→ connect.


Why needed?

WebContainer may load asynchronously:
You might fetch project files
You might start WebContainer on button click
You might mount component before WebContainer is ready
This effect waits until all conditions are satisfied:

✔ Terminal exists
✔ WebContainer exists
✔ Not already connected
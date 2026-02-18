### Build in this order only:

STEP 1 → Make editor show text
STEP 2 → Make editor update text
STEP 3 → Connect editor to file system
STEP 4 → Add syntax highlighting
STEP 5 → Add themes
STEP 6 → Add language support
STEP 7 → Add autocomplete
STEP 8 → Add AI ghost text
STEP 9 → Optimize performance


### Internal Flow of CodeMirror
User presses key
    ↓
EditorView captures event
    ↓
State updates
    ↓
View re-renders
    ↓
Extensions react


### Stages

Stage 1:
Basic editor

Stage 2:
Editor + syntax highlight

Stage 3:
Editor + file system

Stage 4:
Editor + Git

Stage 5:
Editor + AI ghost text

Stage 6:
Full IDE

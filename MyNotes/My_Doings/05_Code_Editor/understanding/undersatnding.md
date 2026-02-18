CodeMirror runs OUTSIDE React

React manages container.
CodeMirror manages editor.

React creates div
CodeMirror attaches to div
CodeMirror controls everything inside

### IDE has 5 separate systems:

IDE
├── 1. Editor Core (CodeMirror)
├── 2. File System (your JSON / S3)
├── 3. Language Features (syntax highlight, autocomplete)
├── 4. UI Layer (tabs, explorer)
├── 5. Intelligence Layer (AI ghost text, linting)

CodeMirror only handles #1 and part of #3


### CodeMirror is built on 3 core concepts:

EditorState → holds data
EditorView  → renders editor
Extensions  → adds features

### Extensions add:
    - syntax highlight
    - autocomplete
    - ghost text
    - themes
    - keybindings
Everything is extension.



### How to THINK when building your editor

Never think:
"How to use CodeMirror"

Instead think:
"What abilities does my editor need?"

### Your IDE needs:
Ability to show text
Ability to update text
Ability to syntax highlight
Ability to switch files
Ability to show AI ghost text
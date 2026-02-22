### Code Mirror

CodeMirror is set up as a collection of separate modules that, together, provide a full-featured text and code editor

Pieces Seprate:
    EditorState
    EditorView
    Extensions

codemirror = starter bundle
State = editor brain
View = DOM rendering

extensions[]
      ↓
EditorState.create()
      ↓
EditorView()
      ↓
attach to div
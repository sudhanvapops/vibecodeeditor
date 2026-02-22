### New Phases

Phase 1:
    Remove Monaco completely
    Create minimal CodeMirror instance
    No AI
    No file system
    No collaboration
    Just raw editor

Phase 2:
    Replace React content state with Yjs document
    Editor binds to Yjs
    Confirm multi-tab sync works

Phase 3:
    Rebuild AI suggestion system as separate module
    It listens to document changes
    It produces ghost decorations

Phase 4:
    Add WebSocket provider

Phase 5:
    Add awareness (multi-cursor)

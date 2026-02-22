/editor
   /core        → CodeMirror setup
   /sync        → Yjs document + provider
   /ai          → AI suggestion logic
   /ui          → React wrapper

inside /sync:
    createDocument(roomId)
    connectProvider(roomId)
    getYText(fileId)


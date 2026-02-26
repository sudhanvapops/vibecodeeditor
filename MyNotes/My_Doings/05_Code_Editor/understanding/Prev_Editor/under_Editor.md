### Why CRDT Y.js And what problem we are trying to solve

If two users type at the same time,
and you are using React useState(content) as source of truth,
what happens?

- The Last sent One wins and over rite efore user data

- It receives two full document strings.
- if i use setState
    - There is no concept of 
        - operation ordering
        - Which cursor poistion
        - insertion
        - merge
    - It only recives full document and it just ReWrite Everything whom ever arives First 


### What CRDT Does Instead

Insted of content = "full string"

CRDT stores:
Insert "A" at index 12 by user1
Insert "B" at index 12 by user2

And it merges deterministically.
No overwriting.
No race condition.
No data loss.

If you design it React-controlled first,
you will rewrite everything later.
Better to design:
Editor ↔ Y.Doc


### Next What should React manage?

If we remove React state entirely for document content,
What should React manage?

Should React manage:
    document text?
    cursor?
    AI suggestions?
    connected users?
    file metadata?
    UI layout?



### What Each Does 
React manages UI state.
CRDT (Yjs) manages document state.
Editor (CodeMirror) renders document state.


What React SHOULD Manage:

    1️⃣ Layout
    sidebar open/close
    panel resizing
    tabs UI
    theme toggle
    
    2️⃣ File System Metadata
    which file is active
    file tree structure
    file renaming
    creating files
    But not file contents.
    
    3️⃣ Collaboration Metadata
    connected users list
    avatars
    room ID
    connection status
    
    4️⃣ AI Control State (High Level)
    is AI loading?
    suggestion enabled?
    selected model?
    temperature?
    
But not where suggestion inserts.
That belongs to editor extension.


Y.Doc + CodeMirror binding:
    document text
    cursor positions
    selection ranges
    document changes
    merge logic
    collaborative operations

React does NOT re-render editor on every keystroke.

React (UI Brain)
    ├── layout state
    ├── active file state
    ├── connection state
    └── AI config state

Yjs (Document Brain)
    └── actual text content

CodeMirror (Renderer)
    └── reflects Yjs document

With this structure:
    You can add collaboration easily.
    You can swap transport (WebSocket → WebRTC).
    You can add persistence.
    You can add multi-tab sync.
    You can scale.

You are not building:
    A React component with an editor inside.

You are building:
    A document engine that React happens to render.

Big difference.


✅ Y.Doc should live in a separate sync layer module on the client.
❌ Not in React state
❌ Not inside the editor component
❌ Not only on the server

Each client has its own Y.Doc
        ↓
They sync changes between each other

CRDT is distributed.

There is no single “master document”.
That’s the whole point.

Client A
   Y.Doc
   CodeMirror
   WebSocket Provider
        ↕
Server (WebSocket relay only)
        ↕
Client B
   Y.Doc
   CodeMirror
   WebSocket Provider


We isolate Y.Doc because it is:
    Shared mutable distributed state
Anything shared and mutable must be isolated.


You are building:
    Multi-file IDE
    Each file has content
    Users can switch tabs

Should you create:

A) One Y.Doc per file
B) One Y.Doc per project
C) One Y.Doc per user
D) One Y.Doc globally for entire app
This decision affects performance and architecture.

One Y.Doc per PROJECT

Room = Project
Project = One Y.Doc
Y.Doc contains:
   - Y.Map (files)
   - Y.Text (file contents)
   - Metadata
They introduce something called:
Compatibility Layer

Meaning:

Old system still works
New system slowly takes control.

### Layer 1 — Local File System (START HERE)
Editor edits files locally
WITHOUT backend

No Appwrite.
No Git.
No sync.

Just local truth.


### Layer 2 — Persistence
Now ask:
If refresh happens, do files survive?
IndexedDB
Still NO backend.


### Layer 3 — Cloud Save
Only now:
Local → Appwrite
Background sync.


### Layer 4 — Project Loading
Download project → hydrate local FS.


#### Layer 5 — Git
NOW Git suddenly becomes easy.
Because Git expects filesystem.
And now you have one.


Why use Replicated Browser Filesystem via indexedDB instead of 
REAL Local Filesystem
Read for more: `https://chatgpt.com/g/g-p-6993fa7760ac8191b817a6e8f4a718a3-vibe-code-editor-project-quiries/c/699ac754-1794-8323-bbbf-ef4b35826eb4`
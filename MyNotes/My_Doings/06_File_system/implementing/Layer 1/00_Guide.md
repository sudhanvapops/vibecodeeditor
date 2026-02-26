No Git.
No Appwrite.
No IndexedDB.
No collaboration.


1. Can my editor work using a filesystem that exists only in memory?

Who owns file data?
From now on:
    FileManager owns file data.
    Editor is just a viewer/editor.

If editor directly stores content in React state as the source of truth,
you haven’t built a filesystem.

So your first mindset shift:
    Editor must ask FileManager for everything.

Forget trees.
Forget folders.


Start with this mental model:

Map<string, FileRecord>
type FileRecord = {
  path: string
  content: string
  isDirty: boolean
}

Example:

"/src/index.ts" → {
  path: "/src/index.ts",
  content: "console.log('hi')",
  isDirty: false
}

That’s your entire filesystem.

Folders are just path prefixes.
Nothing more.


### STEP 2 — Define The API (Very Important)
Before implementation, define what your filesystem can do.

Write this interface first:
    interface IFileSystem {
    createFile(path: string, content?: string): void
    readFile(path: string): string | undefined
    updateFile(path: string, content: string): void
    deleteFile(path: string): void
    listFiles(): string[]
    exists(path: string): boolean
    }

First ask yourself:
    Do I need rename?
    Do I need move?
    Do I need directories?
Right now → NO.

### STEP 3 — Implement Basic CRUD

Now implement a class:
    class FileManager implements IFileSystem

Internally:
    private files = new Map<string, FileRecord>()


Rules:
    createFile throws if file exists
    updateFile sets isDirty = true
    deleteFile removes entry
    readFile returns content only

That’s it.
Don’t add features.

### STEP 4 — Connect Editor To FileManager
### STEP 5 — Test The System Without Backend


###  STOP HERE

Don’t think about persistence.
Don’t think about sync.

Make this rock solid.
You should feel:
    I understand exactly where every byte lives.
If you don’t feel that clarity yet,
stay here.

### STEP 6 — Add Dirty Tracking


### At this stage you should be able to answer confidently:

Where does file content live?
What marks a file as changed?
How do I list all dirty files?
What happens if I delete a dirty file?


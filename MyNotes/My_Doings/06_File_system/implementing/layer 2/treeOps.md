# File System Architecture – Layer Refactor

## Overview

This refactor separates **file tree mutation logic** from **UI state management**.

Previously, the Zustand store handled:

* Tree traversal
* Tree mutation
* UI state updates
* Runtime synchronization
* Database persistence
* Toast notifications

This violated the **single responsibility principle** and made the store difficult to maintain.

The system is now moving toward a **layered file system architecture**.

---

# Target Architecture

```
React UI
   ↓
Zustand Store
   ↓
FileSystem Service (future)
   /        \
TreeOps     Effects
(pure)      (side effects)
```

Each layer has a clear responsibility.

---

# Layer Responsibilities

## React UI

Responsible for:

* Rendering file explorer
* Triggering actions (add, delete, rename)
* Displaying UI feedback

The UI **does not mutate the file tree directly**.

---

## Zustand Store

The Zustand store acts as the **orchestration layer**.

Responsibilities:

* Holding UI state
* Managing open editor tabs
* Tracking active file
* Calling file system operations
* Triggering persistence
* Synchronizing runtime adapters

The store **does not contain file tree mutation logic anymore**.

Example responsibilities:

* `handleAddFile`
* `handleDeleteFile`
* `handleRenameFile`
* editor tab management
* runtime adapter synchronization
* persistence (`saveTemplateData`)

---

# Layer 2 – Tree Operations (Completed)

Tree operations were extracted into a dedicated module:

```
/file-system/treeOps.ts
```

These functions are **pure tree mutation functions**.

They:

* receive the current tree
* perform a mutation
* return a new updated tree

They do **not**:

* modify UI state
* call Zustand
* perform async work
* call runtime adapters
* show toast notifications

This makes them **predictable and testable**.

---

## Implemented Tree Operations

The following operations were extracted:

### renameFile

Renames a file within a folder.

Input:

* `templateData`
* `parentPath`
* `filename`
* `fileExtension`
* `newFilename`
* `newExtension`

Output:

* updated `TemplateFolder` tree

---

### renameFolder

Renames a folder within a parent directory.

Input:

* `templateData`
* `parentPath`
* `oldFolderName`
* `newFolderName`

Output:

* updated `TemplateFolder` tree

---

### deleteFile

Removes a file from a folder.

Input:

* `templateData`
* `parentPath`
* `filename`
* `fileExtension`

Output:

* updated `TemplateFolder` tree

---

### deleteFolder

Removes a folder from a parent directory.

Input:

* `templateData`
* `parentPath`
* `folderName`

Output:

* updated `TemplateFolder` tree

---

### addFile

Adds a new file to a folder.

Input:

* `templateData`
* `parentPath`
* `newFile`

Output:

* updated `TemplateFolder` tree

---

### addFolder

Adds a new folder to a parent folder.

Input:

* `templateData`
* `parentPath`
* `newFolder`

Output:

* updated `TemplateFolder` tree

---

# Folder Traversal Utility

A shared traversal utility was introduced:

```
/file-system/utilities.ts
```

### traverseFolder()

Purpose:

Navigate a folder path inside the tree structure.

Input:

* `parentPath`
* `templateData`

Output:

* the target `TemplateFolder`
* or `undefined` if path does not exist

This removed duplicated path traversal logic across all operations.

Example path traversal:

```
src/components/ui
```

is resolved by iteratively locating each folder in the tree.

---

# Current Flow (After Refactor)

```
User Action
   ↓
React UI
   ↓
Zustand Action
   ↓
treeOps Mutation
   ↓
Updated Tree
   ↓
Zustand State Update
   ↓
Persistence (saveTemplateData)
   ↓
Runtime Adapter Sync
```

This keeps **mutation logic isolated** from side effects.

---

# Layer 3 – Effects (Planned)

The next step is introducing a **FileSystem Service layer**.

This layer will handle **side effects** such as:

* database persistence
* runtime adapter synchronization
* optimistic updates
* rollback handling

Currently these effects still exist inside the Zustand store.

Future structure:

```
/file-system/FileSystemService.ts
```

Example responsibility:

```
renameFile()
  → mutate tree
  → persist change
  → sync runtime
  → notify UI
```

At that stage, Zustand will only call the service.

---

# Benefits of This Refactor

### Separation of Concerns

Tree mutations are now independent from UI state.

---

### Testability

`treeOps` functions can be unit tested without React or Zustand.

---

### Maintainability

File system logic is centralized and reusable.

---

### Scalability

This architecture supports future features such as:

* undo/redo
* collaborative editing
* CRDT based file trees
* transaction based updates

---

# Current Status

| Layer              | Status        |
| ------------------ | ------------- |
| UI                 | Complete      |
| Zustand Store      | Orchestration |
| TreeOps            | Implemented   |
| Traversal Utility  | Implemented   |
| FileSystem Service | Pending       |
| Effects Layer      | Pending       |

---

# Next Refactor Stage

Move side effects out of Zustand into a **FileSystem Service layer**.

Responsibilities to migrate:

* persistence (`saveTemplateData`)
* runtime adapter synchronization
* optimistic UI rollback logic
* operation orchestration

Once completed, Zustand will become a **thin UI adapter**.

---

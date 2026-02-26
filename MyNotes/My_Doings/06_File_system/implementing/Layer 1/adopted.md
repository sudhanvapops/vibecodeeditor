# 🧠 Playground IDE Architecture Evolution Notes

> **Purpose of this document**
>
> This file explains:
>
> * How the **old architecture behaved**
> * What problems existed
> * What architectural changes were made
> * Why the new system exists
> * Mental model behind the current design
>
> This is written so that **even after months or years**, I can reopen this and immediately understand *why things are the way they are*.

---

# 📍 Phase 1 — Original Architecture (Zustand Owned Everything)

## ✅ Initial Design Idea

At the beginning, Zustand store was responsible for:

* File explorer
* Open tabs
* Active file
* Editor content
* Dirty tracking
* Saving logic

### Store looked like:

```
Zustand Store
├── templateData
├── openFiles[]
│     ├── content
│     ├── originalContent
│     └── hasUnsavedChanges
├── activeFileId
└── editorContent
```

---

## 🔁 Data Flow (Old)

Typing inside Monaco:

```
User Types
     ↓
Monaco onChange
     ↓
updateFileContent()
     ↓
Zustand updates openFiles[]
     ↓
React rerender
     ↓
Editor receives new value
```

Editor was **fully controlled by React**.

---

## ❌ Problems Faced

### 1. Duplicate Source of Truth

Two states existed:

```
editorContent
AND
openFiles[].content
```

Both tried to represent editor data.

Result:

* Sync complexity
* Hidden bugs
* Confusing ownership

---

### 2. Heavy React Rerenders

Every keystroke caused:

```
Typing → Zustand update → React rerender
```

Issues:

* Performance degradation
* Future lag with large files
* Unnecessary UI updates

---

### 3. Wrong Ownership Model

React/Zustand owned file content.

But IDE principle is:

> **Files own content — UI only displays it**

---

### 4. Scaling Problems

Would break when adding:

* Large files
* AI suggestions
* Multiple editors
* Background sync
* Multiplayer editing

---

# 💡 Architectural Realization

Key insight:

```
Editor Content ≠ UI State
Editor Content = File System State
```

Meaning:

React should NOT own text buffers.

---

# 🚀 Phase 2 — Architecture Refactor

## Major Decision

✅ Move file ownership **outside React & Zustand**

Created:

```
FileManager
```

---

# 🧱 New Architecture Layers

---

## 1️⃣ Zustand → Workspace Layer

### Responsibility

Only manages UI/workbench state:

```
useFileExplorer
├── openFiles[]
├── activeFileId
├── templateData
```

Zustand now answers:

> Which file is open?

NOT:

> What is inside the file?

---

## 2️⃣ FileManager → Editor Filesystem (CORE)

### True Owner of Content

```
FileManager
├── Map<fileId, ManagedFile>
│       ├── content
│       ├── originalContent
│       └── isDirty
```

Responsibilities:

✅ Register file
✅ Update content
✅ Dirty tracking
✅ Saved snapshots
✅ Reactive subscriptions

---

### Example Ownership

```
fileId → Text Buffer
```

This behaves like:

* VSCode TextModel
* In-memory filesystem
* Editor buffer layer

---

## 3️⃣ Reactive Bridge (Hooks)

Created adapter hooks:

```
useFileContent(fileId)
useDirtyFiles()
```

These connect:

```
FileManager → React
```

Flow:

```
FileManager emits
        ↓
Hook subscribed
        ↓
Component rerenders
```

React becomes a **viewer**, not an owner.

---

# 🔁 New Data Flow

Typing now behaves like:

```
User Types
     ↓
Monaco Editor
     ↓
updateFileContent()
     ↓
FileManager.updateFile()
     ↓
emit()
     ↓
useFileContent()
     ↓
React updates minimally
```

---

# ✅ Major Improvements Achieved

---

## ✅ Single Source of Truth

```
FileManager = Truth
```

No duplicated editor state.

---

## ✅ Local-First Design

Editor works independently of:

* Database
* Backend
* Network
* Runtime

Persistence becomes optional.

---

## ✅ Proper Separation of Concerns

| Layer       | Responsibility |
| ----------- | -------------- |
| React       | UI             |
| Zustand     | Workspace      |
| FileManager | Files          |
| Monaco      | Editing        |
| Runtime     | Execution      |

---

## ✅ Dirty Tracking Optimization

Instead of recalculating every render:

```
dirtyCache[]
```

is maintained internally.

Fast checks:

```
O(1)
```

---

## ✅ IDE-Like Behavior

Now supports naturally:

* Tab switching
* Unsaved indicators
* Save All
* File lifecycle
* Independent buffers

---

# ⚠️ Problems Solved During Refactor

---

## Problem: Closing Files Lost State

✅ Solution:

```
registerFile()
unregisterFile()
```

File lifecycle explicitly managed.

---

## Problem: Save Logic Coupled With UI

✅ Solution:
Saving reads directly from FileManager.

```
fileManager.readFile()
```

---

## Problem: Zustand Becoming Massive

✅ Solution:
Moved editor responsibility out.

Store became lightweight again.

---

# 🧠 Mental Model (IMPORTANT)

Think of system as:

```
Browser IDE OS
```

Architecture:

```
UI (React)
      ↓
Workbench (Zustand)
      ↓
Filesystem (FileManager)
      ↓
Editor Engine (Monaco)
      ↓
Runtime / DB
```

---

# ⭐ Current Architectural State

This system now resembles:

```
VSCode Internal Design
```

Conceptual mapping:

| My System    | VSCode Equivalent |
| ------------ | ----------------- |
| FileManager  | TextModelService  |
| Zustand      | Workbench         |
| Hooks        | View Adapter      |
| Monaco       | Editor Core       |
| TemplateData | File Tree         |

---

# ⚠️ Remaining Future Upgrade

Currently Monaco is still **React controlled**:

```
<Editor value={content} />
```

Future improvement:

✅ Monaco Models per file

```
createModel()
editor.setModel()
```

Typing will completely bypass React.

---

# 🚀 Final Understanding

I am no longer building:

> A React Code Editor

I am building:

> **A Local-First IDE Runtime inside the Browser**

React is only the interface.

The real system lives underneath.

---

# 🧭 Guiding Principle Going Forward

```
Ownership First.
UI Second.
```

Whenever adding features, ask:

> Who owns this data?

If answer = React → probably wrong layer.

---

✅ End of Architecture Notes

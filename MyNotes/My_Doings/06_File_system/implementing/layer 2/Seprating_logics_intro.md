### the REAL Problem

functions like:

handleAddFile()
handleDeleteFile()
handleRenameFile()

o ALL of this:
    mutate tree
    traverse folders
    update UI
    sync runtime
    save DB
    show toast

One action = many responsibilities.

Where should file-system truth live?


### Target Architecture (We will build THIS)

                React UI
                    ↓
               Zustand Store
                    ↓
           FileSystem Service   ← ⭐ brain
            /            \
     Tree Operations     Effects
       (pure)         (side effects)


### Layer Responsibilities

1. Tree Operations (PURE LOGIC)

ONLY answers:
    “If I add/delete/rename — what does the tree become?
input tree → output tree



2. FileSystem Service ⭐ (MOST IMPORTANT)

This becomes your IDE filesystem controller.

It decides:
    User wants rename →
    update tree →
    persist →
    sync runtime →
    notify UI

This layer orchestrates everything.


3. Zustand

Zustand should 
Only:
    setTemplateData()
    openTabs()
    activeFile()

No heavy logic.

Only UI Logic
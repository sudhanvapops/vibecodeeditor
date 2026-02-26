Phase 1 — Understand Your Current Truth Flow

When a file opens…
Where does content come from?
    Directly From DB
    loads to State
    Reflect it on Editor


When switching files…

Where does content get saved?
Is it re-fetched?
Is it lost?


### Where Is The Current Source Of Truth? 

There are three copies of content:

1️⃣ templateData
Contains TemplateFile with file.content
(This originally came from DB)

2️⃣ openFiles
Each open file has:
content
originalContent
hasUnsavedChanges

3️⃣ editorContent
Separate string in state.


DB
 ↓
templateData (folder tree)
 ↓
openFiles[]
 ↓
editorContent

That is 4 layers of truth.
This is why refactoring feels overwhelming.
Because ownership is blurry.


Right now:
    templateData stores structure + content
    openFiles stores content again
    editorContent stores content again

You are duplicating file state across multiple places.
This is completely normal for a growing project. But now we clean it.


### Your Refactor Mission (Layer 1 Goal)
FileManager
   ↓
owns content

And everything else becomes a projection.

Meaning:
    Editor reads from FileManager
    openFiles becomes just UI state (which file is open)
    templateData becomes only structure (no content ownership)
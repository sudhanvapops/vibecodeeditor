### use FIle Exlporer 

### HLD

1. Purpose
    - This Zustand store manages:
        - File & folder structure (template data)
        - Open files in the editor
        - File system actions (CRUD: Create, Read, Update, Delete)
        - Editor state (content, active tabs)
        - Sync with in-browser filesystem (like web container or virtual FS)


2. Core Data Models

✅ TemplateFolder

- Represents folders in the structure. Contains:
- folderName
- items → array of files and/or subfolders

✅ TemplateFile

- Represents a single file:
- filename
- fileExtension
- content

✅ OpenFile (extends TemplateFile)

- Extra properties for editor tracking:
- id (unique, via generateFileId)
- hasUnsavedChanges
- content
- originalContent


3. State Structure

{
  playgroundId: string               // Project identifier
  templateData: TemplateFolder|null  // Root folder structure
  openFiles: OpenFile[]              // List of open files
  activeFileId: string|null          // Currently active file
  editorContent: string              // Content shown in the editor
}


📂 4. File & Tab Management:

✅ openFile(file)

- Generate unique id from file + folder path
- If already open → activate it
- If new → add to openFiles and update editor

✅ closeFile(fileId)

- Remove from openFiles
- If active → switch to last file or clear

✅ closeAllFiles()

- Iteratively closes all open files
- Shows toast success/error


5. Folder & File CRUD Operations

Each operation:

- Copies templateData (deep clone)
- Navigates via parentPath
- Mutates items[] (add/delete/rename)
- Updates Zustand state
- Calls saveTemplateData
- Optionally syncs with filesystem instance or writeFileSync


✅ Add

- handleAddFile(newFile, parentPath, writeFileSync, instance, saveTemplateData)
- handleAddFolder(newFolder, parentPath, instance, saveTemplateData)

✅ Delete

- handleDeleteFile(file, parentPath, saveTemplateData)
- handleDeleteFolder(folder, parentPath, saveTemplateData)

Also ensures:

- If deleted file is open → close it
- If folder deleted → close all files recursively

✅ Rename

- handleRenameFile(file, newName, newExt, parentPath, saveTemplateData)
    - Recompute IDs
    - Update openFiles entries
    - Update active file if needed
- handleRenameFolder(folder, newFolderName, parentPath, saveTemplateData)


6. Editor Content Sync

✅ updateFileContent(fileId, content)

- Updates content of the file in openFiles
- Sets hasUnsavedChanges if different from originalContent
- If file is active → update editorContent


7. External Integrations: 

Part	            Used For
toast (sonner)	  Feedback Notifications
writeFileSync	    Write file to filesystem
instance.fs	      Create folders physically
saveTemplateData	Persist updated folder structure
generateFileId	  Ensure consistent tracking

8. Design Pattern Overview

✅ Centralized Store — Zustand acts as the single source of truth
✅ Immutable Update Strategy — Cloning templateData before mutations
✅ Decoupled FS Sync — Works offline, syncs when writers are passed
✅ UI-Friendly — Tracks open tabs, active file, unsaved changes
✅ Reusable Utility Functions — Path traversal, ID generation
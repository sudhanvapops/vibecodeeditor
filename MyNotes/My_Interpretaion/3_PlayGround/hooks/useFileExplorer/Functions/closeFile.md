### closeFile(fileId)

1. Purpose

-  Close a specific file/tab.
-  If the closed file was active → switch to another tab or clear the editor.
-  Remove the file from openFiles.

Read current openFiles and activeFileId.
Filter out the other than Active File with file id 


If the closed file is the active tab:
    Check if there are other open files (newFiles.length > 0)
        If yes → switch to last opened tab.
        If no → no active file, editor becomes empty.

This ensures editor always shows something meaningful or nothing if no files are open.

2. Update the Zustand state:
    - Replace openFiles with filtered list
    - Update activeFileId
    - Update editorContent
The user can open multiple files inside a “project” (which is your TemplateFolder).
They can modify file contents.
When they hit Save, it needs to:
    Update the in-memory version of the file.
    Sync the change to the virtual file system (like WebContainer or Node FS).
    Persist the new state of the entire folder structure (so when they reload, all updates stay).


1. Figure out which file you’re saving
2. Get the current folder tree
3. Find the file’s path in that tree
4. Deep clone the folder
5. Replace that file’s content inside the copy
6. Sync it to your WebContainer (virtual FS)
7. Save to the Database - entire folder tree cause we are 
8. Update frontend state
9. Mark file as saved


Why Entire Folder Tree:
    Because your backend stores everything as one big JSON object (TemplateFolder) instead of separate files.
    So to update a single file, you must:
    Modify that file’s content in the tree, and
    Save the whole JSON tree back.
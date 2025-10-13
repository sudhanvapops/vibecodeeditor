### open File

1. Purpose:

- Open a file in the editor.
- If already open → switch to it.
- If not open → add it to openFiles, 
    mark it active, 
    and show its content in the editor.


User clicks a file in the sidebar
          │
          ▼
Is it already open? ──> Yes → Switch to it
          │
          No
          │
          ▼
Create OpenFile object → Add to openFiles → Set activeFileId → Show content in editor



2. generateFileId(file, templateData!)
    - Creates a unique ID for this file (usually based on path + name).
    - Ensures even files with same name in different folders don’t clash.
get().openFiles

3. Reads current open files from Zustand.
    openFiles.find(...)

4. Checks if this file is already open in a tab.


5. If the file is already open:
    -   Make it the active tab (activeFileId)
    -   Update the editor window with the file’s content
    -   Return early → nothing else needs to happen


6. If the file is not already open, 
    - create a new OpenFile object:
    - Copy all fields from file (filename, fileExtension, content)
    - Add id, hasUnsavedChanges, content, originalContent

7. Update the Zustand state:
    - Add the new file to openFiles
    - Make it the active tab
    - Show its content in the editor
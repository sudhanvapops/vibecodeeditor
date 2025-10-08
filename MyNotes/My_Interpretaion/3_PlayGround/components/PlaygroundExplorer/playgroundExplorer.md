### playgroundExplorer.tsx

It displays:

- Folders that can be expanded/collapsed
- Files that can be clicked to select
- Right-click style options (Add / Rename / Delete) for files & folders
- Dialogs (modals) that pop up to rename / create / delete items


### Props
- data,
- onFileSelect,
- selectedFile,
- title = "Files Explorer",
- onAddFile,
- onAddFolder,
- onDeleteFile,
- onDeleteFolder,
- onRenameFile,
- onRenameFolder,


### TiTle Group

- Menu for creating 
- New File Folder


1. For New File 
    - triggers handleAddRootFile()
        - setIsNewFileDialogOpen(true)
    - opens a modal to create a new file


## handleCreateFile() 
- documented in new_File_Dialog.md

## handleCreateFolder()
- documented in new_Folder_Dialog.md


### Nodes of a tree folder

1. Root folder view — shows all items (files/folders) in the root.
2. Non-root folder view — shows a single folder node (with its own items inside).


1. Root Folder
- checks for root folder 
- if yes
- Loops through every file/folder inside the root folder.
    Creates one <TemplateNode> for each item.

2. If Not
- Just renders a single node (the current folder), which itself might render its children recursively.



### Tree Template Node

- item: Could be a file (TemplateFile) or a folder (TemplateFolder).
- onFileSelect: Callback when a file is clicked.
- selectedFile: Currently selected file (for highlighting).
- level: Depth level in the sidebar (used for indentation or initial open state).
- path: Current path in the tree (for nested folders).
- Other callbacks: add/delete/rename for files/folders.

- when clicked higligts
- open in editor
- Same Dailogs for acions


### IF Folder 

- Recursively renders all children using TemplateNode.


### Recursion

Files → stop recursion (no children).
Folders → recursively call TemplateNode for folder.items.


### Key Concepts

- Type checking → differentiate file vs folder.
- Conditional rendering → files render differently from folders.
- Recursion → folders render children using TemplateNode.
- State management → control dialogs and folder collapse.
- Callbacks → communicate user actions (select, add, rename, delete) to parent.
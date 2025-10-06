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


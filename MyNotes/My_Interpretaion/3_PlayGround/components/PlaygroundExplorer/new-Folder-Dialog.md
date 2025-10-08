### New Folder Dialog

1. props

    - isOpen
    - onClose -> sets DialogOpen to false
    - onCreateFolder -> calls handleCreateFolder 


### handleCreateFolder(folderName)

- checks for root folder and onAddFolder
- if yes calls onAddFolder 
- and close the modal

- onAddFolder calls wrappedHandleAddFolder
- which calls handleAddFolder
- which calls handleAddFolder 

- which is a hook

<!-- ? Later Hooks -->



### New FIle Dialog

- To create new File
- triggered by add new file in file explorer


### props it takes

1. isOpen -> to open and close Dialog
2. onClose -> function to close
3. onCreateFile -> triggers handle Create file


### Working

    - Dialog 
    - Form For taking input and submit 

1. Form
    - File name 
    - Extenstion

2. Close Button
    - Sets modal isOpen to False and Close

3. Create Button
    - Submits the Form 
   

### Handle Submit 
    - trim the fields
    - and calls create File 

## handleCreateFile() 

- checks if its a root file 
- calls parents function wrappedHandelnew File 
- that one calls hook to create File
- setsDialogsOpener to False setIsNewFileDialogOpen(false)
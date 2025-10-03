### TemplateSelectingModal.tsx


- have a search feature to filter 
- Opens a dialog 
- we chose the template 
- continue
- when countinued the configure state changes from select to configure
- where we select project name 
- and after that It calls createPlayground()


### handleCreateProject()
- this calls the createPlayground()
- actually it calls onSubmit 
- onSubmit in parent addNewButton
- onSubmit calls createPlayground()
- finally resetState()


### createPlayground()
- just it updates the db playground 

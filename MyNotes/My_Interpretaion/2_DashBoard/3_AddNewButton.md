### Add new Button

- To add a new Playground 

- Only frontend No functionality 
- The template Selecting modal 
    uses the props of onSubmit which is passed


- Since your parent (AddNewButton) wants to:
- Refresh sidebar (router.refresh())
- Open playground in new tab
- Possibly keep track of selectedTemplate
- It’s better to keep modal controlled via props (isOpen, onClose, onSubmit).

### Data Flow
- The data comes from the selecting modal via TemplateSelectingModal
- and passed to handleSubmit() create currentUser()

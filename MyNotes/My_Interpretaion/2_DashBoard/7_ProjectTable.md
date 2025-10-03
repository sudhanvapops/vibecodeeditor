### Project Table.md

- In Page.tsx of dashBoard component it calls
- getAllPlayGround() method of the user, from there if There is any data
- This Component will trigger


This Component Shows all the Project related to that user 
and display them in dashboard 
using tables from shadcn


### Link In Table Body

- In HTML, the rel attribute on links describes the relationship between the current page and the linked page.
- When you use: rel="noopener noreferrer"

1. noopener 

    Prevents the newly opened page (in target="_blank" links) from getting access to the original page via window.opener.

    This is important for security, because without it, the new tab could run malicious JavaScript to control or redirect your original page.

2. noreferrer

    Prevents the browser from sending referrer information (like the current URL) to the new page.

    Helps with privacy.


### Table 

- Inside each table cel


#### For
- OpenProjct
- Open In New Tab

- Link tag is used 


### Marked As Fav
- calls  a component
- it passes props
    - isItMarked
    - Id

- since we are visually changin it 
- we extracted to seprate component
- and ref is forwerded cause the menu wont close automatically 


### For

- EDIT 
- DUPLICATE
- DELETE PROJECT
- COPY URL

- Respective functions used


### EDIT: Handle Edit()

- A dialog box opens
- same this functions set isOpen to true 

- From there when Save clicked 
- it calls onUpdateProject()
- which is a porp sent by page.tsx
- which actuall function is editProjectById() in index.ts

### Dupilcate handleDuplicateProject(): 

- same here 
- it calls duplicateProjectById() from index.ts
- but handleDuplicateProject() handles UI 
- where as duplicateProjectById() handles Backend 


### handleDeleteClick() && handleDeleteProject()

- same opens a Dialog Box
- in dialog You call handleDeleteProject()
- handleDeleteProject() -> onDeleteProject() from index.ts


### Copy: copyProjectUrl()

- just copys via project id 
since we make url via project id

- url = ${window.location.origin}/playgroud/${projectId}
- navigator.clipboard.writeText(url)



### Todo UI not updating layout 

- sidebar was a client component with local state that wasn't syncing with server-side updates:

What was happening:

User stars/unstars a playground
Server action updates the database 
revalidatePath() triggers layout to re-fetch data 
Layout gets new data from server 
Layout passes new data to sidebar as props 
BUT sidebar's useState never updates because React doesn't re-initialize state when props change 


### Fix

- added state 
- Added useEffect to sync props with state


### Flow

1. User clicks star button
   ↓
2. useOptimistic updates UI instantly ⚡
   ↓
3. Server action runs (toggleStarMarked)
   ↓
4. Database updated
   ↓
5. revalidatePath('/dashboard', 'layout') called
   ↓
6. Layout re-runs on server
   ↓
7. getAllPlaygroundForUser() fetches fresh data
   ↓
8. Layout passes new initialPlaygroundData to sidebar
   ↓
9. Sidebar's useEffect detects prop change
   ↓
10. setPlaygrounds(initialPlaygroundData) updates state
   ↓
11. Sidebar re-renders with correct data ✅
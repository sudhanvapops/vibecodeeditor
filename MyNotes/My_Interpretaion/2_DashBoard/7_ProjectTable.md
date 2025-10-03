### Project Table.md

- In Page.tsx of dashBoard component it calls
- getAllPlayGround() method of the user, from there if There is any data
- This Component will trigger


This Component Shows all the Project related to that user 
and display them in dashboard 
using tables from shadcn


<!-- ! MarkedasFavuite see -->

<!-- TODO -->
- onMarkasFavorite()
    - Set as Favourite is still not implimented 


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

### For

- EDIT 
- DUPLICATE
- COPY URL
- DELETE PROJECT

- Respective functions used


### EDIT: Handle Edit()

- A dialog box opens
- same this functions set isOpen to true 

- From there when Save clicked 
- it calls onUpdateProject()
- which is a porp sent by page.tsx
- which actuall function is editProjectById() in index.ts
### features / Imporvemnts

1. add synatx higligting for language
2. store files to bucket 

3. Add multi colabartion


4. inside index.ts ->  saveUpdatedCode()
    You’re checking currentUser() — good. Make sure you also verify that the user owns this playground before updating. ✅


### Fix Bug

1. File viewer upgrade any library to show folder strucure 
or 
show folder first and then files 



### 2.store files to bucket Consider 

1. Store as Git Repo (Like StackBlitz does)
When saving → Initialize a private GitHub repo via API and push files
Store only the repo URL
When loading → git clone or fetch raw contents

2. Store Each File Individually as Documents (Firestore-like)



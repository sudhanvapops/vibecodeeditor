### Find File Path

It’s used to find the full path of a given file inside a nested folder structure.
You can think of it like:
    “Given a file object, tell me in which folder (and subfolders) it lives.”

Example: 

const project = {
  folderName: "src",
  items: [
    { filename: "index", fileExtension: "js" },
    {
      folderName: "components",
      items: [
        { filename: "Header", fileExtension: "tsx" },
        { filename: "Footer", fileExtension: "tsx" }
      ]
    }
  ]
};

### Pseudo Code Anology 
DFS(folder):
  for each item in folder:
    if item is a folder:
      DFS(item)
    else if item is the file we're looking for:
      return path


We recursively search inside this subfolder, and:

pathSoFar adds the current folder name (to build a full path later)
If recursion finds the file (res is not null), we immediately return it.
This ensures we stop searching once we’ve found our target file.


### generateFileId

This function creates a unique, path-based identifier (ID) for a file inside a nested folder structure.
Find the file's path in the folder structure
Handle empty/undefined file extension

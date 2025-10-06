### Utility file 

This module scans a folder (like a project template) and produces a structured JSON representation of all files and subfolders, including file contents (limited by size). It also allows saving this structure as a JSON file and reading it back.


- AI Generated Code

### path To json


1. File is divided into three parts
    - filename
    - file extenstion
    - contnet

2. Folder -> 2 parts
    - foldername
    - itmes


### scanTemplateDirectory()

Entry point → ensures directory exists, merges options, calls recursion

- Params
    - templatePath
    - options


### processDirectory()
Recursive worker → scans files & folders, applies ignore rules


### saveTemplateStructureToJson()
Scans & writes result to a .json file


### readTemplateStructureFromJson()
Reads .json back into structure



User calls saveTemplateStructureToJson("path/to/project", "output.json")

    → scanTemplateDirectory("path/to/project")

        → validate path and merge options

        → processDirectory()

            → Loop files/folders
                → If folder → recurse
                → If file → apply ignore rules → read content (unless too big)

            → Return structured TemplateFolder object

    → Save the JSON representation to output.json



### Output Example

<!-- ! Input -->
my-template/
 ├─ index.html
 ├─ README.md
 └─ src/
     ├─ main.js
     └─ utils.js


<!-- ! Output -->
{
  "folderName": "my-template",

  "items": [
    <!-- ? Folder -->
    {
      "folderName": "src",
      "items": [
        { "filename": "main", "fileExtension": "js", "content": "..." },
        { "filename": "utils", "fileExtension": "js", "content": "..." }
      ]
    },

    {
      "filename": "index",
      "fileExtension": "html",
      "content": "..."
    },

    {
      "filename": "README",
      "fileExtension": "md",
      "content": "..."
    }
  ]
}



## Example usage:

- Basic usage with default options
const templateStructure = await scanTemplateDirectory('./templates/react-app');

- With custom options
const customOptions = {
  ignoreFiles: ['README.md', 'CHANGELOG.md'],
  ignoreFolders: ['docs', 'examples'],
  maxFileSize: 500 * 1024 // 500KB
};

const templateStructure = await scanTemplateDirectory('./templates/react-app', customOptions);

- Saving directly to a JSON file with custom options
await saveTemplateStructureToJson(
  './templates/react-app', 
  './output/react-app-template.json',
  customOptions
);
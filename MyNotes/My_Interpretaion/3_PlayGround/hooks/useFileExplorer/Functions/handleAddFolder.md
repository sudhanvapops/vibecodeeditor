### handleAddFolder(folderName, parentPath, instance, saveTemplateData)

1. Purpose
    -   Create a new folder inside another folder.
    -   Update your templateData structure.
    -   Persist the change using saveTemplateData.
    -   Optionally update editor UI if needed.

Working same as handleAddFile


User clicks "New Folder"
        │
        ▼
Clone templateData
        │
        ▼
Traverse into parentPath
        │
        ▼
Push new { folderName, items: [] }
        │
        ▼
Update state + toast
        │
        ▼
Persist with saveTemplateData

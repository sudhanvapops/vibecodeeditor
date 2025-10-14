### handleAddFile(newFile, parentPath, writeFileSync, instance, saveTemplateData)

1. Purpose
    - Add a new file to the templateData (folder structure).
    - Persist it using saveTemplateData (your storage mechanism).
    - Optionally, write it to the real filesystem (writeFileSync).
    - Open the file in the editor automatically.


If the folder structure isn’t loaded yet → abort.

Clone TemplateData -> void mutating original state directly → good practice in Zustand/React.


2. Traverse folder path

    - parentPath is a string like "src/components"
    - Split by / and walk down items[] to reach the target folder.
    - Assign currentFolder to the folder where the new file should go.

    - Add the new file to items[].
    - Update state so sidebar/file tree shows the new file.
    - Show a success notification.

    - Actually it calls at last saveUptedCode action
    - which save new file to the db 


3. WriteFileSync

    - If a filesystem writer is provided → write the file to disk or virtual filesystem.
    - Constructs full path based on parentPath.
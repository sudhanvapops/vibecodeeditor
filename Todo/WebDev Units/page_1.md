[] make Backend of clone Repo
    [X] First create Playground
    [X] Understand the flow of How Playground and its content are created
    [] Create Server Action To
        [] Download Zip the repo on bknd
        [] Unzip the repo on bknd
        [] convert folder to JSON
        [] Store it in DB
        [] unlink the local Folder


[] Make Use of Storage Bucket Appwrite
    [] For now i will use bucket and upload contnet as it is JSON format 
    [] and then link it to Mongodb
    [] later i will find a way to not use JSON and just upload .zip files


[] Email Send Sepratly While Payment 
    Use:
        • BullMQ
        • Redis
        • Background workers
    
    Flow:
        verify payment → add job → respond
        worker → sends email


[] Replace Monaco With CodeMirror
    [] Phase 1 — Replace Monaco with basic CodeMirror
    [] Phase 2 — Connect your file JSON system
    [] Phase 3 — Add syntax highlighting
    [] Phase 4 — Add tab system
    [] Phase 5 — Add AI ghost text
    [] Phase 6 — Add Git integration


[] Work Space
    [] openWorkspace(projectId)
    [] closeWorkspace(projectId)
    [] syncWorkspaceToS3(projectId)
    [] restoreWorkspaceFromS3(projectId)
    [] deleteWorkspace(projectId)

[] Export To Github
    [] New Project
    [] Existing project to git push 
    
[] See !
[] See ?
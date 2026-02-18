### How to Store In Local

/workspace/

   project123/

      .git/
      src/
      package.json


### Functions
   - openWorkspace(projectId)
   - closeWorkspace(projectId)
   - syncWorkspaceToS3(projectId)
   - restoreWorkspaceFromS3(projectId)
   - deleteWorkspace(projectId)

### Example S3 Structure

bucket/

 projects/

   project123/

      snapshot.zip

      metadata.json


### Still Have to Desgin Mongo DB Schema


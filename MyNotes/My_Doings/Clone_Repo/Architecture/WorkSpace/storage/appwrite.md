### App write architecture

User opens editor
       ↓
User writes code
       ↓
Convert to zip
       ↓
Upload zip to Appwrite Bucket
       ↓
Appwrite returns fileId
       ↓
Store fileId in MongoDB
       ↓
Later load file using fileId

### In mongodb

{
  projectId: "123",
  name: "My Project",
  storageFileId: "67a8912bc",
}

### Appwrite Storage:
Bucket
   project-files
       fileId: 67a8912bc
       content: project zip
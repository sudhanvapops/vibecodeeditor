### Version of My Idea

User opens project
   ↓
Download project snapshot from S3
   ↓
Extract to local filesystem
   ↓
Mount into Docker container
   ↓
User edits files
   ↓
Changes saved to filesystem
   ↓
Async sync to S3
   ↓
User closes project
   ↓
Upload final snapshot to S3
   ↓
Delete local filesystem



### Correct Architecture Layers

S3 → persistent storage (source of truth)
Local filesystem → temporary workspace
Docker → runtime environment
MongoDB → metadata



### Project Lifecycle State Machine

CLOSED  → only in S3
OPENING → downloading to local
OPEN    → exists locally + Docker running
CLOSING → uploading to S3
CLOSED  → local deleted


### Save 

User saves file
↓
mark workspace dirty
↓
wait 30 seconds
↓
upload snapshot


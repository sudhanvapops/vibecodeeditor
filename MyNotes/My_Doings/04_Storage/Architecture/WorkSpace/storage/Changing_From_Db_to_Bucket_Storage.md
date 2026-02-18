### Changing_From_Db_to_Bucket_Storage


<!-- ! For this I have to Change Entire Architecture of Feding to Editor also -->

Do NOT convert files to JSON and store in bucket
Store the actual files (zip archive), NOT JSON


### Correct Flow

Filesystem project folder
   ↓
zip archive
   ↓
upload zip to bucket
   ↓
store zip URL in MongoDB

### ?
convert to JSON → upload

Zip preserves:
    folder structure
    binary files
    .git folder
    permissions
JSON breaks many things.

### Appwrite S3:
- for storing files in buket


### MongoDB:
Project
id
name
s3SnapshotKey
workspaceStatus

or should i just change existing db ?

### Appwrite S3:
bucket/projects/project123/snapshot.zip

### Local filesystem:
/workspace/project123



### Open Project:
download snapshot.zip from appwrite
↓
unzip to filesystem
↓
upload to Editor 
↓ // later 
start docker 

### Close project:
zip filesystem
↓
upload to appwrite
↓
delete filesystem
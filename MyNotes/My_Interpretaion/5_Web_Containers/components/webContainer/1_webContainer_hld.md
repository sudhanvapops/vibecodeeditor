### Web Container Preview HLD

code is split into two major pieces:

A. useWebContainer Hook (the backend engine)
B. WebContainerPreview Component (the frontend IDE manager)
C. transformToWebContainerFormat Function

### A. useWebContainer Hook (the backend engine)

This hook:

1. Boots WebContainer
Calls WebContainer.boot() once
Stores the instance in state
Handles errors and loading state
Cleans up (instance.teardown()) on unmount

2. Manages filesystem writes
writeFileSync(path, content) writes files to virtual FS
Automatically creates folder structure (mkdir -p style)

3. Exposes WebContainer instance + metadata

Parent components get:
instance → main WebContainer object
isLoading → true until WebContainer ready
error → boot problems
writeFileSync → update files
serverUrl → dev server autorevealed
destroy → teardown WebContainer

This hook is like a mini operating system manager.

### B. WebContainerPreview Component (the frontend IDE manager)

This component:

1. Builds a LIVE development environment

Step-by-step pipeline:
Transform template data → Converts your JSON file tree to WebContainer filesystem format
Mount files → Writes all project files into WebContainer
Install dependencies → Runs npm install inside WebContainer
Start server → Runs npm run start and waits for server-ready event

Each step:
Updates progress UI
Prints terminal output
Changes loading state
Applies error handling

2. Shows terminal + preview iframe
During setup → Only terminal is shown
After success → Iframe shows running app + terminal below

3. Uses TerminalComponent with ref

Ref lets this component:
Write logs from install processes
Write logs from mount steps
Show server output
Print errors

Simulate real terminal output

### C. transformToWebContainerFormat Function

This function converts your custom project template format:
{
  folderName: "...",
  items: [
    { filename, fileExtension, content }
    { folderName, items: [...] }
  ]
}


Into the format WebContainer requires:
{
  "index.js": { file: { contents: "..." } }
  "src": { directory: { ... } }
}


### D. Overall Flow

Page loads
useWebContainer boots the virtual machine
WebContainerPreview detects WebContainer ready
Begins setup pipeline:

transform → mount → install → start server
All output goes to terminal
Once server is ready → preview loads iframe

User sees:
live terminal
live application preview (localhost from WebContainer)
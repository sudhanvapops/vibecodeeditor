### THE COMPLETE WORKFLOW


- There are 5 major phases:
    1) Page Load
    2) WebContainer Boot
    3) Project Setup
    4) Editor / File Sync
    5) Terminal Interactions



### PHASE 1 — PAGE LOAD

usePlayground(id)
This fetches:
Playground meta (title)
Project template (file tree)
Previous saved data

Then useWebContainer({ templateData }) runs
This is your VM layer.
It:
Calls WebContainer.boot()
Creates the browser VM
Returns:

At this moment:
VM exists
But no files mounted
No npm install
No server running
No preview
So far only boot is done.

3️⃣ Page renders WebContainerPreview

You pass:
instance
templateData
writeFileSync
etc.
Now WebContainerPreview is responsible for whole environment setup.


### PHASE 2 — WEBCONTAINERPREVIEW SETUP PIPELINE

This part is the “engine room.”

A single useEffect handles everything:
This function is the heart of your IDE.


Check if package.json exists
If project already mounted before → skip setup
Reuse running server
Reconnect Terminal
Reconnect preview

If it DOES NOT exist → setup pipeline starts.

Transform template
Mount files
Install dependencies
Start the development server

Meanwhile, WebContainer emits:
instance.on("server-ready", (port, url) => {...})


### PHASE 3 — EDITOR FLOW (User typing)

User selects a file
User edits the file in Monaco
Each keystroke triggers:
updateFileContent(fileId, newValue)
This updates only the Zustand store:

❗ No sync to VM yet.
❗ No FS write yet.

User presses Ctrl+S
Inside handleSave():
Update templateData JSON
(Deep copy and update correct node)
in DB

THE REAL WRITE HAPPENS HERE:
writeFileSync(filePath, content)
This writes into WebContainer VM filesystem.


### PHASE 4 — TERMINAL FLOW

User types something
TerminalComponent captures keyboard input:
terminal.onData(handleTerminalInput)

This handles:
Arrow keys
Typing characters
Backspace
Enter
History
ctrl + c

When user presses ENTER
executeCommand(currentLine)

executeCommand() runs inside WebContainerPreview
instance.spawn(cmd, args)
And pipes output:
process.output → terminal.write()

So logs are displayed LIVE.


### PHASE 5 — PREVIEW & HOT RELOAD FLOW

When files change:
writeFileSync writes new content to VM
Dev server inside VM detects file change
HMR reload fires
Iframe automatically reloads or refreshes component




┌─────────────────────────────────────────────────────────────────────┐
│                         MAINPLAYGROUND PAGE                          │
│                        (The Orchestrator UI)                         │
└─────────────────────────────────────────────────────────────────────┘
            │
            │ 1. Loads template + playground meta
            ▼
┌────────────────────┐
│  usePlayground()   │
│(template + files)  │
└────────────────────┘
            │
            │
            │ 2. Boot the VM
            ▼
┌─────────────────────────┐
│    useWebContainer()    │
│  boot WebContainer VM   │
│  expose instance + fs   │
│  expose writeFileSync   │
└─────────────────────────┘
            │
            │
            ▼
┌──────────────────────────────────────────────┐
│            WebContainerPreview               │
│     (Environment Setup + Preview Renderer)   │
└──────────────────────────────────────────────┘
            │
            │
            │ SETUP PIPELINE (useEffect)
            ▼
        ┌──────────────────────────────────────────────────────────────┐
        │                      SETUP PIPELINE                           │
        │  1. transformToWebContainerFormat(template)                   │
        │  2. instance.mount(files)                                     │
        │  3. instance.spawn("npm install")                             │
        │  4. instance.spawn("npm run start")                           │
        │  5. instance.on("server-ready", url) → preview iframe         │
        │  6. pipe logs → terminalRef                                   │
        └──────────────────────────────────────────────────────────────┘
            │
            │
            ▼
┌───────────────────────┐
│   TerminalComponent   │  <─── receives logs from setup (npm install/start)
│  - handle input       │
│  - execute commands   │───► instance.spawn(cmd,…)
│  - print output       │<──── process.output streams
└───────────────────────┘
            │
            │
            │ User interacts:
            │   $ ls
            │   $ cat src/App.jsx
            │   $ npm run dev
            ▼
┌────────────────────────────────────┐
│ Running Dev Server in WebContainer │
│ Serves UI → iframe preview         │
└────────────────────────────────────┘
            │
            │
            ▼
┌───────────────────────────────────────────────┐
│ iframe src={previewUrl} (YOUR LIVE PREVIEW)  │
└───────────────────────────────────────────────┘
            ▲
            │
            │ Server auto reloads when FS changes
            │
            │
┌───────────────────────────────────────────────┐
│               PlaygroundEditor                │
│ (Monaco editor tied to your file explorer)    │
└───────────────────────────────────────────────┘
            │
            │ User types:
            │    updateFileContent()
            │    hasUnsavedChanges = true
            ▼
┌──────────────────────────────┐
│   Press Ctrl+S (Save File)   │
└──────────────────────────────┘
            │
            ├──────────────────────────────────────► updateTemplateData()
            │
            ▼
┌──────────────────────────────┐
│     handleSave()             │
│ 1. findFilePath()            │
│ 2. deep clone templateData   │
│ 3. update JSON template      │
│ 4. writeFileSync(path, code) │──────────┐
└──────────────────────────────┘          │
                                          ▼
                           ┌───────────────────────────────┐
                           │    WebContainer FS Write       │
                           │ instance.fs.writeFile()        │
                           └───────────────────────────────┘
                                          │
                                          │
                                          ▼
                          ┌──────────────────────────────────────┐
                          │ Dev server detects FS change         │
                          │ Triggers HMR / reload                │
                          └──────────────────────────────────────┘
                                          │
                                          ▼
                          ┌──────────────────────────────────────┐
                          │ iframe reloads → new preview          │
                          └──────────────────────────────────────┘


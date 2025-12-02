### FULL CONNECTION FLOW between:

🔵 Page.tsx
🟣 useWebContainer (VM + FS manager)
🟢 WebContainerPreview (project setup + preview server)
🟡 TerminalComponent (command execution + output)

TOP-LEVEL BIG PICTURE

MainPlaygroundPage
│
│  (1) Initialize: useWebContainer()
│     → boot VM
│     → give instance (WebContainer)
│     → give writeFileSync()
│
├── WebContainerPreview
│     (2) Setup Project in VM
│     → transformToWebContainerFormat()
│     → instance.mount(files)
│     → instance.spawn("npm install")
│     → instance.spawn("npm run start")
│     → terminalRef.writeToTerminal(logs)
│     → iframe loads previewUrl
│
├── PlaygroundEditor
│     (3) User Edits File
│     → updateFileContent() (in Zustand)
│     → hasUnsavedChanges = true
│     → Ctrl+S = handleSave()
│           → writeFileSync(path, content)
│           → lastSyncedContent updated
│
└── TerminalComponent
      (4) User types commands
      → handleTerminalInput()
      → executeCommand(cmd)
             → instance.spawn(cmd)
             → process.output → terminal.write()

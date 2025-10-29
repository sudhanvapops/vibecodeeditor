### HLD

The MainPlaygroundPage is the core UI and logic controller of My browser-based code playground.
It combines multiple modules — file explorer, code editor, web preview, AI assistant, and saving logic — into a unified interactive coding environment.


Hook	                                Purpose
- usePlayground(id)	                    Fetches and saves project/template data from backend or local store.
- useFileExplorer()	                    Manages file/folder tree structure, open tabs, file CRUD, and active file state.
- useWebContainer({ templateData })	    Spins up and syncs the WebContainer instance to run code in-browser.
- useAISuggestions()	                Controls AI coding suggestions, triggers, and accepts/rejects logic.


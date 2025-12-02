### useWebContainer Hook

serverUrl — WebContainer will give you something like:
http://localhost:5173
after npm run start is executed inside WebContainer.
isLoading — true until WebContainer.boot() finishes.
error — store boot errors (network, unsupported browser, etc).
instance — the actual WebContainer VM instance.


### Boot WebContainer

mounted - This prevents state updates after the component unmounts.

WebContainer.boot();
This boots Node.js itself inside the browser, using WebAssembly.

This must be run:
on client
only once
inside an async function


### writeFileSync
Create folders recursively
src/components/Button.jsx
pathParts = ["src", "components", "Button.jsx"]
folderPath = "src/components"


### Destroy

This is important for:
Rebooting the VM
Switching between templates
Hot-reloading
Resetting environment
### The Big Problem 

Want Both
✔ WebContainer (WASM) runtime
✔ Docker runtime


#### But your codebase is like this:
Terminal → uses ONLY WebContainer API  
Preview → uses ONLY WebContainer API  
Setup Pipeline → uses ONLY WebContainer API

This creates a tight coupling.


If you add Docker now, everything will break.
Why?
Because Docker has completely different commands:

- Starting container
- Installing dependencies
- Exec commands via WebSocket
- Sending stdout via WS
- Detecting server-ready via SSE / logs

Nothing matches WebContainer’s API.
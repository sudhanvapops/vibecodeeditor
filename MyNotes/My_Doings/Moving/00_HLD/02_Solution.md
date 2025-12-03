### So we must introduce a new layer

Not optional.
Not for fancy architecture.
But because without it, adding Docker means rewriting 60–70% of your existing code.


The new layer is: RuntimeAdapter
This turns both runtimes into a single unified interface.


Client wants to use a Target interface (it calls Request()).
Adaptee already has useful functionality, but its method (SpecificRequest()) doesn’t match the Target interface.
Adapter acts as a bridge: it implements the Target interface (Request()), but inside, it calls the Adaptee’s SpecificRequest().
This allows the Client to use the Adaptee without changing its code.

### What is a Runtime Adapter? (HLD)

Currently:
React Component → calls WebContainer APIs

We change the architecture to:
React Component → calls Runtime API → WebContainerAdapter (or DockerAdapter)


### Example

Instead of:
instance.spawn("npm", ["install"])
We Do:
runtime.spwan("npm",["install"])

The component does NOT know if it is WASM or Docker.
The adapter knows.

This is how we keep your entire UI code unchanged.


### WHY is the adapter needed?

Think of it like this:

If your girlfriend speaks English and another speaks Hindi,
and you don’t know Hindi…
you’ll need a translator.

The RuntimeAdapter is that “translator”.
Otherwise you'd rewrite every conversation twice 



### Your Current System Without Adapter

Current:

Terminal → WebContainer
Preview → WebContainer
Pipeline → WebContainer

<!-- !! Problem with adding Docker: -->

1. Docker API:

File writes happen via REST API (/api/docker/fs/write)
Commands run over WebSocket
Server-ready comes from reading logs OR SSE
Mounting project = COPY into container
Killing container = API call

2. But WebContainer API:

File writes = instance.fs.writeFile
Commands = instance.spawn
Server ready = event emitter
Mount = instance.mount

Nothing matches.
So you cannot just "swap" WebContainer with Docker.

Thus, We NEED:
A common API:

runtime.writeFile()
runtime.spawn()
runtime.mountProject()
runtime.onServerReady()
runtime.destroy()

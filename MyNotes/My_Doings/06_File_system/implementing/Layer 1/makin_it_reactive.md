Your FileManager lives outside React.
React does NOT know when this changes.

So when this runs:
    fileManager.updateFile(id, content)

React says:
    🤷‍♂️ "Okay… but why should I rerender?"

Because React only rerenders when:
    props change
    state changes
    context changes
My FM is None


### Solution Idea

We must teach React:
    “Hey React — something external changed.”

So use useSyncExternalStore()


### Step 1 — Your Subscribe System

Inside FileManager:
    private listeners = new Set<Listener>();
People waiting for updates

subscribe():
subscribe(listener: Listener) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
}

When React subscribes:
    React → "Call me when something changes"


### Step 2 — emit()
Something changed → notify everyone watching



### Big Picture

Your FileManager = external store
React = UI
useSyncExternalStore = bridge between them


### Step 1 — React calls subscribe
useSyncExternalStore(
    fileManager.subscribe.bind(fileManager),
    ...
)

React immediately does:

const unsubscribe =
    fileManager.subscribe(onStoreChange)

React creates its own internal listener (onStoreChange).

What happens inside your subscribe?
listeners = {
   ReactListener
}

### Step 2 — React reads snapshot

Next argument:
    () => fileManager.readFile(fileId)

This is called getSnapshot.

So React runs:
    fileManager.readFile(fileId)
    and renders UI using that data.

### Step 3 — Store Changes (emit() happens)

Somewhere in your app:
fileManager.updateFile(id, content)

Inside updateFile:

this.emit()
emit()
emit() {
    this.listeners.forEach(listener => listener())
}

Now FileManager says:

📢 "Hey everyone who subscribed —
something changed!"

Remember earlier:

listeners = {
   ReactListener
}

So this runs:

ReactListener()

⚠️ Important:
    FileManager does not rerender React.
    It only calls a function.

### Step 4 — React Listener Runs

That ReactListener was created internally by React:
const onStoreChange = () => {
   checkSnapshotAgain()
}

### React Calls getSnapshot AGAIN
() => fileManager.readFile(fileId)
This is getSnapshot.


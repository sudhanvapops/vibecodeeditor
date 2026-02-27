interface ManagedFile {
    content: string
    originalContent: String
    isDirty: boolean
}

type Listener = () => void;


// By using this 
// later can create:
// class IndexedDBFileManager implements IFileManager {}
// class CRDTFileManager implements IFileManager {}
// class RemoteFileManager implements IFileManager {}

interface IFileManager {

    // Reactive contract
    subscribe(listener: Listener): () => void

    // File LifeCycle
    registerFile(fileId: string, content: string): void
    unregisterFile(fileId: string): void
    clear(): void

    // Updates
    updateFile(fileId: string, content: string): void
    markSaved(fileId: string): void

    // Reads
    readFile(fileId: string | null): string
    isDirty(fileId: string): boolean
    getDirtyFiles(): string[]
}


// Uses PUB/SUB model + useSyncExternalStore(subscribe,getSnapshot)
// EG: updateFile -> publish event (emits)
// React Component Subscribes 

// Here
//  Publisher → notify only
// React → pulls latest state itself
// Subscriber updates UI immediately

class FileManager implements IFileManager {

    // Making a hashMap
    private files = new Map<string, ManagedFile>()
    // To Make Reactive 
    private listeners = new Set<Listener>();
    // List of dirty files
    private dirtyCache: string[] = [];


    // ! Reactive code
    subscribe(listener: Listener) {
        this.listeners.add(listener)
        return () => this.listeners.delete(listener)
    }

    private emit() {
        this.listeners.forEach(l => l())
    }


    // ! For Opening File
    registerFile(fileId: string, content: string) {
        // if matching files got
        if (this.files.has(fileId)) return

        this.files.set(fileId, {
            content,
            originalContent: content,
            isDirty: false
        })
        this.recomputeDirtyCache();
        this.emit()

    }

    // ! closing file
    unregisterFile(fileId: string) {
        const existed = this.files.delete(fileId)

        if(!existed){
            console.warn(`Unregister called for unknown file: ${fileId}`)
            throw new Error(`Unregister called for unknown file: ${fileId}`)
        }

        this.recomputeDirtyCache();
        this.emit()
    }

    // ! For Updating File
    updateFile(fileId: string, content: string) {
        const file = this.files.get(fileId)
        if (!file) return

        file.content = content
        file.isDirty = content !== file.originalContent
        this.recomputeDirtyCache();
        this.emit()
    }

    // ! clear all files
    clear() {
        this.files.clear()
        this.recomputeDirtyCache();
        this.emit()
    }

    // ! Read File
    readFile(fileId: string | null) {
        if (!fileId) return ""
        return this.files.get(fileId)?.content ?? ""
    }

    isDirty(fileId: string) {
        return this.files.get(fileId)?.isDirty ?? false
    }

    getDirtyFiles() {
        return this.dirtyCache;
    }

    private recomputeDirtyCache() {
        this.dirtyCache = [...this.files.entries()]
            .filter(([_, f]) => f.isDirty)
            .map(([id]) => id);
    }

    markSaved(fileId: string) {
        const file = this.files.get(fileId)
        if (!file) return

        file.originalContent = file.content
        file.isDirty = false

        this.recomputeDirtyCache();
        this.emit()
    }
}

export const fileManager = new FileManager()

// No Zustand
// No React
// No Toast
// Pure ownership of data
type Listener = () => void;

interface ManagedFile {
    content: string
    originalContent: String
    isDirty: boolean
}


class FileManager {

    // Making a hashMap
    private files = new Map<string, ManagedFile>()

    // To Make Reactive 
    private listeners = new Set<Listener>();

    private dirtyCache: string[] = [];


    // ! Reactive code
    subscribe(listener: Listener) {
        this.listeners.add(listener)
        return () => this.listeners.delete(listener)
    }

    private emit() {
        this.listeners.forEach(l => l())
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

    // ! For Opening File
    registerFile(fileId: string, content: string) {
        // if no matching files return 
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
        this.files.delete(fileId)
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

    markSaved(fileId: string) {
        const file = this.files.get(fileId)
        if (!file) return
        this.recomputeDirtyCache();
        this.emit()

        file.originalContent = file.content
        file.isDirty = false
    }

    private recomputeDirtyCache() {
        this.dirtyCache = [...this.files.entries()]
            .filter(([_, f]) => f.isDirty)
            .map(([id]) => id);
    }

}

export const fileManager = new FileManager()

// No Zustand
// No React
// No Toast
// Pure ownership
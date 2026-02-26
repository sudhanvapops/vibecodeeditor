private recomputeDirtyCache() {
    this.dirtyCache = [...this.files.entries()]
        .filter(([_, f]) => f.isDirty)
        .map(([id]) => id);
}

Its goal :
    Rebuild a list of IDs of dirty files.


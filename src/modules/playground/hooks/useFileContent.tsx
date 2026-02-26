"use client"

import { useSyncExternalStore } from "react"
import { fileManager } from "../file-system/FileManager"


const EMPTY_ARRAY: any[] = [];
const EMPTY_STRING = "";

export function useFileContent(fileId: string | null) {

    return useSyncExternalStore(
        fileManager.subscribe.bind(fileManager),

        () => fileManager.readFile(fileId),

        () => EMPTY_STRING
    )
}

export function useDirtyFiles() {

    return useSyncExternalStore(
        fileManager.subscribe.bind(fileManager),
        () => fileManager.getDirtyFiles(),
        () => EMPTY_ARRAY
    );
}
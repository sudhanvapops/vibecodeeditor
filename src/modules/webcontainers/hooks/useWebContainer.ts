"use client"

import { useState, useEffect, useCallback } from "react";
import { WebContainer } from "@webcontainer/api";
import { TemplateFolder } from "@/modules/playground/lib/pathToJson-util";



interface useWebContainerReturn {
    serverUrl: string | null,
    isLoading: boolean,
    error: string | null,
    instance: WebContainer | null,

    writeFileSync: (path: string, content: string) => Promise<void>,
    destroy: () => void
}


export const useWebContainer = (): useWebContainerReturn => {

    const [serverUrl, setServerUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [instance, setInstance] = useState<WebContainer | null>(null)


    useEffect(() => {
        // This prevents state updates after the component unmounts.
        let mounted = true;

        async function initializeWebContainer() {
            try {
                if (!mounted) return;

                // This starts your entire virtual Linux machine.
                const webcontainerInstance = await WebContainer.boot(); // can only be called once


                setInstance(webcontainerInstance);
                setIsLoading(false);
            } catch (error) {
                console.error("Failed to initialize WebContainer:", error);
                if (mounted) {
                    setError(
                        error instanceof Error
                            ? error.message
                            : "Failed to initialize WebContainer"
                    );
                    setIsLoading(false);
                }
            }
        }


        initializeWebContainer()

        // This shuts down the VM to avoid memory leaks.
        return () => {
            mounted = false
            if (instance) {
                instance.teardown()
            }
        }

    }, [])


 
    const writeFileSync = useCallback(
        async (path: string, content: string): Promise<void> => {

            if (!instance) {
                throw new Error("WebContainer instance is not available");
            }

            try {
                // Break path into folder + file
                const pathParts = path.split("/");
                const folderPath = pathParts.slice(0, -1).join("/");

                if (folderPath) {
                    await instance.fs.mkdir(folderPath, { recursive: true }); // Create folder structure recursively inside VM
                }

                await instance.fs.writeFile(path, content);

            } catch (err) {
                const errorMessage =
                    err instanceof Error ? err.message : "Failed to write file";
                console.error(`Failed to write file at ${path}:`, err);
                throw new Error(`Failed to write file at ${path}: ${errorMessage}`);
            }
        },
        [instance]
    );

    // instance.teardown() shuts down the VM completely.
    // Clears instance + serverUrl from state.
    const destroy = useCallback(() => {
        if (instance) {
            instance.teardown()
            setInstance(null);
            setServerUrl(null)
        }
    }, [instance])

    return { serverUrl, isLoading, error, instance, writeFileSync, destroy }

}
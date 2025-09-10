"use client"

import { useState, useEffect, useCallback } from "react";
import { WebContainer } from "@webcontainer/api";
import { TemplateFolder } from "@/modules/playground/lib/pathToJson-util";


interface useWebContainerProps {
    templateData: TemplateFolder
}

interface useWebContainerReturn {
    serverUrl: string | null,
    isLoading: boolean,
    error: string | null,
    instance: WebContainer | null,

    writeFileSync: (path: string, content: string) => Promise<void>,
    destroy: () => void
}


export const useWebContainer = ({ templateData }: useWebContainerProps): useWebContainerReturn => {

    const [serverUrl, setServerUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [instance, setInstance] = useState<WebContainer | null>(null)


    useEffect(() => {
        let mounted = true;

        async function initializeWebContainer() {
            try {
                // Read Docs
                // ! Can onl be called once something like that
                const webcontainerInstance = await WebContainer.boot();

                if (!mounted) return;

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

        // See what it does
        return () => {
            mounted = false
            if (instance) {
                instance.teardown()
            }
            // destroy() // ? Cant I ?
        }

    }, [])


    // ! They give fs functions
    // When ever you write in webIDe 
    // To see output in real time 
    // We are using this to get updated
    // Learn More
    const writeFileSync = useCallback(
        async (path: string, content: string): Promise<void> => {

            if (!instance) {
                throw new Error("WebContainer instance is not available");
            }

            try {
                const pathParts = path.split("/");
                const folderPath = pathParts.slice(0, -1).join("/");

                if (folderPath) {
                    await instance.fs.mkdir(folderPath, { recursive: true }); // Create folder structure recursively
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

    const destroy = useCallback(() => {
        if (instance) {
            instance.teardown()
            setInstance(null);
            setServerUrl(null)
        }
    }, [instance])

    return { serverUrl, isLoading, error, instance, writeFileSync, destroy }

}
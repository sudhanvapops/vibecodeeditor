
import { useState, useEffect } from "react";
import { createWasmAdapter } from "../adapters/WebContainerAdapter";
// import { DockerAdapter } from "../adapters/DockerAdapter";
import type { RuntimeAdapter, RuntimeType, RuntimeConfig } from "../types";

export function useRuntime(config: RuntimeConfig) {

    const [runtime, setRuntime] = useState<RuntimeAdapter | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        // This prevents state updates after the component unmounts.
        let mounted = true;

        async function initRuntime() {

            try {

                if (config.type === "wasm") {

                    
                    const adapter = await createWasmAdapter(config);
                    if (!mounted) return
                    setRuntime(adapter)
                }
                // TODO: Docker
                //  else if (config.type === "docker") {
                //     // Initialize Docker container
                //     const res = await fetch("/api/docker/create", {
                //         method: "POST",
                //         headers: { "Content-Type": "application/json" },
                //     });

                //     if (!res.ok) {
                //         throw new Error("Failed to create Docker container");
                //     }

                //     const { containerId } = await res.json();
                //     if (mounted) {
                //         // setRuntime(new DockerAdapter(containerId));
                //     }
                // }
            } catch (err) {
                console.error(`Failed to initialize ${config.type}:`, error);

                if (mounted) {
                    setError(err instanceof Error ? err.message : "Failed to initialize runtime");
                }
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        }

        initRuntime();

        return () => {
            mounted = false;
            if (runtime) {
                runtime.destroy().catch(console.error);
            }
        };
    }, [config.type]);
    

    return { runtime, isLoading, error, };
}
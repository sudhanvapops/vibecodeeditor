// This is a Factory
// This gives the main engine 

import { WebContainer } from "@webcontainer/api";
import type { RuntimeAdapter, RuntimeProcess, RuntimeConfig } from "../types";

export async function createWasmAdapter(config: RuntimeConfig): Promise<RuntimeAdapter> {

    const wc = await WebContainer.boot();
    let serverUrl: string | null = null;

    return {

        async writeFile(path, content) {

            if (!wc) {
                throw new Error("WebContainer Instance not available")
            }

            try {
                const pathParts = path.split("/")
                const folderPath = pathParts.slice(0, -1).join("/")

                if (folderPath) { await wc.fs.mkdir(folderPath, { recursive: true }) }

                await wc.fs.writeFile(path, content)

            } catch (err) {
                const errorMessage =
                    err instanceof Error ? err.message : "Failed to write file";
                console.error(`Failed to write file at ${path}:`, err);
                throw new Error(`Failed to write file at ${path}: ${errorMessage}`);
            }
        },

        async removeFile(path: string) {
            if (!wc) throw new Error("Web Container not Available")
            wc.fs.rm(path, { recursive: true })
            try {

            } catch (err) {
                const message =
                    err instanceof Error ? err.message : "Failed to remove file";
                console.error(`Failed to remove file at ${path}:`, err);
                throw new Error(`Failed to remove file at ${path}: ${message}`);
            }
        },

        async removeFolder(path: string) {
            if (!wc) throw new Error("WebContainer not available");

            try {
                await wc.fs.rm(path, { recursive: true });
            } catch (err) {
                const message =
                    err instanceof Error ? err.message : "Failed to remove folder";
                console.error(`Failed to remove folder at ${path}:`, err);
                throw new Error(`Failed to remove folder at ${path}: ${message}`);
            }
        },

        async rename(oldPath: string, newPath: string) {
            if (!wc) throw new Error("WebContainer not available")

            try {
                await wc.fs.rename(oldPath, newPath);
            } catch (err) {
                const message =
                    err instanceof Error ? err.message : "Failed to rename";
                console.error(`Failed to rename ${oldPath} → ${newPath}`, err);
                throw new Error(`Rename failed: ${message}`);
            }
        },

        async makeFolder(path) {
            if (!wc) throw new Error("WebContainer Instance not available")

            try {
                await wc.fs.mkdir(path, { recursive: true })
            } catch (error) {
                console.error(`Failed to Make Folder at ${path}:`, error);
                throw new Error(`Failed to write file at ${path}: ${error}`);
            }
        },

        async readFile(path: string) {
            try {
                return wc.fs.readFile(path, "utf-8")
            } catch (error) {
                console.error(`Failed to  Read File at ${path}:`, error);
                throw new Error(`Failed to Read file at ${path}: ${error}`);
            }
        },


        async mountProject(files) {
            try {
                return await wc.mount(files)
            } catch (error) {
                console.error(`Failed to mountProject at ${files}:`, error);
                throw new Error(`Failed to mountProject at ${files}: ${error}`);
            }
        },

        // TODO: important later.
        // If user runs:
        // npm install
        // and destroys adapter before exit → zombie process possible.
        // Real IDEs track processes:
        // const processes = new Set()
        // Then kill on destroy.

        // Runs Commands on the server
        async spawn(cmd, args: []) {
            const proc = await wc.spawn(cmd, args)

            return {
                output: proc.output,
                exit: proc.exit
            } satisfies RuntimeProcess;
        },

        async onServerReady(cb) {
            try {
                wc.on("server-ready", (port, url) => {
                    cb(url)
                })
            } catch (error) {
                console.error(`Failed to onServerReady at ${config.type}:`, error);
                throw new Error(`Failed to onServerReady at ${config.type}: ${error}`);
            }
        },

        async destroy() {
            if (wc) { wc.teardown() }
        },

    } satisfies RuntimeAdapter

}
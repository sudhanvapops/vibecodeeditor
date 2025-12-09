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

        },

        async spawn(cmd, args = []) {

        },

        async onServerReady(cb) {

        },

        async destroy() {
            if (wc) { wc.teardown() }
        },

    } satisfies RuntimeAdapter

}
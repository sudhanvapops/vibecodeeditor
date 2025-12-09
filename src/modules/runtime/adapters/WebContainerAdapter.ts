// This is a Factory
// This gives the main engine 

import { WebContainer } from "@webcontainer/api";
import type { RuntimeAdapter, RuntimeProcess, RuntimeConfig } from "../types";

export async function createWasmAdapter(config: RuntimeConfig): Promise<RuntimeAdapter> {

    const wc = await WebContainer.boot() ;
    let serverUrl: string | null = null;

    return {

        async writeFile(path, content) {

        },

        async readFile(path) {
            
        },

        
        async mountProject() {
            
        },
        
        async spawn(cmd, args=[]){
            
        },

        async onServerReady(cb) {
            
        },

        async destroy() {

        },
    }

}
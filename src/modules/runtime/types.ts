export interface RuntimeProcess {
    output: ReadableStream<Uint8Array> | null;
    exit?: Promise<number>
}

export interface RuntimeAdapter {
    writeFile(path: string, content: string): Promise<void>;
    mountProject(files: any): Promise<void>;
    spawn(cmd: string, args?: string[]): Promise<RuntimeProcess | WebSocket>;
    onServerReady(cb: (url: string) => void): void;
    destroy(): Promise<void>;
}
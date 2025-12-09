export type RuntimeType = "wasm" | "docker";

export interface RuntimeProcess {
  output: ReadableStream;
  exit: Promise<number>;
}

export interface RuntimeAdapter {
  writeFile(path: string, content: string): Promise<void>;
  readFile(path: string): Promise<string>;
  mountProject(files: any): Promise<void>;
  spawn(cmd: string, args?: string[]): Promise<RuntimeProcess | WebSocket>;
  onServerReady(cb: (url: string) => void): void;
  destroy(): Promise<void>;
}

export interface RuntimeConfig {
  type: RuntimeType;
  projectId: string;
  containerId?: string; // Only for Docker
}
export type RuntimeType = "wasm" | "docker";

// For Spawn 
export interface RuntimeProcess {
  output: ReadableStream;
  exit: Promise<number>;
}

// Both(WebContainer and Docker )/All should adopt these methods
export interface RuntimeAdapter {
  writeFile(path: string, content: string): Promise<void>;
  makeFolder(path: string): Promise<void>;
  readFile(path: string): Promise<string>;
  mountProject(files: any): Promise<void>;
  spawn(cmd: string, args?: string[]): Promise<RuntimeProcess | WebSocket>;
  onServerReady(cb: (url: string) => void): void;
  destroy(): Promise<void>;
}

// Given for useRuntime() 
export interface RuntimeConfig {
  type: RuntimeType;
  projectId: string;
  containerId?: string; // Only for Docker
}
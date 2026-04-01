export interface ElectronAPI {
  terminalWrite: (data: string) => void
  terminalResize: (cols: number, rows: number) => void
  terminalRestart: () => void
  onTerminalData: (cb: (data: string) => void) => () => void
  onTerminalReady: (cb: () => void) => () => void
  onTerminalExit: (cb: (code: number) => void) => () => void
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}

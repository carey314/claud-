export interface EnvCheckResult {
  hasBrew: boolean
  hasTtyd: boolean
  hasClaude: boolean
  ttydRunning: boolean
  ttydPath: string
  claudePath: string
  platform: string
  arch: string
}

export interface SetupResult {
  success: boolean
  output: string
}

export interface ElectronAPI {
  getTradingData: () => Promise<any>
  onTradingDataUpdate: (cb: (data: any) => void) => () => void
  terminalWrite: (data: string) => void
  terminalResize: (cols: number, rows: number) => void
  terminalRestart: () => void
  onTerminalData: (cb: (data: string) => void) => () => void
  onTerminalReady: (cb: () => void) => () => void
  onTerminalExit: (cb: (code: number) => void) => () => void
  checkEnv: () => Promise<EnvCheckResult>
  setupTtyd: () => Promise<SetupResult>
  setupService: () => Promise<SetupResult>
  setupClaude: () => Promise<SetupResult>
  skipSetup: () => void
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}

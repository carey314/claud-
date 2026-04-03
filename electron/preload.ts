import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  // 终端
  terminalWrite: (data: string) => ipcRenderer.send('terminal:input', data),
  terminalResize: (cols: number, rows: number) => ipcRenderer.send('terminal:resize', cols, rows),
  terminalRestart: () => ipcRenderer.send('terminal:restart'),
  onTerminalData: (cb: (data: string) => void) => {
    const listener = (_e: any, data: string) => cb(data)
    ipcRenderer.on('terminal:data', listener)
    return () => ipcRenderer.removeListener('terminal:data', listener)
  },
  onTerminalReady: (cb: () => void) => {
    const listener = () => cb()
    ipcRenderer.on('terminal:ready', listener)
    return () => ipcRenderer.removeListener('terminal:ready', listener)
  },
  onTerminalExit: (cb: (code: number) => void) => {
    const listener = (_e: any, code: number) => cb(code)
    ipcRenderer.on('terminal:exit', listener)
    return () => ipcRenderer.removeListener('terminal:exit', listener)
  },

  // 交易数据（JSON 实时同步）
  getTradingData: () => ipcRenderer.invoke('trading-data:get'),
  onTradingDataUpdate: (cb: (data: any) => void) => {
    const listener = (_e: any, data: any) => cb(data)
    ipcRenderer.on('trading-data:updated', listener)
    return () => ipcRenderer.removeListener('trading-data:updated', listener)
  },

  // 环境检测 & 安装
  checkEnv: () => ipcRenderer.invoke('env:check'),
  setupTtyd: () => ipcRenderer.invoke('env:setup-ttyd'),
  setupService: () => ipcRenderer.invoke('env:setup-service'),
  setupClaude: () => ipcRenderer.invoke('env:setup-claude'),
  skipSetup: () => ipcRenderer.send('env:skip'),
})

import { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage } from 'electron'
import path from 'path'
import os from 'os'
import { fileURLToPath } from 'url'
import * as pty from 'node-pty'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const CWD = os.homedir() + '/projects/AI_Project/todoDemo/claude盯盘'

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null
let shell: pty.IPty | null = null

// ---- PTY 管理 ----
function createShell() {
  // 清除嵌套检测
  const env = { ...process.env }
  delete env.CLAUDECODE
  delete env.CLAUDE_CODE

  shell = pty.spawn(process.env.SHELL || '/bin/zsh', ['-l'], {
    name: 'xterm-256color',
    cols: 120,
    rows: 30,
    cwd: CWD,
    env,
  })

  shell.onData((data) => {
    mainWindow?.webContents.send('terminal:data', data)
  })

  shell.onExit(({ exitCode }) => {
    mainWindow?.webContents.send('terminal:exit', exitCode)
    // 自动重启 shell
    setTimeout(() => {
      createShell()
      mainWindow?.webContents.send('terminal:ready')
    }, 500)
  })
}

// ---- IPC ----
ipcMain.on('terminal:input', (_e, data: string) => {
  shell?.write(data)
})

ipcMain.on('terminal:resize', (_e, cols: number, rows: number) => {
  shell?.resize(cols, rows)
})

ipcMain.on('terminal:restart', () => {
  shell?.kill()
  createShell()
  mainWindow?.webContents.send('terminal:ready')
})

// ---- 窗口 ----
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 12, y: 12 },
    backgroundColor: '#18191c',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  // 开发 or 生产
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // 关闭窗口→隐藏到托盘
  mainWindow.on('close', (e) => {
    if (!app.isQuitting) {
      e.preventDefault()
      mainWindow?.hide()
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // 窗口就绪后启动 PTY
  mainWindow.webContents.on('did-finish-load', () => {
    if (!shell) {
      createShell()
    }
    mainWindow?.webContents.send('terminal:ready')
  })
}

// ---- 托盘 ----
function createTray() {
  // macOS 托盘图标（用 emoji 生成）
  const icon = nativeImage.createFromDataURL(
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAbwAAAG8B8aLcQwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAABNSURBVDiNY/z//z8DEwMDAwMDAxMDGQCSZoIrpKsBjKQawMjIyEA2A/7//89ENgMYGRnJZgDIFSQbAHIFyQYwkssARkZGxv///5NsAABELQ0fk/hIHwAAAABJRU5ErkJggg=='
  )
  tray = new Tray(icon.resize({ width: 16, height: 16 }))
  tray.setToolTip('盯盘终端')

  const contextMenu = Menu.buildFromTemplate([
    { label: '显示窗口', click: () => mainWindow?.show() },
    { type: 'separator' },
    {
      label: '退出', click: () => {
        app.isQuitting = true
        shell?.kill()
        app.quit()
      }
    },
  ])
  tray.setContextMenu(contextMenu)
  tray.on('click', () => mainWindow?.show())
}

// ---- 启动 ----
app.whenReady().then(() => {
  createWindow()
  createTray()

  app.on('activate', () => {
    if (!mainWindow) createWindow()
    else mainWindow.show()
  })
})

app.on('window-all-closed', () => {
  // macOS: 不退出，保持托盘
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  app.isQuitting = true
  shell?.kill()
})

// 扩展 app 类型
declare module 'electron' {
  interface App {
    isQuitting: boolean
  }
}

app.isQuitting = false

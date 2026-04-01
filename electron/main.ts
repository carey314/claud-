import { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage } from 'electron'
import path from 'path'
import os from 'os'
import fs from 'fs'
import http from 'http'
import net from 'net'
import { fileURLToPath } from 'url'
import { spawn, type ChildProcess } from 'child_process'
import * as pty from 'node-pty'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const CWD = os.homedir() + '/projects/AI_Project/todoDemo/claude盯盘'

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null
let shell: pty.IPty | null = null
let ttydProcess: ChildProcess | null = null

// ---- ttyd 管理（生产模式下为前端终端提供服务）----
function startTtyd() {
  const env = { ...process.env }
  delete env.CLAUDECODE
  delete env.CLAUDE_CODE

  ttydProcess = spawn('ttyd', [
    '--port', '7681',
    '--writable',
    '--base-path', '/terminal',
    '--max-clients', '5',
    '/bin/zsh', '-l',
  ], {
    cwd: CWD,
    env,
    stdio: 'pipe',
  })

  ttydProcess.on('error', (err) => {
    console.error('[ttyd] 启动失败:', err.message)
    console.error('[ttyd] 请确保已安装 ttyd: brew install ttyd')
  })

  ttydProcess.stderr?.on('data', () => {})
  console.log('[ttyd] 已启动 http://localhost:7681/terminal/')
}

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

// ---- 环境检测 IPC ----
function execCmd(cmd: string): Promise<string> {
  return new Promise((resolve) => {
    const child = spawn('/bin/zsh', ['-lc', cmd], { env: process.env })
    let out = ''
    child.stdout?.on('data', (d: Buffer) => { out += d.toString() })
    child.stderr?.on('data', (d: Buffer) => { out += d.toString() })
    child.on('close', () => resolve(out.trim()))
    child.on('error', () => resolve(''))
  })
}

ipcMain.handle('env:check', async () => {
  const [ttydPath, claudePath, brewPath, ttydPort] = await Promise.all([
    execCmd('which ttyd'),
    execCmd('which claude'),
    execCmd('which brew'),
    execCmd('lsof -i :7681 -t'),
  ])
  return {
    hasBrew: !!brewPath,
    hasTtyd: !!ttydPath,
    hasClaude: !!claudePath,
    ttydRunning: !!ttydPort,
    ttydPath,
    claudePath,
    platform: process.platform,
    arch: process.arch,
  }
})

ipcMain.handle('env:setup-ttyd', async () => {
  const result = await execCmd('brew install ttyd 2>&1')
  return { success: result.includes('already installed') || !result.includes('Error'), output: result }
})

ipcMain.handle('env:setup-service', async () => {
  const plistPath = `${os.homedir()}/Library/LaunchAgents/com.carey.ttyd.plist`
  const ttydPath = (await execCmd('which ttyd')).trim()
  if (!ttydPath) return { success: false, output: '请先安装 ttyd' }

  const plist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>com.carey.ttyd</string>
  <key>ProgramArguments</key>
  <array>
    <string>${ttydPath}</string>
    <string>--port</string><string>7681</string>
    <string>--writable</string>
    <string>--base-path</string><string>/terminal</string>
    <string>--max-clients</string><string>5</string>
    <string>/bin/zsh</string><string>-l</string>
  </array>
  <key>WorkingDirectory</key><string>${CWD}</string>
  <key>RunAtLoad</key><true/>
  <key>KeepAlive</key><true/>
  <key>StandardOutPath</key><string>/tmp/ttyd.log</string>
  <key>StandardErrorPath</key><string>/tmp/ttyd.err</string>
</dict>
</plist>`

  fs.writeFileSync(plistPath, plist)
  await execCmd(`launchctl unload ${plistPath} 2>/dev/null; launchctl load ${plistPath}`)
  // 等 ttyd 启动
  await new Promise(r => setTimeout(r, 1500))
  const check = await execCmd('lsof -i :7681 -t')
  return { success: !!check, output: check ? '服务已启动' : '启动失败，请手动运行 ttyd' }
})

ipcMain.handle('env:setup-claude', async () => {
  const result = await execCmd('npm install -g @anthropic-ai/claude-code 2>&1 | tail -3')
  return { success: !result.includes('ERR'), output: result }
})

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
      webSecurity: false,  // 允许 iframe 跨域加载 ttyd
    },
  })

  // 开发 or 生产
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadURL(`http://127.0.0.1:${APP_PORT}`)
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
  tray.setToolTip('看盘侠')

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

// ---- 生产模式：全局 HTTP 服务 + ttyd（只启动一次）----
const APP_PORT = 18080

function startProductionServer() {
  startTtyd()

  const distPath = path.join(__dirname, '../dist')
  const mimeTypes: Record<string, string> = {
    '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
    '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml',
  }

  const localServer = http.createServer((req, res) => {
    // /terminal/ 代理到 ttyd
    if (req.url?.startsWith('/terminal')) {
      const proxy = http.request(
        { hostname: '127.0.0.1', port: 7681, path: req.url, method: req.method, headers: req.headers },
        (pRes) => { res.writeHead(pRes.statusCode || 200, pRes.headers); pRes.pipe(res) }
      )
      req.pipe(proxy)
      proxy.on('error', () => res.end())
      return
    }

    let filePath = path.join(distPath, req.url === '/' ? 'index.html' : req.url || '')
    if (!fs.existsSync(filePath)) filePath = path.join(distPath, 'index.html')
    const ext = path.extname(filePath)
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' })
    fs.createReadStream(filePath).pipe(res)
  })

  // WebSocket 代理（ttyd 终端需要）
  localServer.on('upgrade', (req, socket, head) => {
    if (req.url?.startsWith('/terminal')) {
      const upstream = net.connect(7681, '127.0.0.1', () => {
        const rawReq = `GET ${req.url} HTTP/1.1\r\n` +
          Object.entries(req.headers).map(([k, v]) => `${k}: ${v}`).join('\r\n') + '\r\n\r\n'
        upstream.write(rawReq)
        upstream.write(head)
        socket.pipe(upstream).pipe(socket)
      })
      upstream.on('error', () => socket.destroy())
      socket.on('error', () => upstream.destroy())
    }
  })

  localServer.listen(APP_PORT, '127.0.0.1', () => {
    console.log(`[app] http://127.0.0.1:${APP_PORT}`)
  })
}

// ---- 启动 ----
app.whenReady().then(() => {
  if (!process.env.VITE_DEV_SERVER_URL) {
    startProductionServer()
  }
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
  ttydProcess?.kill()
})

// 扩展 app 类型
declare module 'electron' {
  interface App {
    isQuitting: boolean
  }
}

app.isQuitting = false

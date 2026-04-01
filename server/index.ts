import { createServer } from 'http'
import { WebSocketServer, WebSocket } from 'ws'
import { spawn, type ChildProcess } from 'child_process'
import os from 'os'

const PORT = 3001
const CWD = os.homedir() + '/projects/AI_Project/todoDemo/claude盯盘'

const server = createServer((_req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Terminal server OK')
})

const wss = new WebSocketServer({ server })

wss.on('connection', (ws: WebSocket) => {
  console.log('[ws] 客户端已连接')

  let shell: ChildProcess | null = null

  try {
    shell = spawn('/bin/zsh', ['-l'], {
      cwd: CWD,
      env: {
        ...process.env,
        TERM: 'dumb',
        LANG: 'zh_CN.UTF-8',
        // 关闭 zsh 的行编辑功能，避免乱码
        DISABLE_AUTO_UPDATE: 'true',
      },
    })

    // stdout → 前端
    shell.stdout?.on('data', (data: Buffer) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'output', stream: 'stdout', data: data.toString() }))
      }
    })

    // stderr → 前端
    shell.stderr?.on('data', (data: Buffer) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'output', stream: 'stderr', data: data.toString() }))
      }
    })

    shell.on('exit', (code) => {
      console.log(`[shell] 退出: ${code}`)
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'exit', code }))
      }
    })

    shell.on('error', (err) => {
      console.error('[shell] 错误:', err.message)
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'error', message: err.message }))
      }
    })

    // 通知前端已连接
    ws.send(JSON.stringify({ type: 'connected', cwd: CWD }))

  } catch (err: any) {
    console.error('[spawn] 失败:', err.message)
    ws.send(JSON.stringify({ type: 'error', message: err.message }))
    ws.close()
    return
  }

  // 前端消息 → shell
  ws.on('message', (raw: Buffer) => {
    try {
      const msg = JSON.parse(raw.toString())
      if (msg.type === 'input' && shell?.stdin) {
        shell.stdin.write(msg.data)
      }
    } catch {
      // 直接写入
      shell?.stdin?.write(raw.toString())
    }
  })

  ws.on('close', () => {
    console.log('[ws] 客户端断开')
    shell?.kill()
  })
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`终端服务 http://127.0.0.1:${PORT}`)
})

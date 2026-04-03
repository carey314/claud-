import { defineConfig, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import { fileURLToPath, URL } from 'node:url'
import { spawn, type ChildProcess } from 'child_process'
import fs from 'node:fs'
import path from 'node:path'

let ttydProcess: ChildProcess | null = null
const isElectronDev = !!process.env.ELECTRON_RUN || process.argv.includes('--electron')

// ttyd 终端服务（仅 Web 模式）
function ttydPlugin(): PluginOption {
  return {
    name: 'ttyd-terminal',
    configureServer() {
      if (isElectronDev) return // Electron 模式不需要 ttyd

      const env = { ...process.env }
      delete env.CLAUDECODE
      delete env.CLAUDE_CODE

      ttydProcess = spawn('ttyd', [
        '--port', '7681',
        '--writable',
        '--base-path', '/terminal',
        '/bin/zsh', '-l',
      ], {
        cwd: process.env.HOME + '/projects/AI_Project/todoDemo/claude盯盘',
        env,
        stdio: 'pipe',
      })
      ttydProcess.stderr?.on('data', () => {})
      console.log('[ttyd] http://localhost:7681/terminal/')
    },
  }
}

// 开发模式：从项目根目录服务 trading-data.json
function tradingDataPlugin(): PluginOption {
  return {
    name: 'trading-data-serve',
    configureServer(server) {
      server.middlewares.use('/trading-data.json', (_req, res) => {
        const filePath = path.resolve(__dirname, '../trading-data.json')
        try {
          const content = fs.readFileSync(filePath, 'utf-8')
          res.setHeader('Content-Type', 'application/json')
          res.end(content)
        } catch {
          res.statusCode = 404
          res.end('trading-data.json not found')
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    ttydPlugin(),
    tradingDataPlugin(),
    electron([
      {
        entry: 'electron/main.ts',
        vite: {
          build: {
            outDir: 'dist-electron',
            rollupOptions: {
              external: ['node-pty'],
            },
          },
        },
      },
      {
        entry: 'electron/preload.ts',
        onstart(args) {
          args.reload()
        },
        vite: {
          build: {
            outDir: 'dist-electron',
            rollupOptions: {
              output: { format: 'cjs' },
            },
          },
        },
      },
    ]),
    renderer(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/terminal': {
        target: 'http://127.0.0.1:7681',
        ws: true,
      },
    },
  },
})

import { defineConfig, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import { fileURLToPath, URL } from 'node:url'
import { spawn, type ChildProcess } from 'child_process'

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

export default defineConfig({
  plugins: [
    react(),
    ttydPlugin(),
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

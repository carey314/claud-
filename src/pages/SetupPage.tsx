import { useState, useEffect, useCallback } from 'react'
import { motion } from 'motion/react'
import {
  Terminal, CheckCircle2, XCircle, Loader2,
  Download, Play, ArrowRight, Coffee,
} from 'lucide-react'
import type { EnvCheckResult } from '@/types/electron'

interface StepStatus {
  status: 'pending' | 'checking' | 'ok' | 'missing' | 'installing' | 'error'
  message?: string
}

export default function SetupPage({ onReady }: { onReady: () => void }) {
  const [steps, setSteps] = useState<Record<string, StepStatus>>({
    brew: { status: 'checking' },
    ttyd: { status: 'checking' },
    service: { status: 'checking' },
    claude: { status: 'checking' },
  })
  const [allReady, setAllReady] = useState(false)
  const [envInfo, setEnvInfo] = useState<EnvCheckResult | null>(null)

  const updateStep = (key: string, update: StepStatus) => {
    setSteps(prev => ({ ...prev, [key]: update }))
  }

  // 检测环境
  const checkEnvironment = useCallback(async () => {
    const api = window.electronAPI
    if (!api) {
      // Web 模式：跳过检测
      onReady()
      return
    }

    const env = await api.checkEnv()
    setEnvInfo(env)

    updateStep('brew', env.hasBrew
      ? { status: 'ok', message: 'Homebrew 已安装' }
      : { status: 'missing', message: '需要安装 Homebrew' })

    updateStep('ttyd', env.hasTtyd
      ? { status: 'ok', message: `已安装 (${env.ttydPath})` }
      : { status: 'missing', message: '需要安装 ttyd 终端服务' })

    updateStep('service', env.ttydRunning
      ? { status: 'ok', message: '终端服务运行中 (端口 7681)' }
      : { status: 'missing', message: '终端服务未启动' })

    updateStep('claude', env.hasClaude
      ? { status: 'ok', message: `已安装 (${env.claudePath})` }
      : { status: 'missing', message: '可选 — 用于 AI 盯盘' })

    // 全部就绪
    if (env.hasTtyd && env.ttydRunning) {
      setAllReady(true)
    }
  }, [onReady])

  useEffect(() => { checkEnvironment() }, [checkEnvironment])

  // 安装 ttyd
  const installTtyd = async () => {
    const api = window.electronAPI
    if (!api) return
    updateStep('ttyd', { status: 'installing', message: '正在安装 ttyd...' })
    const result = await api.setupTtyd()
    if (result.success) {
      updateStep('ttyd', { status: 'ok', message: '安装成功' })
      // 自动启动服务
      await startService()
    } else {
      updateStep('ttyd', { status: 'error', message: result.output })
    }
  }

  // 启动服务
  const startService = async () => {
    const api = window.electronAPI
    if (!api) return
    updateStep('service', { status: 'installing', message: '正在启动终端服务...' })
    const result = await api.setupService()
    if (result.success) {
      updateStep('service', { status: 'ok', message: '服务已启动' })
      setAllReady(true)
    } else {
      updateStep('service', { status: 'error', message: result.output })
    }
  }

  // 安装 Claude
  const installClaude = async () => {
    const api = window.electronAPI
    if (!api) return
    updateStep('claude', { status: 'installing', message: '正在安装 Claude Code...' })
    const result = await api.setupClaude()
    updateStep('claude', result.success
      ? { status: 'ok', message: '安装成功' }
      : { status: 'error', message: result.output })
  }

  const stepList = [
    {
      key: 'brew', icon: Coffee, label: 'Homebrew',
      desc: 'macOS 包管理器',
      action: null, // 需要手动安装
      required: true,
    },
    {
      key: 'ttyd', icon: Terminal, label: 'ttyd 终端服务',
      desc: '浏览器内真实终端 (brew install ttyd)',
      action: installTtyd,
      required: true,
    },
    {
      key: 'service', icon: Play, label: '终端后台服务',
      desc: '开机自启 + 常驻运行 (launchd)',
      action: startService,
      required: true,
    },
    {
      key: 'claude', icon: Terminal, label: 'Claude Code',
      desc: 'AI 终端助手 (可选，后续安装)',
      action: installClaude,
      required: false,
    },
  ]

  return (
    <div className="h-screen bg-[#18191c] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg px-8"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#f59e0b]/10 border border-[#f59e0b]/20 flex items-center justify-center mx-auto mb-4">
            <Terminal size={32} className="text-[#f59e0b]" />
          </div>
          <h1 className="text-2xl font-bold text-white">盯盘终端</h1>
          <p className="text-[#9ca3af] text-sm mt-2">首次使用需要配置运行环境</p>
          {envInfo && (
            <p className="text-[#4a4b50] text-xs font-mono mt-1">
              {envInfo.platform} / {envInfo.arch}
            </p>
          )}
        </div>

        {/* 检测步骤 */}
        <div className="space-y-3 mb-8">
          {stepList.map((step, i) => {
            const s = steps[step.key]
            const Icon = step.icon
            return (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#1e1f22] border border-[#2c2e33] rounded-lg p-4 flex items-center gap-4"
              >
                {/* 状态图标 */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  s.status === 'ok' ? 'bg-[#10b981]/10' :
                  s.status === 'error' ? 'bg-[#ef4444]/10' :
                  s.status === 'installing' || s.status === 'checking' ? 'bg-[#f59e0b]/10' :
                  'bg-[#25262b]'
                }`}>
                  {s.status === 'checking' || s.status === 'installing'
                    ? <Loader2 size={18} className="text-[#f59e0b] animate-spin" />
                    : s.status === 'ok'
                    ? <CheckCircle2 size={18} className="text-[#10b981]" />
                    : s.status === 'error'
                    ? <XCircle size={18} className="text-[#ef4444]" />
                    : <Icon size={18} className="text-[#9ca3af]" />}
                </div>

                {/* 信息 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{step.label}</span>
                    {!step.required && (
                      <span className="text-[10px] text-[#9ca3af] bg-[#25262b] px-1.5 py-0.5 rounded">可选</span>
                    )}
                  </div>
                  <div className="text-xs text-[#9ca3af] mt-0.5 truncate">
                    {s.message || step.desc}
                  </div>
                </div>

                {/* 操作按钮 */}
                {s.status === 'missing' && step.action && (
                  <button
                    onClick={step.action}
                    className="px-3 py-1.5 bg-[#f59e0b] text-[#18191c] text-xs font-medium rounded-lg hover:bg-[#fbbf24] transition-colors flex items-center gap-1 shrink-0"
                  >
                    <Download size={12} />
                    安装
                  </button>
                )}
                {s.status === 'missing' && !step.action && step.key === 'brew' && (
                  <span className="text-[10px] text-[#9ca3af] font-mono shrink-0">需手动安装</span>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* 底部操作 */}
        <div className="flex items-center justify-between">
          <button
            onClick={onReady}
            className="text-xs text-[#9ca3af] hover:text-white transition-colors"
          >
            跳过设置
          </button>

          {allReady ? (
            <motion.button
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onClick={onReady}
              className="px-6 py-2.5 bg-[#f59e0b] text-[#18191c] font-medium rounded-lg hover:bg-[#fbbf24] transition-colors flex items-center gap-2"
            >
              进入盯盘终端
              <ArrowRight size={16} />
            </motion.button>
          ) : (
            <button
              onClick={checkEnvironment}
              className="px-4 py-2 bg-[#25262b] text-[#9ca3af] text-sm rounded-lg border border-[#2c2e33] hover:text-white transition-colors"
            >
              重新检测
            </button>
          )}
        </div>

        {/* Homebrew 安装提示 */}
        {steps.brew.status === 'missing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 bg-[#25262b] border border-[#2c2e33] rounded-lg p-4"
          >
            <p className="text-xs text-[#9ca3af] mb-2">请在系统终端中执行以下命令安装 Homebrew：</p>
            <code className="text-xs text-[#f59e0b] font-mono bg-[#0f1013] px-3 py-2 rounded block break-all">
              /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
            </code>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

import { useState } from 'react'
import { motion } from 'motion/react'
import {
  Clock, Plus, MoreVertical, Check, Play, RefreshCw,
  ChevronDown, ChevronRight, Terminal, Link2,
} from 'lucide-react'
import { useTradingData } from '@/store/TradingDataContext'

function Toggle({ active, onToggle }: { active: boolean; onToggle?: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`w-8 h-4 rounded-full p-0.5 flex items-center transition-colors shrink-0 ${
        active ? 'bg-[#f59e0b]' : 'bg-[#2c2e33]'
      }`}
    >
      <motion.div
        animate={{ x: active ? 16 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="w-3 h-3 bg-white rounded-full shadow-sm"
      />
    </button>
  )
}

const executionLog = [
  { time: '03-31 15:03:00', task: '收盘总结', status: 'SUCCESS', duration: '28s' },
  { time: '03-31 14:03:00', task: '尾盘机会', status: 'SUCCESS', duration: '15s' },
  { time: '03-31 08:57:00', task: '盘前扫描', status: 'SUCCESS', duration: '45s' },
  { time: '03-30 15:03:00', task: '收盘总结', status: 'SUCCESS', duration: '32s' },
  { time: '03-30 14:03:00', task: '尾盘机会', status: 'FAILED', duration: 'API Timeout' },
  { time: '03-30 08:57:00', task: '盘前扫描', status: 'SUCCESS', duration: '42s' },
]

export default function TasksPage() {
  const { cronJobs } = useTradingData()
  const [jobs, setJobs] = useState(cronJobs.map(j => ({ ...j })))
  const [expandedJob, setExpandedJob] = useState<number | null>(0)

  const toggleJob = (index: number) => {
    setJobs(prev => prev.map((j, i) => i === index ? { ...j, active: !j.active } : j))
  }

  return (
    <div className="w-full flex justify-center py-6">
      <div className="w-full max-w-3xl mx-auto px-5 space-y-7">
        {/* 头部 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-medium text-white">定时任务</h1>
            <p className="text-xs text-[#9ca3af] mt-1">
              {jobs.filter(j => j.active).length} 个任务运行中 · 来自 定时任务.md
            </p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#25262b] text-[#9ca3af] border border-[#2c2e33] rounded text-sm hover:text-white transition-colors">
              <Link2 size={14} />
              <span>同步终端</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#25262b] text-[#f59e0b] border border-[#2c2e33] rounded text-sm hover:bg-[#1e1f22] transition-colors">
              <Plus size={14} />
              <span>添加任务</span>
            </button>
          </div>
        </div>

        {/* 终端联动提示 */}
        <div className="bg-[#1a2520] border border-[#10b981]/20 rounded p-3 flex items-center gap-3">
          <Terminal size={16} className="text-[#10b981] shrink-0" />
          <div className="text-xs text-[#10b981]">
            终端已联动 — 在终端输入 <code className="bg-[#10b981]/10 px-1.5 py-0.5 rounded font-mono">开启盯盘</code> 会自动激活以下3个定时任务。任务执行结果实时同步到各 Tab。
          </div>
        </div>

        {/* 任务列表 */}
        <div className="space-y-3">
          {jobs.map((job, idx) => {
            const isExpanded = expandedJob === idx
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`bg-[#1e1f22] border border-[#2c2e33] rounded overflow-hidden ${!job.active ? 'opacity-50' : ''}`}
              >
                {/* 任务头 */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Toggle active={job.active} onToggle={() => toggleJob(idx)} />
                      <span className={`font-semibold text-sm ${job.active ? 'text-white' : 'text-[#9ca3af]'}`}>
                        {job.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                        job.active
                          ? 'text-[#f59e0b] border-[#f59e0b]/30 bg-[#f59e0b]/10'
                          : 'text-[#9ca3af] border-[#2c2e33] bg-[#25262b]'
                      }`}>
                        {job.time}
                      </span>
                      {job.active && (
                        <button className="text-[#9ca3af] hover:text-[#f59e0b] transition-colors" title="手动执行">
                          <Play size={14} />
                        </button>
                      )}
                      <button className="text-[#9ca3af] hover:text-[#e4e5e7] transition-colors">
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="pl-11 mb-2">
                    <code className="font-mono text-xs bg-[#0f1013] text-[#e4e5e7] px-2 py-1 rounded border border-[#2c2e33] inline-block">
                      {job.cmd}
                    </code>
                  </div>

                  <div className="pl-11 flex items-center text-[11px] font-mono text-[#9ca3af] gap-4">
                    <span>上次: {job.lastRun}</span>
                    {job.success && <Check size={12} className="text-[#10b981] -ml-3" />}
                    {job.active && <span>下次: {job.nextRun}</span>}
                  </div>
                </div>

                {/* 展开：执行步骤 */}
                {job.steps && job.steps.length > 0 && (
                  <>
                    <button
                      onClick={() => setExpandedJob(isExpanded ? null : idx)}
                      className="w-full px-4 py-2 border-t border-[#2c2e33] flex items-center gap-2 text-xs text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#25262b]/50 transition-colors"
                    >
                      {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                      执行步骤 ({job.steps.length})
                    </button>

                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className="px-4 pb-4 border-t border-[#2c2e33]"
                      >
                        <div className="pt-3 space-y-2">
                          {job.steps.map((step, si) => (
                            <div key={si} className="flex items-start gap-2.5 pl-11">
                              <span className="w-5 h-5 flex items-center justify-center rounded bg-[#25262b] text-[10px] font-mono text-[#9ca3af] shrink-0 mt-0.5">
                                {si + 1}
                              </span>
                              <span className="text-xs text-[#e4e5e7] leading-relaxed">{step.text}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* 执行日志 */}
        <div>
          <div className="flex items-center gap-2 text-[#9ca3af] mb-4 border-b border-[#2c2e33] pb-2">
            <Clock size={14} />
            <h2 className="text-sm font-medium">执行日志</h2>
            <span className="text-[10px] font-mono ml-auto">{executionLog.length} 条记录</span>
          </div>
          <div className="font-mono text-xs space-y-0 bg-[#0f1013] p-4 rounded border border-[#2c2e33]">
            {executionLog.map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + i * 0.03 }}
                className="flex text-[#9ca3af] py-1 hover:text-[#e4e5e7] transition-colors"
              >
                <div className="w-36">{log.time}</div>
                <div className="w-24 text-[#e4e5e7]">{log.task}</div>
                <div className={`w-20 ${log.status === 'SUCCESS' ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                  {log.status}
                </div>
                <div className="text-right flex-1">{log.duration}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 任务说明 */}
        <div className="bg-[#1e1f22] border border-[#2c2e33] rounded p-4">
          <div className="flex items-center gap-2 mb-3">
            <Terminal size={14} className="text-[#9ca3af]" />
            <h2 className="text-sm font-medium text-white">终端联动说明</h2>
          </div>
          <div className="space-y-2 text-xs text-[#9ca3af]">
            <div className="flex items-start gap-2">
              <span className="text-[#f59e0b]">1.</span>
              <span>切到终端 Tab，输入 <code className="text-[#f59e0b] bg-[#f59e0b]/10 px-1 rounded">claude</code> 进入 Claude Code</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#f59e0b]">2.</span>
              <span>输入 <code className="text-[#f59e0b] bg-[#f59e0b]/10 px-1 rounded">开启盯盘</code>，Claude 自动读取文件 + 设置3个定时任务</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#f59e0b]">3.</span>
              <span>任务会在 08:57 / 14:03 / 15:03 自动执行，结果同步到各 Tab</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#f59e0b]">4.</span>
              <span>任务级别为会话级，Claude Code 退出后过期，重新说"开启盯盘"即可恢复</span>
            </div>
          </div>
        </div>

        {/* 快捷指令 */}
        <div className="bg-[#1e1f22] border border-[#2c2e33] rounded p-4">
          <div className="flex items-center gap-2 mb-3">
            <RefreshCw size={14} className="text-[#9ca3af]" />
            <h2 className="text-sm font-medium text-white">快捷指令</h2>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { cmd: '开启盯盘', desc: '加载文件 + 拉行情 + 设3个定时任务' },
              { cmd: '保存进度', desc: '写入所有变化到md文件 + memory同步' },
              { cmd: '看持仓', desc: '拉取5只ETF实时行情 + 计算盈亏' },
              { cmd: '找妖股', desc: '扫描涨停股 + 筛选连板候选' },
            ].map((item, i) => (
              <div key={i} className="bg-[#18191c] border border-[#2c2e33] rounded p-2.5 flex items-center gap-3">
                <code className="text-xs font-mono text-[#f59e0b] bg-[#f59e0b]/10 border border-[#f59e0b]/20 px-2 py-0.5 rounded shrink-0">
                  {item.cmd}
                </code>
                <span className="text-xs text-[#9ca3af]">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

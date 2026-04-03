import { useState } from 'react'
import { motion } from 'motion/react'
import {
  ShieldAlert, TrendingUp, TrendingDown, Clock,
  Check, X, Zap, BookOpen,
} from 'lucide-react'
import { useTradingData } from '@/store/TradingDataContext'
import { pnlColor } from '@/lib/utils'

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

export default function TradingSystemPage() {
  const { entryConditions, stopRules, lessons, redLines, tradeHistory, summary } = useTradingData()
  const [conditions, setConditions] = useState(entryConditions.map(c => ({ ...c })))

  const toggleCondition = (id: number) => {
    setConditions(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c))
  }

  const allActive = conditions.every(c => c.active)
  const winTrades = tradeHistory.filter(t => t.pnl > 0)
  const loseTrades = tradeHistory.filter(t => t.pnl < 0)

  return (
    <div className="w-full px-5 py-5 pb-20 space-y-7">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium text-white">短线交易系统 {summary.systemVersion}</h1>
          <p className="text-xs text-[#9ca3af] mt-1">5条件+70%胜率门槛+不限时间/价格+严格止损 · 回测{summary.backtestTrades}笔胜率{summary.backtestWinRate}%</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded border text-sm font-mono ${
          allActive ? 'text-[#10b981] border-[#10b981]/30 bg-[#10b981]/10' : 'text-[#ef4444] border-[#ef4444]/30 bg-[#ef4444]/10'
        }`}>
          {allActive ? <Check size={14} /> : <X size={14} />}
          <span>{allActive ? '系统就绪' : '条件未满足'}</span>
        </div>
      </div>

      {/* 入场条件 */}
      <section>
        <div className="flex items-center mb-4">
          <div className="w-[3px] h-4 bg-[#f59e0b] mr-2 rounded-full" />
          <Zap size={16} className="text-[#f59e0b] mr-2" />
          <h2 className="text-sm font-bold text-[#f59e0b]">入场条件（5条，缺一不可）</h2>
        </div>
        <div className="space-y-2">
          {conditions.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-[#1e1f22] border border-[#2c2e33] rounded p-3 flex items-center justify-between ${
                !c.active && 'opacity-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 flex items-center justify-center bg-[#25262b] rounded text-xs font-mono text-[#9ca3af]">
                  {c.id}
                </span>
                <div>
                  <div className="text-[13px] text-[#e4e5e7]">{c.name}</div>
                  <div className="text-[11px] text-[#9ca3af] font-mono">{c.desc}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded border text-[#f59e0b] border-[#f59e0b]/30 bg-[#f59e0b]/10">
                  {c.threshold}
                </span>
                <Toggle active={c.active} onToggle={() => toggleCondition(c.id)} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 止损止盈 */}
      <section>
        <div className="flex items-center mb-4">
          <div className="w-[3px] h-4 bg-[#06b6d4] mr-2 rounded-full" />
          <TrendingDown size={16} className="text-[#06b6d4] mr-2" />
          <h2 className="text-sm font-bold text-[#06b6d4]">止损止盈（铁律）</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
          {stopRules.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.04 }}
              className="bg-[#1e1f22] border border-[#2c2e33] rounded p-3"
            >
              <div className="text-xs text-[#9ca3af] mb-1">{r.name}</div>
              <div className="text-lg font-mono font-bold text-white">{r.value}</div>
              <div className="text-[11px] text-[#9ca3af] mt-1">{r.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 红线规则 */}
      <section>
        <div className="flex items-center mb-4">
          <div className="w-[3px] h-4 bg-[#ef4444] mr-2 rounded-full" />
          <ShieldAlert size={16} className="text-[#ef4444] mr-2" />
          <h2 className="text-sm font-bold text-[#ef4444]">红线规则（不可违反）</h2>
          <span className="ml-2 text-[10px] font-mono px-1.5 py-0.5 bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20 rounded">
            {redLines.length}条
          </span>
        </div>
        <div className="space-y-2">
          {redLines.map((line, i) => (
            <div key={i} className="bg-[#1e1f22] border border-[#2c2e33] rounded p-3 flex items-center justify-between">
              <div className="text-[13px] text-[#e4e5e7]">{line}</div>
              <Toggle active={true} />
            </div>
          ))}
        </div>
      </section>

      {/* 战绩统计 */}
      <section>
        <div className="flex items-center mb-4">
          <div className="w-[3px] h-4 bg-[#f59e0b] mr-2 rounded-full" />
          <TrendingUp size={16} className="text-[#f59e0b] mr-2" />
          <h2 className="text-sm font-bold text-[#f59e0b]">战绩统计</h2>
        </div>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {[
            { label: '总交易', value: tradeHistory.length + '笔', color: 'text-white' },
            { label: '盈利', value: winTrades.length + '笔', color: 'text-[#10b981]' },
            { label: '亏损', value: loseTrades.length + '笔', color: 'text-[#ef4444]' },
            {
              label: '已实现',
              value: (tradeHistory.reduce((s, t) => s + t.pnl, 0) >= 0 ? '+' : '') +
                tradeHistory.reduce((s, t) => s + t.pnl, 0),
              color: pnlColor(tradeHistory.reduce((s, t) => s + t.pnl, 0)),
            },
          ].map((s, i) => (
            <div key={i} className="bg-[#1e1f22] border border-[#2c2e33] rounded p-3 text-center">
              <div className="text-xs text-[#9ca3af] mb-1">{s.label}</div>
              <div className={`text-lg font-mono font-bold ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 每日工作流 */}
      <section>
        <div className="flex items-center mb-4">
          <div className="w-[3px] h-4 bg-[#9ca3af] mr-2 rounded-full" />
          <Clock size={16} className="text-[#9ca3af] mr-2" />
          <h2 className="text-sm font-bold text-[#9ca3af]">每日工作流</h2>
        </div>
        <div className="bg-[#1e1f22] border border-[#2c2e33] rounded overflow-hidden">
          {[
            { time: '08:57', action: '盘前扫描（消息面+18板块+候选）', active: true },
            { time: '09:30', action: '开盘观察，确认板块方向', active: false },
            { time: '盘中', action: '条件满足+≥70% → 立刻喊买', active: true },
            { time: '每30分钟', action: '定时扫盘', active: false },
            { time: '15:00', action: '收盘总结+更新文件+明日策略', active: true },
          ].map((w, i) => (
            <div key={i} className={`flex items-center px-4 py-2.5 border-b border-[#2c2e33] last:border-0 ${
              w.active ? '' : 'opacity-60'
            }`}>
              <span className="w-20 text-xs font-mono text-[#f59e0b] shrink-0">{w.time}</span>
              <span className="text-[13px] text-[#e4e5e7]">{w.action}</span>
              {w.active && (
                <span className="ml-auto text-[10px] text-[#10b981] font-mono px-1.5 py-0.5 bg-[#10b981]/10 border border-[#10b981]/20 rounded">自动</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 血泪教训 */}
      <section>
        <div className="flex items-center mb-4">
          <div className="w-[3px] h-4 bg-[#ef4444] mr-2 rounded-full" />
          <BookOpen size={16} className="text-[#ef4444] mr-2" />
          <h2 className="text-sm font-bold text-[#ef4444]">血泪教训</h2>
          <span className="ml-2 text-[10px] font-mono px-1.5 py-0.5 bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20 rounded">
            {lessons.length}条
          </span>
        </div>
        <div className="space-y-2">
          {lessons.map((l) => (
            <div key={l.id} className="bg-[#1e1f22] border border-[#2c2e33] rounded p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-[#ef4444]">#{l.id}</span>
                <span className="text-[13px] text-[#e4e5e7] font-medium">{l.title}</span>
              </div>
              <div className="text-[11px] text-[#9ca3af] pl-6">{l.detail}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

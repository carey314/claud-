import { motion } from 'motion/react'
import { Flame, TrendingUp, Ban, Info } from 'lucide-react'
import { useTradingData } from '@/store/TradingDataContext'
import { formatPercent } from '@/lib/utils'

function GradeTag({ grade }: { grade: 'A' | 'B' | 'C' }) {
  const styles = {
    A: 'text-[#f59e0b] border-[#f59e0b]/30 bg-[#f59e0b]/10',
    B: 'text-[#06b6d4] border-[#06b6d4]/30 bg-[#06b6d4]/10',
    C: 'text-[#9ca3af] border-[#2c2e33] bg-[#25262b]',
  }
  return (
    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border font-bold ${styles[grade]}`}>
      {grade}级
    </span>
  )
}

function ProbabilityBar({ value }: { value: number }) {
  if (value <= 0) return null
  const color = value >= 50 ? 'bg-[#f59e0b]' : value >= 40 ? 'bg-[#06b6d4]' : 'bg-[#9ca3af]'
  return (
    <div className="flex items-center gap-2 shrink-0">
      <div className="w-16 h-1.5 bg-[#18191c] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
      <span className="text-[10px] font-mono text-[#9ca3af]">{value}%</span>
    </div>
  )
}

export default function MonsterStockPage() {
  const { monsterCandidates, sectorStrength } = useTradingData()
  const aCandidates = monsterCandidates.filter(c => c.grade === 'A')
  const bCandidates = monsterCandidates.filter(c => c.grade === 'B')

  const excludeList = [
    { code: '600396', name: '华电辽能', reason: '停牌核查' },
    { code: '600726', name: '华电能源', reason: '已涨151%' },
    { code: '603687', name: '大胜达', reason: '已涨64%' },
    { code: '000720', name: '新能泰山', reason: '3连板追高风险' },
    { code: '002082', name: '万邦德', reason: '3连板+26元高价' },
  ]

  return (
    <div className="w-full px-5 py-5 pb-20 space-y-5">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium text-white flex items-center gap-2">
            <Flame size={18} className="text-[#f59e0b]" />
            妖股监控
          </h1>
          <p className="text-xs text-[#9ca3af] mt-1">连板追踪 · 板块强度 · 候选筛选 · 更新于 3/30 收盘</p>
        </div>
      </div>

      {/* 筛选逻辑 */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1e1f22] border border-[#2c2e33] rounded p-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <Info size={14} className="text-[#06b6d4]" />
          <h2 className="text-sm font-medium text-[#06b6d4]">入场逻辑</h2>
        </div>
        <div className="grid grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { step: 'Day 1', action: '首板观察', detail: '只看不买' },
            { step: 'Day 2', action: '尾盘确认', detail: '高开+封板→入场5K' },
            { step: 'Day 3-4', action: '持有', detail: '看是否继续' },
            { step: '出场', action: '开板/放量', detail: '开板≥3次→立出' },
            { step: '止损', action: '-5%', detail: '次日低开直接卖' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-xs font-mono text-[#f59e0b] mb-1">{s.step}</div>
              <div className="text-sm text-[#e4e5e7]">{s.action}</div>
              <div className="text-[10px] text-[#9ca3af] mt-0.5">{s.detail}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="flex gap-4">
        {/* A/B级候选 */}
        <div className="flex-1 min-w-0 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <GradeTag grade="A" />
              <span className="text-sm font-medium text-white">可入概率≥50%</span>
            </div>
            <div className="space-y-2">
              {aCandidates.map((c, i) => (
                <motion.div
                  key={c.code}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-[#1e1f22] border border-[#2c2e33] rounded p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-[#06b6d4] font-mono text-sm">{c.code}</span>
                      <span className="text-white text-sm font-medium">{c.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded border text-[#f59e0b] border-[#f59e0b]/30 bg-[#f59e0b]/10 font-mono">
                        ¥{c.price}
                      </span>
                    </div>
                    <ProbabilityBar value={c.probability} />
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-[#9ca3af]">板块：</span>
                    <span className="text-[#e4e5e7]">{c.sector}</span>
                    <span className="text-[#9ca3af] ml-2">逻辑：</span>
                    <span className="text-[#e4e5e7]">{c.logic}</span>
                  </div>
                  {c.status && (
                    <div className="mt-2 text-[11px] text-[#10b981] font-mono bg-[#10b981]/5 border border-[#10b981]/20 rounded px-2 py-1 inline-block">
                      {c.status}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <GradeTag grade="B" />
              <span className="text-sm font-medium text-white">可入概率35-49%</span>
            </div>
            <div className="space-y-2">
              {bCandidates.map((c, i) => (
                <motion.div
                  key={c.code}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                  className="bg-[#1e1f22] border border-[#2c2e33] rounded p-3"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[#06b6d4] font-mono text-sm">{c.code}</span>
                      <span className="text-[#e4e5e7] text-sm">{c.name}</span>
                      <span className="text-[10px] text-[#9ca3af] font-mono">¥{c.price} · {c.sector}</span>
                    </div>
                    <ProbabilityBar value={c.probability} />
                  </div>
                  <div className="text-xs text-[#9ca3af]">{c.logic}</div>
                  {c.status && (
                    <div className="mt-1 text-[10px] text-[#9ca3af] font-mono">{c.status}</div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧：板块强度 + 排除（sticky 跟随滚动） */}
        <div className="w-64 shrink-0 space-y-4 sticky top-0 self-start">
          {/* 板块强度 */}
          <div className="bg-[#1e1f22] border border-[#2c2e33] rounded p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={14} className="text-[#10b981]" />
              <h2 className="text-sm font-medium text-white">板块强度</h2>
            </div>
            <div className="space-y-2.5">
              {sectorStrength.map((s) => (
                <div key={s.rank} className="flex items-center gap-2">
                  <span className="w-4 text-xs font-mono text-[#9ca3af] text-right">{s.rank}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#e4e5e7]">{s.name}</span>
                      <span className={`text-xs font-mono ${s.change > 0 ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                        {formatPercent(s.change, true)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-[10px] text-[#9ca3af]">{s.limitUpCount}只涨停</span>
                      <span className={`text-[10px] px-1 py-px rounded border ${
                        s.trend === '新方向' ? 'text-[#f59e0b] border-[#f59e0b]/30 bg-[#f59e0b]/10' :
                        s.trend === '启动' ? 'text-[#10b981] border-[#10b981]/30 bg-[#10b981]/10' :
                        s.trend === '持续' ? 'text-[#06b6d4] border-[#06b6d4]/30 bg-[#06b6d4]/10' :
                        'text-[#ef4444] border-[#ef4444]/30 bg-[#ef4444]/10'
                      }`}>{s.trend}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 排除名单 */}
          <div className="bg-[#1e1f22] border border-[#2c2e33] rounded p-4">
            <div className="flex items-center gap-2 mb-3">
              <Ban size={14} className="text-[#ef4444]" />
              <h2 className="text-sm font-medium text-[#ef4444]">排除名单</h2>
            </div>
            <div className="space-y-2">
              {excludeList.map((e) => (
                <div key={e.code} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[#06b6d4] font-mono">{e.code}</span>
                    <span className="text-[#e4e5e7]">{e.name}</span>
                  </div>
                  <span className="text-[#9ca3af]">{e.reason}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

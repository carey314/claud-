import { motion } from 'motion/react'
import {
  TrendingUp, TrendingDown, Wallet, Target,
  AlertTriangle, Activity, ArrowUpRight, ArrowDownRight,
} from 'lucide-react'
import { summary, etfHoldings, stockHoldings, tradeHistory, sectorStrength, redLines } from '@/data/trading-data'
import { formatMoney, formatPercent, pnlColor } from '@/lib/utils'

function StatCard({ label, value, sub, icon: Icon, color, delay }: {
  label: string; value: string; sub?: string; icon: typeof TrendingUp; color: string; delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="bg-[#1e1f22] border border-[#2c2e33] rounded p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[#9ca3af] text-xs">{label}</span>
        <Icon size={16} className={color} />
      </div>
      <div className="text-xl font-mono font-bold text-white">{value}</div>
      {sub && <div className="text-xs font-mono text-[#9ca3af] mt-1">{sub}</div>}
    </motion.div>
  )
}

export default function DashboardPage() {
  const etfTotalPnl = etfHoldings.reduce((s, e) => s + e.pnl, 0)
  const winTrades = tradeHistory.filter(t => t.pnl > 0)
  const loseTrades = tradeHistory.filter(t => t.pnl < 0)
  const totalRealized = tradeHistory.reduce((s, t) => s + t.pnl, 0)

  const recoveryPct = Math.min(100, Math.max(0, ((summary.totalLoss - totalRealized) / summary.totalLoss) * 100))

  return (
    <div className="w-full px-5 py-5 space-y-5">
      {/* 总览卡片 */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard
          label="总资产" value={`¥${formatMoney(summary.totalAssets)}`}
          sub="三账户合计" icon={Wallet} color="text-[#f59e0b]" delay={0}
        />
        <StatCard
          label="本月已实现" value={`¥${formatMoney(totalRealized, true)}`}
          sub={`${winTrades.length}赢 / ${loseTrades.length}亏`}
          icon={totalRealized >= 0 ? TrendingUp : TrendingDown}
          color={totalRealized >= 0 ? 'text-[#10b981]' : 'text-[#ef4444]'} delay={0.05}
        />
        <StatCard
          label="ETF浮亏" value={`¥${formatMoney(etfTotalPnl, true)}`}
          sub="5只长线ETF" icon={Activity} color="text-[#ef4444]" delay={0.1}
        />
        <StatCard
          label="回本目标" value={`¥${formatMoney(Math.abs(summary.totalLoss))}`}
          sub={`约${summary.recoveryMonths}个月·月均¥${formatMoney(summary.monthTarget)}`}
          icon={Target} color="text-[#f59e0b]" delay={0.15}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 回本进度 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="col-span-2 bg-[#1e1f22] border border-[#2c2e33] rounded p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-white">回本进度</h2>
            <span className="text-xs font-mono text-[#9ca3af]">系统{summary.systemVersion} · 回测{summary.backtestTrades}笔胜率{summary.backtestWinRate}%</span>
          </div>

          {/* 进度条 */}
          <div className="relative h-3 bg-[#18191c] rounded-full overflow-hidden mb-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${recoveryPct}%` }}
              transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
              className="absolute inset-y-0 left-0 bg-[#f59e0b] rounded-full"
            />
          </div>
          <div className="flex justify-between text-xs font-mono text-[#9ca3af]">
            <span>亏损 ¥{formatMoney(Math.abs(summary.totalLoss))}</span>
            <span className="text-[#f59e0b]">{recoveryPct.toFixed(1)}%</span>
            <span>回本</span>
          </div>

          {/* 资金分布 */}
          <div className="mt-5 grid grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { label: '国信ETF', value: summary.etfTotal },
              { label: '国信个股', value: summary.stockTotal },
              { label: '国信现金', value: summary.cash },
              { label: '同花顺', value: summary.tonghuashun },
              { label: '支付宝', value: summary.zhifubao },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-xs text-[#9ca3af] mb-1">{item.label}</div>
                <div className="text-sm font-mono text-[#e4e5e7]">¥{formatMoney(item.value)}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 红线提醒 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-[#1e1f22] border border-[#2c2e33] rounded p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={14} className="text-[#ef4444]" />
            <h2 className="text-sm font-medium text-[#ef4444]">红线规则</h2>
          </div>
          <div className="space-y-2.5">
            {redLines.map((line, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span className="w-1 h-1 rounded-full bg-[#ef4444] mt-1.5 shrink-0" />
                <span className="text-[#e4e5e7]">{line}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 当前持仓速览 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#1e1f22] border border-[#2c2e33] rounded p-5"
        >
          <h2 className="text-sm font-medium text-white mb-4">当前个股</h2>
          {stockHoldings.length === 0 ? (
            <div className="text-center text-[#9ca3af] text-sm py-8">空仓中</div>
          ) : (
            <div className="space-y-3">
              {stockHoldings.map((s) => (
                <div key={s.code} className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#06b6d4] font-mono text-sm">{s.code}</span>
                      <span className="text-[#e4e5e7] text-sm">{s.name}</span>
                    </div>
                    <div className="text-xs text-[#9ca3af] mt-0.5">{s.shares}股 @ {s.cost} · {s.buyDate}买入</div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      {s.pnl >= 0
                        ? <ArrowUpRight size={14} className="text-[#10b981]" />
                        : <ArrowDownRight size={14} className="text-[#ef4444]" />}
                      <span className={`font-mono text-sm ${pnlColor(s.pnl)}`}>
                        {s.pnl >= 0 ? '+' : ''}{s.pnl}
                      </span>
                    </div>
                    <div className="text-xs text-[#f59e0b] mt-0.5">{s.status}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* 板块热度 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-[#1e1f22] border border-[#2c2e33] rounded p-5"
        >
          <h2 className="text-sm font-medium text-white mb-4">板块强度 (3/30)</h2>
          <div className="space-y-2.5">
            {sectorStrength.map((s) => (
              <div key={s.rank} className="flex items-center gap-3">
                <span className="w-5 text-xs font-mono text-[#9ca3af] text-right">{s.rank}</span>
                <span className="w-24 text-sm text-[#e4e5e7] truncate">{s.name}</span>
                <span className={`w-16 text-sm font-mono text-right ${s.change > 0 ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                  {formatPercent(s.change, true)}
                </span>
                <span className="text-xs text-[#9ca3af] truncate flex-1">{s.catalyst}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded border font-mono ${
                  s.trend === '新方向' ? 'text-[#f59e0b] border-[#f59e0b]/30 bg-[#f59e0b]/10' :
                  s.trend === '启动' ? 'text-[#10b981] border-[#10b981]/30 bg-[#10b981]/10' :
                  s.trend === '持续' ? 'text-[#06b6d4] border-[#06b6d4]/30 bg-[#06b6d4]/10' :
                  'text-[#ef4444] border-[#ef4444]/30 bg-[#ef4444]/10'
                }`}>{s.trend}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 最近交易 */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[#1e1f22] border border-[#2c2e33] rounded overflow-hidden"
      >
        <div className="px-5 py-3 border-b border-[#2c2e33]">
          <h2 className="text-sm font-medium text-white">最近交易</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#25262b] text-[#9ca3af] text-xs">
              <th className="px-5 py-2 text-left font-normal">日期</th>
              <th className="px-5 py-2 text-left font-normal">代码</th>
              <th className="px-5 py-2 text-left font-normal">名称</th>
              <th className="px-5 py-2 text-left font-normal">方向</th>
              <th className="px-5 py-2 text-right font-normal">数量</th>
              <th className="px-5 py-2 text-right font-normal">价格</th>
              <th className="px-5 py-2 text-right font-normal">盈亏</th>
              <th className="px-5 py-2 text-left font-normal pl-8">原因</th>
            </tr>
          </thead>
          <tbody className="font-mono text-xs">
            {tradeHistory.slice(0, 5).map((t, i) => (
              <tr key={i} className="border-b border-[#2c2e33] last:border-0 hover:bg-[#25262b]/50 transition-colors h-9">
                <td className="px-5 text-[#e4e5e7]">{t.date}</td>
                <td className="px-5 text-[#06b6d4]">{t.code}</td>
                <td className="px-5 text-[#e4e5e7] font-sans">{t.name}</td>
                <td className="px-5 font-sans">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] border ${
                    t.direction === '买入' ? 'text-[#10b981] border-[#10b981]/30 bg-[#10b981]/10' :
                    t.direction === '止损' ? 'text-[#ef4444] border-[#ef4444]/30 bg-[#ef4444]/10' :
                    'text-[#f59e0b] border-[#f59e0b]/30 bg-[#f59e0b]/10'
                  }`}>{t.direction}</span>
                </td>
                <td className="px-5 text-right text-[#e4e5e7]">{t.shares}</td>
                <td className="px-5 text-right text-[#e4e5e7]">{t.price.toFixed(2)}</td>
                <td className={`px-5 text-right ${pnlColor(t.pnl)}`}>
                  {t.pnl >= 0 ? '+' : ''}{t.pnl}
                </td>
                <td className="px-5 text-[#9ca3af] font-sans pl-8">{t.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  )
}

import { useState } from 'react'
import { motion } from 'motion/react'
import { RefreshCw, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { useTradingData } from '@/store/TradingDataContext'
import { formatMoney, formatPercent, pnlColor } from '@/lib/utils'

type AccountTab = 'guoxin' | 'tonghuashun' | 'zhifubao'

export default function PortfolioPage() {
  const { etfHoldings, stockHoldings, fundHoldings, summary } = useTradingData()
  const [activeAccount, setActiveAccount] = useState<AccountTab>('guoxin')

  const etfTotal = etfHoldings.reduce((s, e) => s + e.value, 0)
  const etfPnl = etfHoldings.reduce((s, e) => s + e.pnl, 0)
  const stockTotal = stockHoldings.reduce((s, h) => s + h.shares * h.price, 0)
  const stockPnl = stockHoldings.reduce((s, h) => s + h.pnl, 0)

  const thFunds = fundHoldings.filter(f => f.platform === '同花顺')
  const zfbFunds = fundHoldings.filter(f => f.platform === '支付宝')
  const thTotal = thFunds.reduce((s, f) => s + f.amount, 0)
  const thPnl = thFunds.reduce((s, f) => s + f.pnl, 0)
  const zfbTotal = zfbFunds.reduce((s, f) => s + f.amount, 0)
  const zfbPnl = zfbFunds.reduce((s, f) => s + f.pnl, 0)

  const accounts = [
    { id: 'guoxin' as const, name: '国信证券', total: etfTotal + stockTotal + summary.cash, pnl: etfPnl + stockPnl },
    { id: 'tonghuashun' as const, name: '同花顺', total: thTotal, pnl: thPnl },
    { id: 'zhifubao' as const, name: '支付宝', total: zfbTotal, pnl: zfbPnl },
  ]

  return (
    <div className="w-full px-5 py-5 space-y-5">
      {/* 账户切换 */}
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          {accounts.map((acc) => (
            <button
              key={acc.id}
              onClick={() => setActiveAccount(acc.id)}
              className={`px-4 py-2 rounded text-sm transition-colors relative ${
                activeAccount === acc.id
                  ? 'bg-[#25262b] text-white border border-[#f59e0b]/30'
                  : 'bg-[#1e1f22] text-[#9ca3af] border border-[#2c2e33] hover:text-[#e4e5e7]'
              }`}
            >
              <div className="font-medium">{acc.name}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-xs">¥{formatMoney(acc.total)}</span>
                <span className={`font-mono text-[10px] ${pnlColor(acc.pnl)}`}>
                  {acc.pnl >= 0 ? '+' : ''}{formatMoney(acc.pnl)}
                </span>
              </div>
            </button>
          ))}
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#25262b] text-[#e4e5e7] border border-[#2c2e33] rounded text-xs hover:bg-[#1e1f22] transition-colors">
          <RefreshCw size={12} />
          <span>刷新行情</span>
        </button>
      </div>

      {/* 国信证券 */}
      {activeAccount === 'guoxin' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-5"
        >
          {/* 概览 */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            {[
              { label: 'ETF市值', value: etfTotal, color: 'text-white' },
              { label: 'ETF浮亏', value: etfPnl, color: pnlColor(etfPnl) },
              { label: '个股市值', value: stockTotal, color: 'text-white' },
              { label: '可用现金', value: summary.cash, color: 'text-[#f59e0b]' },
            ].map((item, i) => (
              <div key={i} className="bg-[#1e1f22] border border-[#2c2e33] rounded p-3">
                <div className="text-xs text-[#9ca3af] mb-1">{item.label}</div>
                <div className={`text-lg font-mono font-bold ${item.color}`}>
                  ¥{formatMoney(Math.abs(item.value))}
                </div>
              </div>
            ))}
          </div>

          {/* 个股持仓 */}
          {stockHoldings.length > 0 && (
            <div className="bg-[#1e1f22] border border-[#2c2e33] rounded overflow-hidden">
              <div className="px-4 py-3 border-b border-[#2c2e33] flex items-center justify-between">
                <h2 className="text-sm font-medium text-white">个股持仓（短线）</h2>
                <span className="text-[10px] font-mono text-[#f59e0b] px-2 py-0.5 bg-[#f59e0b]/10 border border-[#f59e0b]/20 rounded">
                  5,000-8,000元/笔
                </span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#25262b] text-[#9ca3af] text-xs">
                    <th className="px-4 py-2 text-left font-normal">代码</th>
                    <th className="px-4 py-2 text-left font-normal">名称</th>
                    <th className="px-4 py-2 text-right font-normal">股数</th>
                    <th className="px-4 py-2 text-right font-normal">成本</th>
                    <th className="px-4 py-2 text-right font-normal">现价</th>
                    <th className="px-4 py-2 text-right font-normal">盈亏</th>
                    <th className="px-4 py-2 text-left font-normal pl-6">状态</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-xs">
                  {stockHoldings.map((s) => (
                    <tr key={s.code} className="border-b border-[#2c2e33] last:border-0 hover:bg-[#25262b]/50 h-10">
                      <td className="px-4 text-[#06b6d4]">{s.code}</td>
                      <td className="px-4 text-[#e4e5e7] font-sans">{s.name}</td>
                      <td className="px-4 text-right">{s.shares}</td>
                      <td className="px-4 text-right">{s.cost.toFixed(2)}</td>
                      <td className="px-4 text-right">{s.price.toFixed(2)}</td>
                      <td className={`px-4 text-right ${pnlColor(s.pnl)}`}>
                        <span className="flex items-center justify-end gap-0.5">
                          {s.pnl >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                          {s.pnl >= 0 ? '+' : ''}{s.pnl}
                        </span>
                      </td>
                      <td className="px-4 font-sans text-[#f59e0b] text-[11px] pl-6">{s.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ETF持仓 */}
          <div className="bg-[#1e1f22] border border-[#2c2e33] rounded overflow-hidden">
            <div className="px-4 py-3 border-b border-[#2c2e33] flex items-center justify-between">
              <h2 className="text-sm font-medium text-white">ETF持仓（长线）</h2>
              <span className="text-xs font-mono text-[#9ca3af]">
                总市值 ¥{formatMoney(etfTotal)} · 浮亏 <span className="text-[#ef4444]">¥{formatMoney(Math.abs(etfPnl))}</span>
              </span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#25262b] text-[#9ca3af] text-xs">
                  <th className="px-4 py-2 text-left font-normal">代码</th>
                  <th className="px-4 py-2 text-left font-normal">名称</th>
                  <th className="px-4 py-2 text-right font-normal">股数</th>
                  <th className="px-4 py-2 text-right font-normal">成本</th>
                  <th className="px-4 py-2 text-right font-normal">现价</th>
                  <th className="px-4 py-2 text-right font-normal">市值</th>
                  <th className="px-4 py-2 text-right font-normal">盈亏</th>
                  <th className="px-4 py-2 text-right font-normal">盈亏%</th>
                </tr>
              </thead>
              <tbody className="font-mono text-xs">
                {etfHoldings.map((e) => (
                  <tr key={e.code} className="border-b border-[#2c2e33] last:border-0 hover:bg-[#25262b]/50 h-10">
                    <td className="px-4 text-[#06b6d4]">{e.code}</td>
                    <td className="px-4 text-[#e4e5e7] font-sans">{e.name}</td>
                    <td className="px-4 text-right">{e.shares.toLocaleString()}</td>
                    <td className="px-4 text-right">{e.cost.toFixed(3)}</td>
                    <td className="px-4 text-right">{e.price.toFixed(3)}</td>
                    <td className="px-4 text-right">¥{formatMoney(e.value)}</td>
                    <td className={`px-4 text-right ${pnlColor(e.pnl)}`}>{formatMoney(e.pnl, true)}</td>
                    <td className={`px-4 text-right ${pnlColor(e.pnlPct)}`}>{formatPercent(e.pnlPct, true)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ETF加仓条件 */}
          <div className="bg-[#1e1f22] border border-[#2c2e33] rounded p-4">
            <h2 className="text-sm font-medium text-white mb-3">ETF加仓触发条件</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              {[
                { name: '半导体ETF', condition: '≤1.42 + 企稳', amount: '3,500股', status: '已挂条件单' },
                { name: '恒指科技', condition: '≤0.58 + 美股企稳 + 港股连2天红', amount: '2,000元', status: '等待' },
                { name: '医疗ETF', condition: '≤0.31 + 企稳', amount: '1,000元', status: '等待' },
              ].map((c, i) => (
                <div key={i} className="bg-[#18191c] border border-[#2c2e33] rounded p-3">
                  <div className="text-sm text-white mb-1">{c.name}</div>
                  <div className="text-xs text-[#9ca3af] mb-2">{c.condition}</div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-[#f59e0b]">{c.amount}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                      c.status === '已挂条件单' ? 'text-[#10b981] border-[#10b981]/30 bg-[#10b981]/10' : 'text-[#9ca3af] border-[#2c2e33]'
                    }`}>{c.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* 同花顺 */}
      {activeAccount === 'tonghuashun' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <FundTable funds={thFunds} total={thTotal} pnl={thPnl} />
        </motion.div>
      )}

      {/* 支付宝 */}
      {activeAccount === 'zhifubao' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <FundTable funds={zfbFunds} total={zfbTotal} pnl={zfbPnl} />
        </motion.div>
      )}
    </div>
  )
}

function FundTable({ funds, total, pnl }: {
  funds: typeof import('@/data/trading-data').fundHoldings; total: number; pnl: number
}) {
  return (
    <div className="bg-[#1e1f22] border border-[#2c2e33] rounded overflow-hidden">
      <div className="px-4 py-3 border-b border-[#2c2e33] flex items-center justify-between">
        <h2 className="text-sm font-medium text-white">基金持仓</h2>
        <span className="text-xs font-mono text-[#9ca3af]">
          总额 ¥{formatMoney(total)} · 收益{' '}
          <span className={pnlColor(pnl)}>{formatMoney(pnl, true)}</span>
        </span>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#25262b] text-[#9ca3af] text-xs">
            <th className="px-4 py-2 text-left font-normal">基金名称</th>
            <th className="px-4 py-2 text-left font-normal">代码</th>
            <th className="px-4 py-2 text-right font-normal">金额</th>
            <th className="px-4 py-2 text-right font-normal">持有收益</th>
            <th className="px-4 py-2 text-left font-normal pl-6">备注</th>
          </tr>
        </thead>
        <tbody className="font-mono text-xs">
          {funds.map((f) => (
            <tr key={f.code} className="border-b border-[#2c2e33] last:border-0 hover:bg-[#25262b]/50 h-10">
              <td className="px-4 text-[#e4e5e7] font-sans text-[13px]">{f.name}</td>
              <td className="px-4 text-[#06b6d4]">{f.code}</td>
              <td className="px-4 text-right">¥{formatMoney(f.amount)}</td>
              <td className={`px-4 text-right ${pnlColor(f.pnl)}`}>{formatMoney(f.pnl, true)}</td>
              <td className="px-4 text-[#9ca3af] font-sans pl-6">{f.plan || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

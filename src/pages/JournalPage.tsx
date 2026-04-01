import { motion } from 'motion/react'
import { BookOpen, CheckCircle2, XCircle, Clock, BarChart3 } from 'lucide-react'
import { journalEntries, accuracyStats } from '@/data/trading-data'

function ResultBadge({ result }: { result: '正确' | '错误' | '待验证' }) {
  const styles = {
    '正确': 'text-[#10b981] border-[#10b981]/30 bg-[#10b981]/10',
    '错误': 'text-[#ef4444] border-[#ef4444]/30 bg-[#ef4444]/10',
    '待验证': 'text-[#f59e0b] border-[#f59e0b]/30 bg-[#f59e0b]/10',
  }
  const icons = {
    '正确': <CheckCircle2 size={10} />,
    '错误': <XCircle size={10} />,
    '待验证': <Clock size={10} />,
  }
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded border ${styles[result]}`}>
      {icons[result]}
      {result}
    </span>
  )
}

function AccuracyBar({ rate }: { rate: number }) {
  const color = rate >= 80 ? 'bg-[#10b981]' : rate >= 50 ? 'bg-[#f59e0b]' : 'bg-[#ef4444]'
  return (
    <div className="flex items-center gap-2">
      <div className="w-24 h-1.5 bg-[#18191c] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${rate}%` }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
      <span className={`text-xs font-mono ${rate >= 80 ? 'text-[#10b981]' : rate >= 50 ? 'text-[#f59e0b]' : 'text-[#ef4444]'}`}>
        {rate}%
      </span>
    </div>
  )
}

export default function JournalPage() {
  const correct = journalEntries.filter(j => j.result === '正确').length
  const wrong = journalEntries.filter(j => j.result === '错误').length
  const pending = journalEntries.filter(j => j.result === '待验证').length
  const overallRate = correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0

  // 按日期分组
  const grouped = journalEntries.reduce((acc, entry) => {
    if (!acc[entry.date]) acc[entry.date] = []
    acc[entry.date].push(entry)
    return acc
  }, {} as Record<string, typeof journalEntries>)

  const dates = Object.keys(grouped).sort((a, b) => {
    const [am, ad] = a.split('/').map(Number)
    const [bm, bd] = b.split('/').map(Number)
    return bm * 100 + bd - (am * 100 + ad)
  })

  return (
    <div className="w-full px-5 py-5 pb-20 space-y-5">
      {/* 头部 */}
      <div>
        <h1 className="text-lg font-medium text-white flex items-center gap-2">
          <BookOpen size={18} className="text-[#f59e0b]" />
          市场判断日志
        </h1>
        <p className="text-xs text-[#9ca3af] mt-1">记录判断 · 验证对错 · 追踪准确率</p>
      </div>

      {/* 总览统计 */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {[
          { label: '总判断', value: journalEntries.length, icon: BookOpen, color: 'text-white' },
          { label: '正确', value: correct, icon: CheckCircle2, color: 'text-[#10b981]' },
          { label: '错误', value: wrong, icon: XCircle, color: 'text-[#ef4444]' },
          { label: '总胜率', value: overallRate + '%', icon: BarChart3, color: overallRate >= 50 ? 'text-[#f59e0b]' : 'text-[#ef4444]' },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-[#1e1f22] border border-[#2c2e33] rounded p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#9ca3af]">{s.label}</span>
              <s.icon size={14} className={s.color} />
            </div>
            <div className={`text-xl font-mono font-bold ${s.color}`}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 判断记录 */}
        <div className="col-span-2 space-y-4">
          {dates.map((date) => (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1e1f22] border border-[#2c2e33] rounded overflow-hidden"
            >
              <div className="px-4 py-2.5 border-b border-[#2c2e33] flex items-center justify-between">
                <span className="text-sm font-mono text-[#f59e0b]">{date}</span>
                <div className="flex gap-2">
                  <span className="text-[10px] text-[#10b981] font-mono">
                    {grouped[date].filter(j => j.result === '正确').length}对
                  </span>
                  <span className="text-[10px] text-[#ef4444] font-mono">
                    {grouped[date].filter(j => j.result === '错误').length}错
                  </span>
                  {grouped[date].filter(j => j.result === '待验证').length > 0 && (
                    <span className="text-[10px] text-[#f59e0b] font-mono">
                      {grouped[date].filter(j => j.result === '待验证').length}待
                    </span>
                  )}
                </div>
              </div>
              <div className="divide-y divide-border">
                {grouped[date].map((entry, i) => (
                  <div key={i} className="px-4 py-2.5 flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="text-[13px] text-[#e4e5e7]">{entry.content}</div>
                      {entry.note && (
                        <div className="text-[11px] text-[#9ca3af] mt-0.5">{entry.note}</div>
                      )}
                    </div>
                    <ResultBadge result={entry.result} />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* 准确率详情 */}
        <div className="space-y-4">
          <div className="bg-[#1e1f22] border border-[#2c2e33] rounded p-4">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={14} className="text-[#f59e0b]" />
              <h2 className="text-sm font-medium text-white">分类准确率</h2>
            </div>
            <div className="space-y-3">
              {accuracyStats.map((s) => (
                <div key={s.type}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[#e4e5e7]">{s.type}</span>
                    <span className="text-[10px] font-mono text-[#9ca3af]">
                      {s.win}胜{s.lose}败
                    </span>
                  </div>
                  <AccuracyBar rate={s.rate} />
                </div>
              ))}
            </div>
          </div>

          {/* 待验证清单 */}
          <div className="bg-[#1e1f22] border border-[#2c2e33] rounded p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={14} className="text-[#f59e0b]" />
              <h2 className="text-sm font-medium text-white">待验证</h2>
            </div>
            <div className="space-y-2">
              {journalEntries.filter(j => j.result === '待验证').map((j, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#f59e0b] mt-1.5 shrink-0" />
                  <div>
                    <div className="text-xs text-[#e4e5e7]">{j.content}</div>
                    <div className="text-[10px] text-[#9ca3af]">{j.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

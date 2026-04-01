import { useState, useRef, useCallback } from 'react'
import {
  Wallet, ShieldCheck, Flame,
  BookOpen, Clock, LayoutDashboard,
  GripVertical, RefreshCw,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { AppProvider } from './store/AppContext'
import TerminalPage from './pages/TerminalPage'
import DashboardPage from './pages/DashboardPage'
import PortfolioPage from './pages/PortfolioPage'
import TradingSystemPage from './pages/TradingSystemPage'
import MonsterStockPage from './pages/MonsterStockPage'
import JournalPage from './pages/JournalPage'
import TasksPage from './pages/TasksPage'

const tabs = [
  { id: 'dashboard', label: '仪表盘', icon: LayoutDashboard },
  { id: 'portfolio', label: '持仓', icon: Wallet },
  { id: 'system', label: '交易系统', icon: ShieldCheck },
  { id: 'monster', label: '妖股监控', icon: Flame },
  { id: 'journal', label: '市场日志', icon: BookOpen },
  { id: 'tasks', label: '定时任务', icon: Clock },
] as const

type TabId = (typeof tabs)[number]['id']

const pageMap: Record<TabId, React.FC> = {
  dashboard: DashboardPage,
  portfolio: PortfolioPage,
  system: TradingSystemPage,
  monster: MonsterStockPage,
  journal: JournalPage,
  tasks: TasksPage,
}

function AppInner() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')
  const [leftWidth, setLeftWidth] = useState(50) // 左侧占比%
  const [dragging, setDragging] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = () => {
    setRefreshing(true)
    setRefreshKey(k => k + 1)
    setTimeout(() => setRefreshing(false), 600)
  }
  const containerRef = useRef<HTMLDivElement>(null)

  const Page = pageMap[activeTab]
  const isElectron = !!window.electronAPI

  // 拖拽调整分栏
  const handleMouseDown = useCallback(() => {
    setDragging(true)

    const onMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const pct = ((e.clientX - rect.left) / rect.width) * 100
      setLeftWidth(Math.max(20, Math.min(80, pct)))
    }

    const onMouseUp = () => {
      setDragging(false)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }, [])

  return (
    <div className="h-screen bg-[#18191c] flex flex-col select-none overflow-hidden">
      {/* 顶栏：macOS 拖拽区 + 右侧 Tab */}
      <div className="h-10 bg-[#1e1f22] border-b border-[#2c2e33] flex items-center shrink-0"
           style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}>
        {/* 左侧留空给红绿灯 */}
        <div className="w-20 shrink-0" />
        {/* 左侧标题 */}
        <div className="flex items-center gap-2 text-xs text-[#868e96] font-mono" style={{ width: `calc(${leftWidth}% - 80px)` }}>
          <span className="text-[#10b981]">●</span>
          <span>claude盯盘</span>
        </div>
        {/* 右侧 Tab 导航 */}
        <div className="flex-1 flex items-center h-full" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 h-full flex items-center gap-1.5 transition-colors relative text-xs ${
                  isActive
                    ? 'text-[#f59e0b]'
                    : 'text-[#868e96] hover:text-[#c1c2c5] hover:bg-[#25262b]'
                }`}
              >
                <Icon size={13} />
                <span className="font-medium">{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f59e0b]"
                  />
                )}
              </button>
            )
          })}
          {/* 刷新按钮 */}
          <button
            onClick={handleRefresh}
            className="ml-2 px-2 h-full flex items-center text-[#868e96] hover:text-[#f59e0b] transition-colors"
            title="刷新数据"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* 主体：左右分栏 */}
      <div ref={containerRef} className="flex-1 flex overflow-hidden relative">
        {/* 拖拽遮罩：防止 iframe 抢走鼠标事件 */}
        {dragging && <div className="absolute inset-0 z-50 cursor-col-resize" />}

        {/* 左侧：终端 */}
        <div style={{ width: `${leftWidth}%` }} className="h-full shrink-0">
          <TerminalPage />
        </div>

        {/* 拖拽分割线 */}
        <div
          onMouseDown={handleMouseDown}
          className={`w-1.5 shrink-0 flex items-center justify-center cursor-col-resize transition-colors ${
            dragging ? 'bg-[#f59e0b]' : 'bg-[#2c2e33] hover:bg-[#f59e0b]'
          }`}
        >
          <GripVertical size={10} className={dragging ? 'text-[#f59e0b]' : 'text-[#4a4b50]'} />
        </div>

        {/* 右侧：内容 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeTab}-${refreshKey}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="h-full"
              >
                <Page />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}

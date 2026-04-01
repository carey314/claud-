import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

// ---- 消息类型 ----
export interface TerminalMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  lines: OutputLine[]
  timestamp: Date
  syncTo?: string[] // 同步到哪些 tab
}

export interface OutputLine {
  text: string
  type?: 'normal' | 'accent' | 'profit' | 'loss' | 'muted' | 'code' | 'heading' | 'success' | 'error'
  indent?: number
}

// ---- Tab 通知 ----
export interface TabSync {
  tabId: string
  time: Date
  source: string // 哪条消息触发的
}

// ---- Context ----
interface AppState {
  messages: TerminalMessage[]
  tabSyncs: Record<string, TabSync>
  addMessage: (msg: Omit<TerminalMessage, 'id' | 'timestamp'>) => void
  clearMessages: () => void
}

const AppContext = createContext<AppState | null>(null)

let msgId = 0

export function AppProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<TerminalMessage[]>([])
  const [tabSyncs, setTabSyncs] = useState<Record<string, TabSync>>({})

  const addMessage = useCallback((msg: Omit<TerminalMessage, 'id' | 'timestamp'>) => {
    const id = `msg-${++msgId}`
    const timestamp = new Date()
    const full: TerminalMessage = { ...msg, id, timestamp }

    setMessages(prev => [...prev, full])

    // 如果消息带有 syncTo，更新 tab 同步状态
    if (msg.syncTo && msg.syncTo.length > 0) {
      setTabSyncs(prev => {
        const next = { ...prev }
        for (const tabId of msg.syncTo!) {
          next[tabId] = { tabId, time: timestamp, source: id }
        }
        return next
      })
    }
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  return (
    <AppContext.Provider value={{ messages, tabSyncs, addMessage, clearMessages }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

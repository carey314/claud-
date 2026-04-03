import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { TradingData } from '@/data/trading-data-types'

// 静态数据作为 fallback
import * as staticData from '@/data/trading-data'

interface TradingDataContextValue {
  data: TradingData
  loading: boolean
  refresh: () => void
}

const TradingDataContext = createContext<TradingDataContextValue>({
  data: staticData as unknown as TradingData,
  loading: false,
  refresh: () => {},
})

// 将静态 import 转为 TradingData 格式
function staticAsFallback(): TradingData {
  return {
    lastUpdate: new Date().toISOString(),
    ...staticData,
  } as unknown as TradingData
}

export function TradingDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<TradingData>(staticAsFallback)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(() => {
    if (window.electronAPI?.getTradingData) {
      // Electron: IPC
      window.electronAPI.getTradingData()
        .then((d) => { if (d) setData(d); setLoading(false) })
        .catch(() => setLoading(false))
    } else {
      // Web: fetch JSON
      fetch('/trading-data.json')
        .then(r => r.ok ? r.json() : null)
        .then(d => { if (d) setData(d); setLoading(false) })
        .catch(() => setLoading(false))
    }
  }, [])

  useEffect(() => {
    fetchData()

    if (window.electronAPI?.onTradingDataUpdate) {
      // Electron: 实时推送
      const unsub = window.electronAPI.onTradingDataUpdate((d) => {
        console.log('[data] 收到实时更新')
        setData(d)
      })
      return unsub
    } else {
      // Web: 每 5 秒轮询
      const timer = setInterval(fetchData, 5000)
      return () => clearInterval(timer)
    }
  }, [fetchData])

  return (
    <TradingDataContext.Provider value={{ data, loading, refresh: fetchData }}>
      {children}
    </TradingDataContext.Provider>
  )
}

export function useTradingData(): TradingData {
  return useContext(TradingDataContext).data
}

export function useTradingDataContext() {
  return useContext(TradingDataContext)
}

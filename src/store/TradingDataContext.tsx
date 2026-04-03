import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { TradingData } from '@/data/trading-data-types'

interface TradingDataContextValue {
  data: TradingData | null
  loading: boolean
  error: string | null
}

const TradingDataContext = createContext<TradingDataContextValue>({
  data: null,
  loading: true,
  error: null,
})

export function TradingDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<TradingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (window.electronAPI?.getTradingData) {
      // Electron: IPC 加载 + 实时监听
      window.electronAPI.getTradingData()
        .then((d) => { setData(d); setLoading(false) })
        .catch((err) => { setError(String(err)); setLoading(false) })

      const unsub = window.electronAPI.onTradingDataUpdate((d) => {
        setData(d)
      })
      return unsub
    } else {
      // Web/Dev: fetch JSON
      fetch('/trading-data.json')
        .then(r => r.json())
        .then(d => { setData(d); setLoading(false) })
        .catch(err => { setError(String(err)); setLoading(false) })
    }
  }, [])

  return (
    <TradingDataContext.Provider value={{ data, loading, error }}>
      {children}
    </TradingDataContext.Provider>
  )
}

export function useTradingData(): TradingData {
  const { data } = useContext(TradingDataContext)
  if (!data) throw new Error('useTradingData: data not loaded yet')
  return data
}

export function useTradingDataSafe() {
  return useContext(TradingDataContext)
}

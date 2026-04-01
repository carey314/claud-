import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import zh from './zh'
import en from './en'

type Locale = 'zh' | 'en'
// 递归将所有 string literal 放宽为 string
type DeepString<T> = { [K in keyof T]: T[K] extends string ? string : DeepString<T[K]> }
type Messages = DeepString<typeof zh>

const locales: Record<Locale, Messages> = { zh, en }

interface I18nContext {
  locale: Locale
  t: Messages
  setLocale: (l: Locale) => void
}

const Ctx = createContext<I18nContext>({
  locale: 'zh',
  t: zh,
  setLocale: () => {},
})

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem('locale') as Locale
    return saved && locales[saved] ? saved : 'zh'
  })

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    localStorage.setItem('locale', l)
  }, [])

  return (
    <Ctx.Provider value={{ locale, t: locales[locale], setLocale }}>
      {children}
    </Ctx.Provider>
  )
}

export function useI18n() {
  return useContext(Ctx)
}

// 模板替换: t('约{months}个月', { months: 5 }) → '约5个月'
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? key))
}

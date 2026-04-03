// 交易数据类型定义（纯类型，无数据）

export interface ETFHolding {
  code: string; name: string; shares: number; cost: number; price: number; value: number; pnl: number; pnlPct: number
}
export interface StockHolding {
  code: string; name: string; shares: number; cost: number; price: number; pnl: number; status: string; buyDate: string; plan?: string
}
export interface FundHolding {
  name: string; code: string; amount: number; pnl: number; platform: '同花顺' | '支付宝'; plan?: string
}
export interface TradeRecord {
  date: string; code: string; name: string; direction: '买入' | '卖出' | '止损'; shares: number; price: number; pnl: number; reason: string
}
export interface MonsterCandidate {
  code: string; name: string; price: number; sector: string; grade: 'A' | 'B' | 'C'; probability: number; logic: string; status?: string
}
export interface SectorStrength {
  rank: number; name: string; change: number; limitUpCount: number; catalyst: string; trend: '启动' | '持续' | '退潮' | '新方向'
}
export interface JudgmentEntry {
  date: string; content: string; result: '正确' | '错误' | '待验证'; note?: string
}
export interface TaskStep { text: string }
export interface CronJob {
  title: string; time: string; active: boolean; cmd: string; lastRun: string; nextRun: string; success: boolean; steps: TaskStep[]
}

export interface TradingData {
  lastUpdate: string
  etfHoldings: ETFHolding[]
  stockHoldings: StockHolding[]
  fundHoldings: FundHolding[]
  tradeHistory: TradeRecord[]
  entryConditions: { id: number; name: string; desc: string; threshold: string; active: boolean }[]
  trendRules: { id: number; name: string; desc: string; threshold: string }[]
  stopRules: { name: string; value: string; desc: string }[]
  monsterCandidates: MonsterCandidate[]
  sectorStrength: SectorStrength[]
  journalEntries: JudgmentEntry[]
  accuracyStats: { type: string; win: number; lose: number; rate: number }[]
  cronJobs: CronJob[]
  summary: {
    totalAssets: number; etfTotal: number; etfPnl: number; stockTotal: number
    cash: number; tonghuashun: number; zhifubao: number; realizedPnl: number
    monthTarget: number; totalLoss: number; recoveryMonths: number
    backtestWinRate: number; backtestTrades: number; systemVersion: string
    pendingAlerts: string[]
  }
  lessons: { id: number; title: string; detail: string }[]
  redLines: string[]
  tradingRules: { general: string[]; shortTerm: string[]; monsterStock: string[]; etf: string[] }
  recoveryPlan: {
    totalLoss: { etf: number; fund: number; realized: number; total: number }
    phases: { name: string; target: number; method: string; timeline: string; status: string }[]
    principles: string[]
  }
}

// ============================================================
// 真实交易数据 — 来自盯盘系统文件
// 最后更新：2026-04-01 盘前
// ============================================================

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

// ---- ETF 持仓 (国信证券, 3/31收盘) ----
export const etfHoldings: ETFHolding[] = [
  { code: '515230', name: '软件ETF', shares: 3900, cost: 1.127, price: 0.787, value: 3069.3, pnl: -1326, pnlPct: -30.17 },
  { code: '512170', name: '医疗ETF', shares: 10600, cost: 0.368, price: 0.330, value: 3498, pnl: -403, pnlPct: -10.33 },
  { code: '512480', name: '半导体ETF', shares: 4100, cost: 1.695, price: 1.415, value: 5801.5, pnl: -1148, pnlPct: -16.52 },
  { code: '513180', name: '恒指科技ETF', shares: 9800, cost: 0.754, price: 0.602, value: 5899.6, pnl: -1489, pnlPct: -20.16 },
  { code: '515250', name: '智能汽车ETF', shares: 2200, cost: 1.252, price: 1.033, value: 2272.6, pnl: -482, pnlPct: -17.49 },
]

// ---- 个股持仓 (4/1盘前状态) ----
export const stockHoldings: StockHolding[] = [
  {
    code: '600488', name: '津药药业', shares: 600, cost: 4.76, price: 5.24, pnl: 288,
    status: '四连板·今天必出(最长持2天)', buyDate: '3/30',
    plan: '高开>5.5→卖400股锁利，竞价封板5.76→不卖等开板，平开≤5.24→看量能，条件单≤4.97卖600股',
  },
  {
    code: '600595', name: '中孚实业', shares: 300, cost: 7.55, price: 7.21, pnl: -102,
    status: '已破止损线7.32·开盘止损', buyDate: '3/30',
    plan: '开盘果断止损，低开则集合竞价挂7.15卖',
  },
]

// ---- 基金持仓 ----
export const fundHoldings: FundHolding[] = [
  { name: '银华5G通信C', code: '010524', amount: 11604, pnl: 519, platform: '同花顺' },
  { name: '德邦鑫星价值C', code: '002112', amount: 3850, pnl: 350, platform: '同花顺' },
  { name: '平安卫星产业C', code: '025491', amount: 2163, pnl: -37, platform: '同花顺' },
  { name: '华夏恒生生物科技C', code: '014789', amount: 5337, pnl: -663, platform: '支付宝' },
  { name: '华宝纳斯达克C', code: '015055', amount: 2358, pnl: -142, platform: '支付宝', plan: '每日定投50元' },
  { name: '广发碳中和C', code: '012550', amount: 1057, pnl: 57, platform: '支付宝' },
]

// ---- 交易记录 ----
export const tradeHistory: TradeRecord[] = [
  { date: '3/31', code: '600488', name: '津药药业', direction: '卖出', shares: 200, price: 5.24, pnl: 96, reason: '涨停价减仓锁利润' },
  { date: '3/31', code: '600595', name: '中孚实业', direction: '止损', shares: 300, price: 7.35, pnl: -71, reason: '仓位<5000违规+二梯队' },
  { date: '3/30', code: '600310', name: '广西能源', direction: '卖出', shares: 400, price: 6.63, pnl: 325, reason: 'Day3开板+13.5%清仓' },
  { date: '3/30', code: '600488', name: '津药药业', direction: '买入', shares: 800, price: 4.76, pnl: 0, reason: '医药板块共振+超低价首板' },
  { date: '3/30', code: '600595', name: '中孚实业', direction: '买入', shares: 300, price: 7.55, pnl: 0, reason: '铝板块二梯队尾盘买入' },
  { date: '3/26', code: '600310', name: '广西能源', direction: '买入', shares: 400, price: 6.00, pnl: 0, reason: '电力板块共振Day1' },
  { date: '3/24', code: '002460', name: '晶澳科技', direction: '止损', shares: 300, price: 12.21, pnl: -167, reason: '逆势+无共振' },
  { date: '3/23', code: '000831', name: '紫光股份', direction: '止损', shares: 100, price: 25.96, pnl: -59, reason: '逆势+无共振' },
  { date: '3/23', code: '002747', name: '埃斯顿', direction: '止损', shares: 100, price: 20.00, pnl: -75, reason: '逆势+无共振' },
  { date: '3/23', code: '601012', name: '隆基绿能', direction: '止损', shares: 100, price: 18.50, pnl: -55, reason: '逆势+无共振' },
]

// ---- 入场条件 V3 ----
export const entryConditions = [
  { id: 1, name: '板块共振', desc: '同板块≥5只涨停', threshold: '5只', active: true },
  { id: 2, name: '龙头确认', desc: '板块内百亿以上大票涨停', threshold: '100亿', active: true },
  { id: 3, name: '超跌', desc: '标的当月涨幅≤0%', threshold: '0%', active: true },
  { id: 4, name: '大盘安全', desc: '当日跌幅<2%', threshold: '-2%', active: true },
  { id: 5, name: '胜率≥70%', desc: '综合评估', threshold: '70%', active: true },
]

// ---- 趋势追踪规则 (4/1新增) ----
export const trendRules = [
  { id: 1, name: '板块持续', desc: '板块连续3天涨幅>1%', threshold: '3天' },
  { id: 2, name: '龙头确认', desc: '标的是板块内市值最大龙头', threshold: '最大' },
  { id: 3, name: '趋势中途', desc: '标的当日涨幅2-5%（不追涨停）', threshold: '2-5%' },
]

// ---- 止损止盈规则 ----
export const stopRules = [
  { name: '止损', value: '-3%', desc: '买入后立刻挂条件单' },
  { name: '止盈一档', value: '+5%', desc: '卖一半' },
  { name: '止盈二档', value: '+8%', desc: '再卖一半' },
  { name: '涨停处理', value: '封住不卖', desc: '次日高开卖' },
  { name: '次日高开≥3%', value: '卖一半', desc: '开盘直接卖，回测0亏损' },
  { name: '最长持有', value: '2天', desc: '第3天不管赚亏都走' },
]

// ---- 妖股候选 (3/30更新) ----
export const monsterCandidates: MonsterCandidate[] = [
  { code: '600488', name: '津药药业', price: 5.24, sector: '医药', grade: 'A', probability: 55, logic: '超低价+3月仅涨3%+四连板', status: '持仓中·600股·今天必出' },
  { code: '000822', name: '山东海化', price: 6.45, sector: '化工', grade: 'A', probability: 55, logic: '3月-2%超跌首板+化工涨价催化', status: '3/30未连板-0.78%' },
  { code: '002755', name: '奥赛康', price: 15.39, sector: '医药CXO', grade: 'A', probability: 50, logic: '3月-0.2%+从13.86拉到涨停封死' },
  { code: '603387', name: '基蛋生物', price: 9.90, sector: '医药检测', grade: 'B', probability: 45, logic: '首板+医药普涨+<10元' },
  { code: '600727', name: '鲁北化工', price: 7.80, sector: '化工', grade: 'B', probability: 40, logic: '超跌首板+化工涨价' },
  { code: '002437', name: '誉衡药业', price: 3.36, sector: '医药', grade: 'B', probability: 40, logic: '全场最低价3.36+医药方向' },
]

// ---- 板块强度 (3/30收盘) ----
export const sectorStrength: SectorStrength[] = [
  { rank: 1, name: '铝/有色金属', change: 6.9, limitUpCount: 6, catalyst: '天山铝业728亿一字板', trend: '新方向' },
  { rank: 2, name: '医药', change: 3.9, limitUpCount: 5, catalyst: 'CXO+创新药·双鹭3连板', trend: '持续' },
  { rank: 3, name: '农业', change: 9.0, limitUpCount: 2, catalyst: '北大荒+8%/金健米业涨停', trend: '启动' },
  { rank: 4, name: '化工', change: 4.2, limitUpCount: 3, catalyst: '巴斯夫涨价30%+油价', trend: '持续' },
  { rank: 5, name: '黄金/避险', change: 2.3, limitUpCount: 0, catalyst: '中东避险', trend: '持续' },
  { rank: 6, name: '电力', change: -6.3, limitUpCount: 0, catalyst: '晋控-6.3%·新能泰山-8.9%', trend: '退潮' },
]

// ---- 市场日志 (含3/31待验证) ----
export const journalEntries: JudgmentEntry[] = [
  // 3/31 待验证
  { date: '3/31', content: '铝板块4/1延续但分化', result: '待验证', note: '一字板开板，盘中板冲高回落' },
  { date: '3/31', content: '津药药业4/1高开+3%以上', result: '待验证', note: '3/31封涨停5.24' },
  { date: '3/31', content: '中孚实业4/1涨1-3%', result: '待验证', note: '实际3/31跌-4.5%破止损线' },
  { date: '3/31', content: '半导体ETF触达1.42', result: '待验证', note: '3/31收1.415，条件单可能已成交' },
  // 3/30 验证结果
  { date: '3/30', content: '医药是本周新主线', result: '正确', note: '5只涨停延续' },
  { date: '3/30', content: '津药/山东海化至少1只连板', result: '正确', note: '津药封涨停' },
  { date: '3/30', content: '电力妖股继续走弱', result: '正确', note: '晋控-6.3%、新能泰山-8.9%' },
  { date: '3/30', content: '半导体ETF跌到1.42', result: '错误', note: '日低1.433差0.013' },
  // 3/27
  { date: '3/27', content: '明天小幅震荡', result: '错误', note: '日内振幅72点V型反转' },
  { date: '3/27', content: '4只妖股至少2只连板', result: '错误', note: '只有广西能源1只' },
  { date: '3/27', content: '6只医药/化工候选全涨停', result: '正确' },
  // 3/26
  { date: '3/26', content: '电力板块是当前最强主线', result: '正确', note: '大盘跌-1.2%仍4只涨停' },
  { date: '3/26', content: '今天的下跌是正常技术回调', result: '错误', note: '收盘-1.20%加速杀跌' },
  // 3/24
  { date: '3/24', content: 'V型反弹是底部信号', result: '正确', note: '连续4天未破低点' },
  { date: '3/24', content: '光伏板块是资金首选', result: '错误', note: '实际是电力和油气' },
]

// ---- 判断准确率 (3/31更新) ----
export const accuracyStats = [
  { type: '短线买入推荐', win: 2, lose: 4, rate: 33 },
  { type: '止损决策', win: 5, lose: 0, rate: 100 },
  { type: '卖出时机', win: 2, lose: 2, rate: 50 },
  { type: '大盘方向', win: 1, lose: 2, rate: 33 },
  { type: '板块判断', win: 4, lose: 2, rate: 67 },
  { type: '个股筛选', win: 2, lose: 0, rate: 100 },
]

// ---- 定时任务 ----
export const cronJobs: CronJob[] = [
  {
    title: '盘前扫描', time: '每天 08:57', active: true,
    cmd: '开启盯盘，执行盘前扫描，覆盖18板块76只龙头',
    lastRun: '2026-04-01 08:57', nextRun: '2026-04-02 08:57', success: true,
    steps: [
      { text: '读取所有md文件恢复上下文' },
      { text: '拉取5只ETF实时行情(515230/512170/512480/513180/515250)' },
      { text: '获取财经新闻和市场资讯' },
      { text: '扫描昨日涨停股，筛选妖股Day2/Day3候选' },
      { text: '覆盖18板块76只龙头股行情' },
      { text: '生成当日操作建议(标注置信度)' },
    ],
  },
  {
    title: '妖股扫描', time: '每天 09:45', active: true,
    cmd: '扫描涨停股，筛选连板候选，更新妖股监控.md',
    lastRun: '2026-03-31 09:45', nextRun: '2026-04-01 09:45', success: true,
    steps: [
      { text: '扫描全市场涨停股(AKShare实时数据)' },
      { text: '筛选连板≥2天的个股' },
      { text: '检查板块共振(同板块≥5只涨停)' },
      { text: '过滤红线：排除创业板/科创板/股价>150元' },
      { text: '评估超跌条件(当月涨幅≤0%)' },
      { text: '按A/B/C级标注可入概率' },
      { text: '更新妖股监控.md + 同步妖股Tab' },
    ],
  },
  {
    title: '尾盘机会扫描', time: '每天 14:03', active: true,
    cmd: '尾盘扫描，妖股确认+板块趋势入场判断',
    lastRun: '2026-03-31 14:03', nextRun: '2026-04-01 14:03', success: true,
    steps: [
      { text: '拉取妖股监控名单最新行情' },
      { text: '检查所有追踪个股和ETF' },
      { text: '评估5条入场条件是否满足' },
      { text: '判断胜率是否≥70%' },
      { text: '给出具体建议：买什么/多少钱/止损点/目标价' },
      { text: '置信度≥80%才建议入场' },
    ],
  },
  {
    title: '收盘总结', time: '每天 15:03', active: true,
    cmd: '盘后总结，更新文件，生成明日策略',
    lastRun: '2026-03-31 15:03', nextRun: '2026-04-01 15:03', success: true,
    steps: [
      { text: '拉取ETF收盘数据计算当日盈亏' },
      { text: '更新市场日志(事实+判断验证)' },
      { text: '更新妖股监控(连板追踪+新候选)' },
      { text: '更新持仓总览(如有变动)' },
      { text: '同步memory目录对应文件' },
      { text: '制定明日策略和条件单计划' },
    ],
  },
]

// ---- 汇总数据 (3/31收盘) ----
export const summary = {
  totalAssets: 79500,
  etfTotal: 20541,  // 3/31: 3069+3498+5802+5900+2273
  etfPnl: -4848,    // 3/31: -1326-403-1148-1489-482
  stockTotal: 6355,  // 津药600×5.24+中孚300×7.21
  cash: 17000,
  tonghuashun: 18144,
  zhifubao: 8752,    // 赎回3只后：5337+2358+1057
  realizedPnl: -3220,
  monthTarget: 1576,
  totalLoss: -8170,
  recoveryMonths: 5,
  backtestWinRate: 83,
  backtestTrades: 12,
  systemVersion: 'V3',
  pendingAlerts: [
    '津药药业600股今天必出（最长持2天规则）',
    '中孚实业300股已破止损线，开盘止损',
    '半导体ETF条件单1800股@1.42可能已成交，请确认',
  ],
}

// ---- 血泪教训 ----
export const lessons = [
  { id: 1, title: '不在大盘下跌趋势中做个股短线', detail: '逆势做多就是逆水行舟，4战4败已验证' },
  { id: 2, title: '尾盘买入，不追早盘', detail: '每次上午买下午都被杀，等14:00-14:30确认' },
  { id: 3, title: '连续暴跌3天以上不恐慌卖出', detail: '山东黄金/华安黄金卖出次日就反弹' },
  { id: 4, title: 'A股最低100股', detail: '小资金做个股灵活性差' },
  { id: 5, title: '条件单是保命工具', detail: '买入后立刻挂止损' },
  { id: 6, title: '利好消息出来可能要跌', detail: '有人在利好时结利出货' },
  { id: 7, title: '妖股Day3开板放量=卖出信号', detail: '市价出不犹豫' },
  { id: 8, title: '次日高开≥3%开盘卖一半', detail: '回测0亏损' },
  { id: 9, title: 'ETF下跌趋势先卖一半', detail: '等低价接回来' },
  { id: 10, title: 'ETF条件单加0.5-1%容差', detail: '1.42→挂1.43，省1分钱可能丢100元' },
]

// ---- 红线规则 ----
export const redLines = [
  '不买创业板(300)/科创板(688)',
  '股价超过150元不买',
  '单笔5,000-8,000元',
  '同时持有最多2只',
  '现金底线15,000元绝不动',
  '每天最多买1只新票',
  '周五不开新仓',
]

// ---- 交易纪律分类 ----
export const tradingRules = {
  general: [
    '大盘暴跌日绝不新开仓',
    '尾盘买入(14:00-14:30)，不追早盘',
    '条件单保护每一笔持仓(买入后立刻挂止损)',
    '不追涨、不满仓、周五不开新仓',
    '保留至少15,000元现金不动用',
    '不买创业板(300)/科创板(688)/股价>150元',
    '连续暴跌3天以上不恐慌卖出，等反弹再走',
  ],
  shortTerm: [
    '单笔5,000-8,000元，最低5,000元',
    '同时持有最多2只，每天最多买1只',
    '止损-3%（买入后立刻挂条件单）',
    '止盈+5%卖一半，+8%再卖一半',
    '最长持有2天，第3天不管赚亏都走',
    '涨停封住不卖，次日高开≥3%开盘卖一半',
  ],
  monsterStock: [
    'Day1首板只观察不买',
    'Day2尾盘高开+封板/强势→入场5,000元',
    'Day3-4持有看是否继续',
    '开板≥3次立刻出，-5%止损',
    '同时最多持有1只妖股',
  ],
  etf: [
    '不频繁交易，只在触发加仓线时买',
    '半导体≤1.42加仓(已挂条件单)',
    '恒指科技≤0.58+美股企稳+港股连2天红',
    '医疗ETF≤0.31加仓',
    'ETF下跌趋势先卖一半等低价接回(教训9)',
    '条件单加0.5-1%容差(教训10)',
  ],
}

// ---- 回本计划 ----
export const recoveryPlan = {
  totalLoss: { etf: -4848, fund: -1000, realized: -3220, total: -9068 },
  phases: [
    { name: '第一阶段', target: 2000, method: '短线交易(妖股+趋势)', timeline: '2-3周', status: '进行中' },
    { name: '第二阶段', target: 2500, method: 'ETF自然修复(大盘反弹10%)', timeline: '1-2个月', status: '等待' },
    { name: '第三阶段', target: 1000, method: '继续短线', timeline: '持续', status: '等待' },
  ],
  principles: [
    '准确率优先，不追求频率',
    '现金底线15,000绝不动',
    '每笔必须挂止损',
    '周五不开新仓',
    '保住利润，止盈不手软',
  ],
}

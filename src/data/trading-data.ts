// ============================================================
// 真实交易数据 — 来自盯盘系统记忆文件
// 最后同步：2026-04-03 (清明假期前，个股全部清仓)
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

// ---- ETF 持仓 (国信证券, 4/2截图精确数据) ----
export const etfHoldings: ETFHolding[] = [
  { code: '512480', name: '半导体ETF', shares: 7600, cost: 1.569, price: 1.430, value: 10868, pnl: -1057, pnlPct: -8.86 },
  { code: '513180', name: '恒指科技ETF', shares: 9800, cost: 0.754, price: 0.605, value: 5929, pnl: -1464, pnlPct: -19.80 },
  { code: '512170', name: '医疗ETF', shares: 10600, cost: 0.368, price: 0.340, value: 3604, pnl: -291, pnlPct: -7.48 },
  { code: '515230', name: '软件ETF', shares: 3900, cost: 1.127, price: 0.766, value: 2987, pnl: -1409, pnlPct: -32.04 },
  { code: '515250', name: '智能汽车ETF', shares: 2200, cost: 1.252, price: 1.042, value: 2292, pnl: -462, pnlPct: -16.78 },
]

// ---- 个股持仓 (4/3 全部清仓！清明空仓) ----
export const stockHoldings: StockHolding[] = []

// ---- 基金持仓 ----
export const fundHoldings: FundHolding[] = [
  { name: '银华5G通信C', code: '010524', amount: 11604, pnl: 519, platform: '同花顺' },
  { name: '德邦鑫星价值C', code: '002112', amount: 3850, pnl: 350, platform: '同花顺' },
  { name: '平安卫星产业C', code: '025491', amount: 2163, pnl: -37, platform: '同花顺' },
  { name: '华夏恒生生物科技C', code: '014789', amount: 5337, pnl: -663, platform: '支付宝' },
  { name: '华宝纳斯达克C', code: '015055', amount: 2358, pnl: -142, platform: '支付宝', plan: '每日定投50元' },
  { name: '广发碳中和C', code: '012550', amount: 1057, pnl: 57, platform: '支付宝' },
]

// ---- 交易记录 (完整历史) ----
export const tradeHistory: TradeRecord[] = [
  // 4月
  { date: '4/3', code: '600488', name: '津药药业', direction: '卖出', shares: 600, price: 6.955, pnl: 1317, reason: '清明前清仓，5连板→7连板大肉' },
  { date: '4/3', code: '600583', name: '海油工程', direction: '卖出', shares: 800, price: 6.76, pnl: 2, reason: '清明前清仓，基本打平' },
  { date: '4/2', code: '600583', name: '海油工程', direction: '买入', shares: 800, price: 6.737, pnl: 0, reason: '油气板块共振+低价' },
  { date: '4/1', code: '002513', name: '依顿电子', direction: '止损', shares: 400, price: 11.47, pnl: -283, reason: '追涨停价买入→开板亏损（教训）' },
  { date: '4/1', code: '002513', name: '依顿电子', direction: '买入', shares: 400, price: 12.17, pnl: 0, reason: 'PCB板块共振，追涨停价（违规）' },
  // 3月
  { date: '3/31', code: '600488', name: '津药药业', direction: '卖出', shares: 200, price: 5.24, pnl: 96, reason: '涨停价减仓锁利润' },
  { date: '3/31', code: '600595', name: '中孚实业', direction: '止损', shares: 300, price: 7.35, pnl: -71, reason: '仓位<5000违规+二梯队' },
  { date: '3/30', code: '600488', name: '津药药业', direction: '买入', shares: 800, price: 4.76, pnl: 0, reason: '医药板块共振+超低价首板' },
  { date: '3/30', code: '600310', name: '广西能源', direction: '卖出', shares: 400, price: 6.63, pnl: 325, reason: 'Day3开板+13.5%清仓' },
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

// ---- 板块强度 (4/2收盘) ----
export const sectorStrength: SectorStrength[] = [
  { rank: 1, name: '油气', change: 5.2, limitUpCount: 5, catalyst: '美伊冲突·蓝焰/和顺/贝肯/川能/康普顿', trend: '新方向' },
  { rank: 2, name: '医药', change: 2.1, limitUpCount: 3, catalyst: '津药5连板妖王·板块开始分化', trend: '退潮' },
  { rank: 3, name: '电子/PCB', change: 4.2, limitUpCount: 4, catalyst: '半导体173涨/0跌·电子483涨/15跌', trend: '持续' },
  { rank: 4, name: '光伏', change: 4.16, limitUpCount: 1, catalyst: '超跌反弹Day1·8只核心股3月-0.2~-17%', trend: '启动' },
  { rank: 5, name: '黄金/避险', change: 2.3, limitUpCount: 0, catalyst: '中东局势+金价高位', trend: '持续' },
  { rank: 6, name: '铝/电力', change: -3.2, limitUpCount: 0, catalyst: '前期龙头全面退潮', trend: '退潮' },
]

// ---- 妖股候选 (4/2更新) ----
export const monsterCandidates: MonsterCandidate[] = [
  { code: '600488', name: '津药药业', price: 6.955, sector: '医药', grade: 'A', probability: 0, logic: '7连板妖王·已清仓+1413', status: '已清仓·盈利+1,413元' },
  { code: '000155', name: '川能动力', price: 8.50, sector: '油气', grade: 'A', probability: 55, logic: '313亿油气龙头·4/2涨停·新增监控', status: '新发现' },
  { code: '000822', name: '山东海化', price: 6.45, sector: '化工', grade: 'B', probability: 35, logic: '3月超跌首板·未连板', status: '3/30未连板-0.78%' },
  { code: '600583', name: '海油工程', price: 6.76, sector: '油气', grade: 'B', probability: 40, logic: '油气方向+低价·已交易打平', status: '已清仓·+2元' },
]

// ---- 市场日志 ----
export const journalEntries: JudgmentEntry[] = [
  { date: '4/2', content: '油气是本周新主线', result: '待验证', note: '5只涨停爆发' },
  { date: '4/2', content: '医药板块开始分化', result: '正确', note: '联环-2.7%、万邦德-1.2%' },
  { date: '4/1', content: '电子/PCB板块爆发', result: '正确', note: '半导体173涨/0跌' },
  { date: '4/1', content: '紫金矿业类趋势龙头系统盲区', result: '正确', note: '已添加趋势追踪规则' },
  { date: '3/31', content: '铝板块分化', result: '正确', note: '一字板开板' },
  { date: '3/31', content: '津药药业高开+3%以上', result: '正确', note: '封涨停5.24→后续7连板' },
  { date: '3/30', content: '医药是本周新主线', result: '正确', note: '5只涨停延续' },
  { date: '3/30', content: '津药/山东海化至少1只连板', result: '正确', note: '津药封涨停' },
  { date: '3/30', content: '电力妖股继续走弱', result: '正确', note: '晋控-6.3%、新能泰山-8.9%' },
  { date: '3/27', content: '6只医药/化工候选全涨停', result: '正确' },
  { date: '3/27', content: '明天小幅震荡', result: '错误', note: '日内振幅72点V型反转' },
  { date: '3/26', content: '电力板块是当前最强主线', result: '正确', note: '大盘跌-1.2%仍4只涨停' },
  { date: '3/26', content: '今天的下跌是正常技术回调', result: '错误', note: '收盘-1.20%加速杀跌' },
  { date: '3/24', content: 'V型反弹是底部信号', result: '正确', note: '连续4天未破低点' },
]

// ---- 判断准确率 (4/3更新) ----
export const accuracyStats = [
  { type: '短线买入推荐', win: 3, lose: 5, rate: 38 },
  { type: '止损决策', win: 6, lose: 0, rate: 100 },
  { type: '卖出时机', win: 3, lose: 2, rate: 60 },
  { type: '大盘方向', win: 2, lose: 2, rate: 50 },
  { type: '板块判断', win: 6, lose: 2, rate: 75 },
  { type: '个股筛选', win: 3, lose: 1, rate: 75 },
]

// ---- 定时任务 ----
export const cronJobs: CronJob[] = [
  {
    title: '盘前扫描', time: '每天 08:57', active: true,
    cmd: '开启盯盘，执行盘前扫描，覆盖18板块76只龙头',
    lastRun: '2026-04-03 08:57', nextRun: '2026-04-07 08:57', success: true,
    steps: [
      { text: '读取所有md文件恢复上下文' },
      { text: '拉取5只ETF实时行情(512480/513180/512170/515230/515250)' },
      { text: '获取财经新闻和市场资讯' },
      { text: '扫描昨日涨停股，筛选妖股Day2/Day3候选' },
      { text: '覆盖18板块76只龙头股行情' },
      { text: '生成当日操作建议(标注置信度)' },
    ],
  },
  {
    title: '妖股扫描', time: '每天 09:45', active: true,
    cmd: '扫描涨停股，筛选连板候选，更新妖股监控.md',
    lastRun: '2026-04-03 09:45', nextRun: '2026-04-07 09:45', success: true,
    steps: [
      { text: '扫描全市场涨停股(AKShare实时数据)' },
      { text: '筛选连板≥2天的个股' },
      { text: '检查板块共振(同板块≥5只涨停)' },
      { text: '过滤红线：排除创业板/科创板/股价>150元' },
      { text: '按A/B/C级标注可入概率' },
      { text: '更新妖股监控.md' },
    ],
  },
  {
    title: '尾盘机会扫描', time: '每天 14:03', active: true,
    cmd: '尾盘扫描，妖股确认+板块趋势入场判断',
    lastRun: '2026-04-03 14:03', nextRun: '2026-04-07 14:03', success: true,
    steps: [
      { text: '拉取妖股监控名单最新行情' },
      { text: '评估5条入场条件+趋势追踪3条件' },
      { text: '给出具体建议：买什么/多少钱/止损点/目标价' },
      { text: '置信度≥80%才建议入场' },
    ],
  },
  {
    title: '收盘总结', time: '每天 15:03', active: true,
    cmd: '盘后总结，更新文件，生成明日策略',
    lastRun: '2026-04-03 15:03', nextRun: '2026-04-07 15:03', success: true,
    steps: [
      { text: '拉取ETF收盘数据计算当日盈亏' },
      { text: '更新市场日志(事实+判断验证)' },
      { text: '更新妖股监控+持仓总览' },
      { text: '同步memory目录文件' },
      { text: '制定节后策略和条件单计划' },
    ],
  },
]

// ---- 汇总数据 (4/3清仓后) ----
export const summary = {
  totalAssets: 79500,
  etfTotal: 25680,  // 10868+5929+3604+2987+2292
  etfPnl: -4683,   // -1057-1464-291-1409-462
  stockTotal: 0,    // 个股全部清仓
  cash: 11217,      // 清仓后可用
  tonghuashun: 17617,
  zhifubao: 8752,
  realizedPnl: 1030, // 个股净盈利！翻正了！
  monthTarget: 1576,
  totalLoss: -8170,
  recoveryMonths: 5,
  backtestWinRate: 83,
  backtestTrades: 12,
  systemVersion: 'V3',
  pendingAlerts: [
    '清明假期(4/4-4/6)空仓中，节后4/7开盘',
    '软件ETF挂卖0.759待成交(回收~2,960)',
    '半导体ETF已加仓成功：3,500股@1.43',
    '个股累计+1,030元，首次翻正！',
    '关注节后油气板块延续性',
  ],
}

// ---- 血泪教训 (含4月新增) ----
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
  { id: 10, title: 'ETF条件单加0.5%容差', detail: '1.42→挂1.43，差0.001没成交丢100元' },
  { id: 11, title: '不追涨停价买入', detail: '依顿电子12.17追涨停→开板亏-283元' },
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
  '不追涨停价买入',
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
    '不追涨停价买入（依顿电子教训）',
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
    '半导体已加仓成功(7,600股)',
    '恒指科技≤0.58+美股企稳+港股连2天红',
    '医疗ETF≤0.31加仓',
    'ETF条件单加0.5%容差(教训10)',
  ],
  trendTracking: [
    '板块连续3天涨幅>1%（持续性确认）',
    '标的是板块内市值最大龙头',
    '标的当日涨幅2-5%（不追涨停）',
    '仓位5,000元，止损-3%，止盈+5%/+8%',
    '最长持有3天（比妖股多1天）',
  ],
}

// ---- 回本计划 (4/3更新) ----
export const recoveryPlan = {
  totalLoss: { etf: -4683, fund: -1000, realized: 1030, total: -4653 },
  phases: [
    { name: '第一阶段', target: 2000, method: '短线交易', timeline: '已完成50%', status: '进行中·已赚+1,030' },
    { name: '第二阶段', target: 2500, method: 'ETF自然修复(大盘反弹10%)', timeline: '1-2个月', status: '等待' },
    { name: '第三阶段', target: 1000, method: '继续短线', timeline: '持续', status: '等待' },
  ],
  principles: [
    '准确率优先，不追求频率',
    '现金底线15,000绝不动',
    '每笔必须挂止损',
    '周五不开新仓',
    '不追涨停价',
  ],
}

// ---- 累计战绩 ----
export const battleRecord = [
  { name: '紫光股份', pnl: -59 },
  { name: '埃斯顿', pnl: -75 },
  { name: '隆基绿能', pnl: -55 },
  { name: '晶澳科技', pnl: -167 },
  { name: '广西能源', pnl: 325 },
  { name: '津药药业', pnl: 1413 },
  { name: '海油工程', pnl: 2 },
  { name: '依顿电子', pnl: -283 },
  { name: '中孚实业', pnl: -71 },
]

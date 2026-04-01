# 盯盘终端

A股短线交易盯盘系统的桌面客户端，左侧真实终端 + 右侧数据面板。

配合 [Claude Code](https://claude.ai/claude-code) 使用，在终端中运行 `claude` 进入交互模式，输入"开启盯盘"即可自动加载监控系统。

## 截图

```
┌─ ● ● ● ── claude盯盘 ──┬── 仪表盘  持仓  交易系统  妖股  日志  任务 ─┐
│                          │                                            │
│   终端 (真实 PTY)         │         当前 Tab 内容                      │
│   可运行 claude/zsh      │         (自适应布局)                        │
│                          │                                            │
│                         ←→ 可拖拽                                     │
│                          │                                            │
└──────────────────────────┴────────────────────────────────────────────┘
```

## 功能

### 左侧：真实终端
- macOS 原生 PTY，和系统 Terminal.app 完全一致
- 可直接运行 `claude --dangerously-skip-permissions` 进入盯盘模式
- 切换 Tab 不丢失终端状态
- 关闭窗口缩到托盘，终端会话不断

### 右侧：6个数据面板

| Tab | 内容 |
|-----|------|
| **仪表盘** | 总资产/回本进度/板块热度/最近交易/红线提醒 |
| **持仓** | 三账户(国信/同花顺/支付宝)切换，ETF/个股/基金明细 |
| **交易系统** | V3系统5条入场条件/止损止盈铁律/红线规则/血泪教训 |
| **妖股监控** | A/B级候选/板块强度/入场逻辑/排除名单 |
| **市场日志** | 判断记录/验证对错/分类准确率追踪 |
| **定时任务** | 4个定时扫描任务/执行步骤/日志/快捷指令 |

### 交易系统 V3 核心

5条入场条件（缺一不可）：
1. 板块共振（同板块≥5只涨停）
2. 龙头确认（百亿以上大票涨停）
3. 超跌（当月涨幅≤0%）
4. 大盘安全（当日跌幅<2%）
5. 胜率≥70%

止损止盈：-3%止损 / +5%卖一半 / +8%再卖一半 / 最长持2天

### 定时任务

| 时间 | 任务 |
|------|------|
| 08:57 | 盘前扫描：18板块76只龙头 + 操作建议 |
| 09:45 | 妖股扫描：涨停股筛选 + A/B/C级标注 |
| 14:03 | 尾盘机会：入场条件评估 + 置信度≥80%才建议 |
| 15:03 | 收盘总结：更新所有文件 + 明日策略 |

## 技术栈

- **前端**: React 19 + Tailwind CSS + Motion (Framer) + Lucide React
- **桌面**: Electron 41 + ttyd (真实终端)
- **构建**: Vite 6 + TypeScript + electron-builder
- **数据**: 静态数据文件，配合 Claude Code 实时更新

## 前置依赖

```bash
# ttyd (真实终端服务)
brew install ttyd
```

## 开发

```bash
# 安装依赖
npm install

# 重建 node-pty (Electron 原生模块)
npx electron-rebuild -f -w node-pty

# 启动开发模式 (Electron + Vite HMR)
npm run dev
```

## 打包

```bash
# 打包为 macOS .app (输出到 release/)
CSC_IDENTITY_AUTO_DISCOVERY=false npm run build

# 复制到应用程序
cp -R release/mac-arm64/盯盘终端.app /Applications/
```

首次打开需右键 → 打开，或在系统设置 → 隐私与安全性中允许。

## 项目结构

```
├── electron/
│   ├── main.ts          # 主进程：窗口/托盘/ttyd管理
│   └── preload.ts       # IPC 桥接
├── src/
│   ├── App.tsx          # 左右分栏布局 + Tab导航
│   ├── data/
│   │   └── trading-data.ts  # 交易数据（来自盯盘记忆文件）
│   └── pages/
│       ├── TerminalPage.tsx       # ttyd iframe 终端
│       ├── DashboardPage.tsx      # 仪表盘
│       ├── PortfolioPage.tsx      # 持仓
│       ├── TradingSystemPage.tsx  # 交易系统
│       ├── MonsterStockPage.tsx   # 妖股监控
│       ├── JournalPage.tsx        # 市场日志
│       └── TasksPage.tsx          # 定时任务
├── vite.config.ts       # Vite + Electron 插件 + ttyd 集成
├── electron-builder.yml # 打包配置
└── package.json
```

## 数据来源

数据文件位于 `~/projects/AI_Project/todoDemo/claude盯盘/`：

| 文件 | 用途 |
|------|------|
| `持仓总览.md` | 三账户持仓明细 + 操作预案 |
| `妖股监控.md` | 候选股 + 板块强度 + 连板追踪 |
| `市场日志.md` | 每日判断 + 验证记录 |
| `交易纪律.md` | 规则 + 血泪教训 |
| `回本计划.md` | 亏损分析 + 三阶段计划 |
| `板块龙头.md` | 18板块76只监控个股 |

在 Claude Code 中输入"开启盯盘"会自动读取并同步这些文件。

## 许可

仅供个人使用。

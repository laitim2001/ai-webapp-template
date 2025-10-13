# 🚀 AI Web App 初始化模板
# AI Web App Initialization Template

**版本**: 5.0.13 (Stable Release)
**最後更新**: 2025-10-12
**完成進度**: ~78% (Phase 0-3 + 演示模式完成)
**源項目**: AI Sales Enablement Platform
**GitHub**: https://github.com/laitim2001/ai-webapp-template
**NPM**: `npx create-ai-webapp` ⭐ **NEW**

一個生產就緒的 Next.js 14 全棧應用模板，包含企業級監控、多數據庫支持、完整 UI 設計系統和 NPX 腳手架工具。22個模組完整實現，564+測試覆蓋，100%中文文檔，15個演示頁面。

---

## ✨ 特點

### 🎯 核心特性
- ✅ **Next.js 14** - App Router + Server Actions
- ✅ **TypeScript** - 嚴格模式
- ✅ **多數據庫支持** - PostgreSQL / MySQL / MongoDB / SQLite
- ✅ **企業級監控** - OpenTelemetry + Prometheus + Grafana + Azure Monitor
- ✅ **完整 UI 系統** - 26 組件 (含 Toast 通知) + 20+動畫 + 完整設計系統 + 暗色模式
- ✅ **智能 CLI** - 互動式項目初始化 + 錯誤處理 + 回滾機制
- ✅ **生產就緒** - 250+測試 + 完整部署配置 + 100%中文文檔

### 📦 完整實現功能模組（16個，65%完成）

**P0 核心模組** (4個):
- 🔐 **認證系統** - JWT 雙令牌 + Azure AD SSO + 25測試
- 🌐 **API Gateway** - 12 個企業級中間件
- 🔒 **Security & RBAC** - 角色權限 + 審計日誌 + 190+測試
- 📊 **監控系統** - OpenTelemetry + Prometheus + Grafana + 46告警規則

**P1 高優先級模組** (7個):
- 📚 **知識庫系統** - 向量搜索 + 版本控制 + pgvector
- 🔍 **智能搜索** - 多算法向量搜索
- 🤖 **AI 整合** - Azure OpenAI 封裝 + 嵌入服務
- ⚙️ **工作流程引擎** - 12 狀態 + 批准系統
- 🔔 **通知系統** - Email + In-App + Webhook
- ⚡ **Performance監控** - API追蹤 + 查詢優化 + 響應緩存 + 120+測試 ⭐ **New**
- 🛡️ **Resilience韌性** - 熔斷器 + 重試策略 + 健康檢查 + 100+測試 ⭐ **New**

**P2 輔助模組** (5個):
- 💾 **緩存系統** - Redis 雙層緩存 + 向量緩存
- 📄 **模板引擎** - Handlebars + 20 Helpers
- 📑 **PDF 生成** - Puppeteer HTML→PDF
- 📂 **文件解析** - PDF/Word/Excel/OCR
- 🔗 **Dynamics 365** - OAuth + API + 雙向同步
- 👥 **Customer 360** - 多源聚合 + AI洞察

### 🚧 可選業務模組（6個，Phase 3）

**P2 業務功能模組** (視需求而定):
- 📊 **Analytics** - 2文件, 482行 (行為追蹤)
- 📅 **Calendar** - 3文件, 1,388行 (日曆同步)
- 🤝 **Collaboration** - 2文件, 487行 (協作編輯)
- 📞 **Meeting** - 3文件, 1,214行 (會議智能)
- 💡 **Recommendation** - 2文件, 631行 (AI推薦)
- ⏰ **Reminder** - 3文件, 674行 (提醒系統)

### 🛠️ 開發工具鏈
- 📖 **文檔系統** - AI 助手指南 + 項目索引
- 🧪 **測試框架** - Jest + Playwright (120+ 測試)
- 🐳 **Docker 配置** - 開發 + 生產環境

---

## ✅ 當前狀態說明

**版本**: 5.0-rc (Release Candidate)
**狀態**: 生產就緒 (~65%完成，Phase 0-2 差距填充100%完成)
**建議**: 適合大型企業項目使用，可選擇性添加P2業務模組

### Phase 0-2 已完成 ✅

**Phase 0 (P0核心文件)** - Day 38-40:
- ✅ lib/errors.ts (~300行) - 完整錯誤處理系統
- ✅ lib/utils.ts (~250行) - 通用工具函數庫
- ✅ lib/prisma.ts (~150行) - Prisma數據庫客戶端封裝

**Phase 1 (P1短期計劃)** - Day 38-42:
- ✅ 8個項目文檔 (~2,550行)
- ✅ 9個部署配置 (~1,701行)
- ✅ 3個UI組件 (form, table, pagination)
- ✅ 4個測試文件 (~720行)
- ✅ 1個類型系統文件 (~180行)

**Phase 2 (P1+中期計劃)** - Day 43-45:
- ✅ module-performance (7文件, ~4,044行, 120+測試)
- ✅ module-resilience (7文件, ~3,370行, 100+測試)
- ✅ 所有16個模組Prisma schema驗證
- ✅ 所有16個模組API端點驗證
- ✅ 1,110行完整中文模組文檔

**差距填充總計**: 42個文件，~14,391行代碼

### 已實現功能總覽 ✅
- ✅ 完整的多數據庫支持架構 (4種數據庫)
- ✅ 企業級監控系統 (OpenTelemetry + Prometheus + Grafana)
- ✅ 16個核心功能模組 (P0+P1完整，P2部分)
- ✅ 26個UI組件 (含 Toast 通知) + 20+動畫
- ✅ 智能CLI初始化工具 (增強版)
- ✅ 整合測試系統 (5場景，250+測試)
- ✅ 完整部署配置 (Docker + nginx)
- ✅ 100%中文文檔 (~13,700行)

### 可選補充功能 🚧
- 🚧 6個P2業務模組 (Analytics, Calendar, Collaboration, Meeting, Recommendation, Reminder)
- 🚧 擴展Prisma Schema (視業務需求)
- 🚧 進階UI組件 (視需求添加)

### 源項目規模參考

**完整源項目統計**:
- 總代碼行數: 159,215 行
- 總文件數: 476 個生產文件
- 功能模組: 27 個 (lib/ 目錄)
- Prisma 模型: 34 個
- UI 組件: 114 個 (19個目錄)
- API 端點: 82 個
- 測試文件: 51 個

**目前模板已實現** (~45%):
- 基礎架構: ✅ Next.js 14 + TypeScript + Tailwind
- 數據庫: ✅ 多數據庫支持 (4種)
- 監控系統: ✅ OpenTelemetry + Prometheus/Grafana
- 已提取模組: 14 個 (48%完成)
- UI 組件: 23 個基礎組件 (20%完成)
- CLI 工具: ✅ 互動式初始化

**詳細分析**: 完整源項目分析請查看 `Docs/SOURCE-PROJECT-VERIFICATION.md`

---

## 🚀 快速開始

### 方法 1: 使用 NPX（推薦） ⭐ **NEW**

```bash
# 一條命令創建項目
npx create-ai-webapp my-awesome-app

# 進入項目目錄
cd my-awesome-app

# 啟動開發服務器
npm run dev
```

**就這麼簡單！** 🎉 互動式 CLI 會引導你完成所有配置。

**零模組配置 (演示模式)**:
如果不選擇任何模組,你將獲得 15 個完整演示頁面，可立即查看效果。

訪問 `http://localhost:3000/(demo)/login` 開始探索！

### 方法 2: 使用 Git Clone

```bash
# 1. 克隆模板倉庫
git clone https://github.com/laitim2001/ai-webapp-template.git
cd ai-webapp-template

# 2. 運行初始化 CLI
node init-project.js

# 3. 按照提示配置項目
# - 輸入項目名稱
# - 選擇數據庫類型
# - 選擇功能模組
# - 配置監控系統

# 4. 啟動開發服務器
npm run dev
```

**注意**: Git Clone 方式會在模板倉庫內生成項目，而 NPX 方式會在獨立目錄生成乾淨的項目。

---

## 📋 系統需求

### 基本要求
- **Node.js**: 18.x 或更高版本
- **npm**: 9.x 或更高版本
- **Git**: 最新版本

### 數據庫要求（選擇其一）
- **PostgreSQL**: 15.x 或更高（推薦）
- **MySQL**: 8.x 或更高
- **MongoDB**: 6.x 或更高
- **SQLite**: 3.x 或更高（開發用）

### 可選要求
- **Docker**: 24.x 或更高（用於監控堆疊）
- **Redis**: 7.x 或更高（用於緩存）

---

## 📦 包含的內容

### 核心基礎設施
```
00-monitoring/           # 企業級監控系統（7,000+ 行）
├── OpenTelemetry       # 統一遙測抽象層
├── Prometheus          # 指標收集
├── Grafana             # 可視化儀表板（4個預建）
├── Jaeger              # 分佈式追蹤
└── 46條告警規則        # 4級別智能告警

01-base/                # 基礎設施
├── Next.js 14          # 完整配置
├── TypeScript          # 嚴格模式
├── Tailwind CSS        # 完整主題
├── Prisma              # 4種數據庫 Schema
└── 數據庫適配器        # 統一接口層
```

### 功能模組（14個可選）
```
02-modules/
├── module-auth/                # 認證授權（2,500+ 行）
├── module-api-gateway/         # API Gateway（4,884 行）
├── module-knowledge-base/      # 知識庫（8,000+ 行）
├── module-search/              # 搜索引擎（2,800+ 行）
├── module-ai-integration/      # AI 整合（3,000+ 行）
├── module-workflow/            # 工作流程引擎（2,035 行）
├── module-notification/        # 通知系統（1,550 行）
├── module-cache/               # 緩存系統（1,500+ 行）
├── module-template/            # 範本管理（1,150 行）
├── module-pdf/                 # PDF 生成（640 行）
├── module-parsers/             # 文件解析（1,280 行）
├── module-dynamics365/         # Dynamics 365（1,200+ 行）
├── module-customer360/         # Customer 360（800+ 行）
└── module-performance/         # 性能監控
```

### UI 設計系統
```
04-ui-design-system/
├── colors/             # 完整色彩系統
├── typography/         # 排版系統
├── spacing/            # 8px 網格系統
├── animations/         # 所有動畫和過渡
└── components/         # 26+ UI 組件

01-base/components/
├── ui/                 # 基礎 UI 組件 (26個)
├── layout/             # 佈局組件
│   ├── dashboard-sidebar.tsx      # 側邊欄導航（分組菜單、徽章）
│   ├── dashboard-header.tsx       # 頂部導航（搜索、多語言、主題、通知）
│   └── dashboard-layout.tsx       # 完整佈局容器
└── dashboard/          # 儀表板組件
    └── sales-chart.tsx            # 銷售趨勢圖表（純CSS實現）
```

### 開發工具鏈
```
03-toolchain/
├── toolchain-docs/             # 文檔系統
│   ├── AI-ASSISTANT-GUIDE     # AI 助手指南
│   ├── PROJECT-INDEX          # 項目索引
│   ├── DEVELOPMENT-LOG        # 開發日誌
│   └── FIXLOG                 # 修復記錄
├── toolchain-testing/          # 測試框架
│   ├── Jest                   # 單元測試
│   └── Playwright             # E2E 測試（120+）
└── toolchain-deployment/       # 部署配置
    ├── Docker Compose         # 開發 + 生產
    ├── Nginx                  # 反向代理
    └── 健康檢查               # 完整監控
```

### 示例和參考
```
examples/
├── seed-data/          # 種子數據（5用戶+30條記錄）
├── sample-logs/        # 範例日誌記錄
└── ui-screenshots/     # UI 截圖參考
```

---

## 🎯 使用場景

### 適合的項目類型
✅ **企業級 Web 應用**  
✅ **AI 驅動的 SaaS 產品**  
✅ **知識管理系統**  
✅ **內容管理平台**  
✅ **CRM / ERP 系統**  
✅ **數據分析平台**

### 技術特點匹配
- 需要**企業級監控**和可觀測性
- 需要**多數據庫支持**的靈活性
- 需要**完整的認證授權**系統
- 需要**AI 整合**能力
- 需要**複雜的工作流程**管理
- 需要**生產就緒**的代碼質量

---

## 📖 文檔

**🗺️ [文檔導航地圖](DOCUMENTATION-MAP.md)** - 快速找到正確的文檔 ⭐ **NEW**

### 快速指南
- [數據庫切換指南](Docs/DATABASE-SWITCHING-GUIDE.md) - 如何在 4 種數據庫間切換
- [UI 設計系統](01-base/UI-DESIGN-SYSTEM.md) - 完整的 UI 組件和設計規範
- [Dashboard 組件指南](01-base/docs/DASHBOARD-COMPONENTS-GUIDE.md) - ⭐ **NEW** 專業儀表板組件使用指南
- [模組整合指南](02-modules/MODULE-INTEGRATION-GUIDE.md) - 22 個功能模組使用指南

### 深入指南
- [監控系統文檔](00-monitoring/README.md) - 企業級監控配置
- [動畫指南](01-base/docs/ANIMATION-GUIDE.md) - 20+ 動畫效果使用
- [響應式設計指南](01-base/docs/RESPONSIVE-DESIGN-GUIDE.md) - 移動優先設計

### 開發指南
- [AI 助手指南](CLAUDE.md) - AI 助手項目指南
- [項目狀態總覽](Docs/PROJECT-STATUS.md) - 當前完成度和下一步計劃

### 參考文檔
- [源項目結構快照](Docs/SOURCE-PROJECT-SNAPSHOT-ZH-TW.md) - 源項目完整分析
- [完整差距分析](Docs/COMPREHENSIVE-GAP-ANALYSIS-2025-10-10.md) - 待補充功能清單

---

## 🔧 配置選項

### 數據庫選擇

#### Prisma Schema 狀態

**當前包含** (5個基礎模型):
- User - 用戶認證
- RefreshToken - JWT令牌管理
- TokenBlacklist - 令牌黑名單
- APIKey - API金鑰管理 (部分)

**待補充** (29個業務模型, 85%不完整):
詳見完整源項目 34 個模型清單，包括:
- 客戶CRM (5個): Customer, Contact, Opportunity等
- 知識庫 (9個): KnowledgeBase, KnowledgeChunk等
- 提案管理 (6個): Proposal, ProposalItem等
- 工作流 (3個): ProposalWorkflow, ApprovalTask等
- 通知 (4個): Notification, NotificationTemplate等
- 其他業務模型...

**PostgreSQL**（推薦）
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```
✅ 功能最完整
✅ 支持 pgvector（向量搜索）
✅ 生產環境推薦

**MySQL**
```bash
DATABASE_URL="mysql://user:password@localhost:3306/dbname"
```
✅ 廣泛使用  
✅ 高性能  
⚠️ 不支持向量搜索

**MongoDB**
```bash
DATABASE_URL="mongodb://user:password@localhost:27017/dbname"
```
✅ NoSQL 靈活性  
✅ 適合非結構化數據  
⚠️ 需要適配器特殊處理

**SQLite**
```bash
DATABASE_URL="file:./dev.db"
```
✅ 零配置  
✅ 適合開發和測試  
⚠️ 不適合生產環境

### 監控後端選擇

**Prometheus + Grafana**（開發推薦）
```bash
MONITORING_BACKEND=prometheus
```
✅ 免費開源  
✅ 功能完整  
✅ Docker 一鍵啟動

**Azure Monitor**（生產推薦）
```bash
MONITORING_BACKEND=azure
APPLICATIONINSIGHTS_CONNECTION_STRING=your-connection-string
```
✅ 企業級  
✅ 雲原生  
✅ 零維護

**Console**（開發測試）
```bash
MONITORING_BACKEND=console
```
✅ 零配置  
✅ 即時輸出  
⚠️ 僅用於開發

---

## 🎨 UI 截圖

### 儀表板
![Dashboard](examples/ui-screenshots/dashboard.png)

### 知識庫列表
![Knowledge Base](examples/ui-screenshots/knowledge-base-list.png)

### 搜索界面
![Search Interface](examples/ui-screenshots/search-interface.png)

*更多截圖請查看 [examples/ui-screenshots/](examples/ui-screenshots/)*

---

## 🤝 貢獻

歡迎貢獻！請查看 [貢獻指南](CONTRIBUTING.md)。

### 貢獻方式
- 🐛 報告 Bug
- ✨ 提出新功能
- 📝 改進文檔
- 🔧 提交 Pull Request

---

## 📊 項目統計

### 源項目完整規模 (100%驗證)

- **總代碼行數**: 159,215 行
- **總文件數**: 476 個生產文件
- **功能模組**: 27 個 (lib/ 目錄)
- **Prisma 模型**: 34 個數據模型
- **UI 組件**: 114 個組件文件 (19個目錄)
- **API 端點**: 82 個 route.ts 文件
- **API 中間件**: 12 個企業級中間件
- **安全文件**: 19 個 (RBAC, 加密, 審計)
- **測試文件**: 51 個 (31單元 + 17 E2E + 3其他)

### 目前模板已實現 (~45%)

- **已提取模組**: 14 個 (48%完成)
- **基礎 UI 組件**: 23 個 (20%完成)
- **Prisma 模型**: 5 個基礎模型 (15%完成)
- **整合測試**: 5 場景 (100% 通過)
- **告警規則**: 46 條 (100%完成)
- **支持數據庫**: 4 種 (100% 測試)
- **動畫效果**: 20+ 個
- **響應式斷點**: 6 個

### 待補充內容 (~55%)

- **遺漏模組**: 13 個 (Security, Performance等)
- **待補充 Prisma**: 29 個業務模型
- **待補充組件**: 91 個進階組件
- **待補充 API**: 多數端點待提取
- **lib/ 根文件**: 7個核心文件 (errors.ts等)

---

## 📜 授權

MIT License

---

## 🙏 致謝

本模板基於 [AI Sales Enablement Platform](https://github.com/laitim2001/ai-sales-enablement-webapp) 項目提取和優化。

### 技術棧
- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [OpenTelemetry](https://opentelemetry.io/)
- [Prometheus](https://prometheus.io/)
- [Grafana](https://grafana.com/)

---

## 📞 支持

- **文檔**: [docs/](docs/)
- **問題**: [GitHub Issues](https://github.com/laitim2001/ai-webapp-template/issues)
- **討論**: [GitHub Discussions](https://github.com/laitim2001/ai-webapp-template/discussions)

---

## 🗺️ 路線圖

### v5.0.13 (當前 - 2025-10-12) ✅
- ✅ 基礎模板結構
- ✅ 多數據庫支持 (4種)
- ✅ 企業級監控系統
- ✅ 完整 UI 系統 (26組件，含 Toast 通知) ⭐ **NEW**
- ✅ 22個功能模組
- ✅ 15個演示頁面 (零模組配置)
- ✅ **NPX 腳手架工具** (`npx create-ai-webapp`)
- ✅ 564+測試覆蓋
- ✅ 100%中文文檔
- ✅ **Hotfix 週期** (v5.0.10-v5.0.13: pgvector 支援, Tailwind 依賴, Toast 組件) ⭐ **NEW**
- 🎯 **狀態**: ~78%完成，生產就緒

### v5.1 (計劃中 - 1-2週)
- ✅ **發布到 NPM Registry** (2025-10-11) ⭐ **DONE**
- ✅ **Hotfix 週期完成** (v5.0.10-v5.0.13, 2025-10-12) ⭐ **DONE**
- [ ] 完整 E2E 測試驗證
- [ ] 性能優化和包體積優化
- [ ] 更多示例項目
- [ ] 收集社群反饋
- 🎯 **目標**: 社群推廣和優化

### v5.2 (計劃中 - 3-4週)
- [ ] 補充進階 UI 組件
- [ ] 完整 API 端點提取
- [ ] 更多業務模組
- [ ] GraphQL 支持 (可選)
- 🎯 **目標**: 90%+完成

### v6.0 (未來)
- [ ] 多雲支持（AWS/GCP/Azure）
- [ ] 微服務架構選項
- [ ] 插件系統
- [ ] CLI 圖形界面

---

**快速開始**: `npx create-ai-webapp my-app` ⭐
**文檔**: [docs/](docs/)
**GitHub**: https://github.com/laitim2001/ai-webapp-template
**NPM 包**: https://www.npmjs.com/package/create-ai-webapp ✅ **已發布**

🎉 **祝你構建出色的應用！**


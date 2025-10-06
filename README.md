# 🚀 AI Web App 初始化模板
# AI Web App Initialization Template

**版本**: 5.0
**最後更新**: 2025-10-06
**完成進度**: 96.3% (26/27天)
**源項目**: AI Sales Enablement Platform
**GitHub**: https://github.com/laitim2001/ai-webapp-template

一個完整的、生產就緒的 Next.js 14 全棧應用模板，包含企業級監控、多數據庫支持、完整的 UI 設計系統和智能 CLI 工具。

---

## ✨ 特點

### 🎯 核心特性
- ✅ **Next.js 14** - App Router + Server Actions
- ✅ **TypeScript** - 嚴格模式
- ✅ **多數據庫支持** - PostgreSQL / MySQL / MongoDB / SQLite
- ✅ **企業級監控** - OpenTelemetry + Prometheus + Grafana + Jaeger
- ✅ **完整 UI 系統** - 23 組件 + 完整設計系統 + 暗色模式
- ✅ **智能 CLI** - 互動式項目初始化

### 📦 功能模組（可選安裝）
- 🔐 **認證系統** - JWT 雙令牌 + Azure AD SSO + 25測試
- 🌐 **API Gateway** - 10 個企業級中間件
- 📚 **知識庫系統** - 向量搜索 + 版本控制 + pgvector
- 🔍 **智能搜索** - 多算法向量搜索
- 🤖 **AI 整合** - Azure OpenAI 封裝 + 嵌入服務
- ⚙️ **工作流程引擎** - 12 狀態 + 批准系統
- 🔔 **通知系統** - Email + In-App + Webhook
- 💾 **緩存系統** - Redis 雙層緩存
- 📄 **模板引擎** - Handlebars + 20 Helpers
- 📑 **PDF 生成** - Puppeteer HTML→PDF
- 📂 **文件解析** - PDF/Word/Excel/OCR
- 🔗 **Dynamics 365** - OAuth + API + 雙向同步
- 👥 **Customer 360** - 多源聚合 + AI洞察

### 🛠️ 開發工具鏈
- 📖 **文檔系統** - AI 助手指南 + 項目索引
- 🧪 **測試框架** - Jest + Playwright (120+ 測試)
- 🐳 **Docker 配置** - 開發 + 生產環境

---

## 🚀 快速開始

### 方法 1: 使用 Git（推薦）

```bash
# 1. 克隆模板倉庫
git clone https://github.com/laitim2001/ai-webapp-template.git
cd ai-webapp-template

# 2. 運行初始化 CLI
node scripts/init-project.js

# 3. 按照提示配置項目
# - 輸入項目名稱
# - 選擇數據庫類型
# - 選擇功能模組
# - 配置監控系統

# 4. 進入新項目
cd your-project-name

# 5. 啟動開發服務器
npm run dev
```

### 方法 2: 使用 NPM（未來支持）

```bash
# 未來將支持
npx create-ai-webapp my-new-project
```

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
└── components/         # 20+ UI 組件
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

### 快速指南
- [數據庫切換指南](Docs/DATABASE-SWITCHING-GUIDE.md) - 如何在 4 種數據庫間切換
- [UI 設計系統](01-base/UI-DESIGN-SYSTEM.md) - 完整的 UI 組件和設計規範
- [模組整合指南](02-modules/MODULE-INTEGRATION-GUIDE.md) - 14 個功能模組使用指南

### 深入指南
- [監控系統文檔](00-monitoring/README.md) - 企業級監控配置
- [動畫指南](01-base/docs/ANIMATION-GUIDE.md) - 20+ 動畫效果使用
- [響應式設計指南](01-base/docs/RESPONSIVE-DESIGN-GUIDE.md) - 移動優先設計

### 開發指南
- [AI 助手指南](CLAUDE.md) - AI 助手項目指南
- [測試框架指南](03-toolchain/toolchain-testing/README.md) - Jest + Playwright 測試

---

## 🔧 配置選項

### 數據庫選擇

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

- **總代碼行數**: 39,000+ 行
- **功能模組**: 14 個
- **UI 組件**: 23 個 (100% 驗證)
- **動畫效果**: 20+ 個
- **響應式斷點**: 6 個
- **測試數量**: 120+ 個
- **整合測試**: 5 場景 (100% 通過)
- **告警規則**: 46 條
- **支持數據庫**: 4 種 (100% 測試)

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

### v5.0 (當前)
- ✅ 基礎模板結構
- ✅ 多數據庫支持
- ✅ 企業級監控
- ✅ 完整 UI 系統

### v5.1 (計劃中)
- [ ] NPM 包發布
- [ ] 更多數據庫支持
- [ ] 更多範例項目

### v6.0 (未來)
- [ ] 多雲支持（AWS/GCP）
- [ ] 微服務架構選項
- [ ] GraphQL 支持

---

**開始使用**: `node scripts/init-project.js`  
**文檔**: [docs/](docs/)  
**GitHub**: https://github.com/laitim2001/ai-webapp-template

🎉 **祝你構建出色的應用！**


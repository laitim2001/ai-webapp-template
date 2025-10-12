# create-ai-webapp

快速創建 AI 驅動的 Next.js 14 全棧 Web 應用

## 快速開始

```bash
npx create-ai-webapp my-awesome-app
cd my-awesome-app
npm run dev
```

就這麼簡單！🎉

## 功能特性

### 🚀 現代技術棧

- **Next.js 14** - App Router, Server Components, Server Actions
- **TypeScript 5** - 嚴格類型檢查
- **Tailwind CSS 3** - 完整設計系統
- **Prisma** - 多數據庫支持 (PostgreSQL, MySQL, MongoDB, SQLite)
- **shadcn/ui** - 26+ 精美 UI 組件 (含 Toast 通知)

### 📦 可選功能模組 (22個)

#### P0 核心模組
- **認證系統** - JWT + Azure AD SSO
- **API Gateway** - 12個企業級中間件
- **安全模組** - 數據保護 + 審計
- **監控系統** - OpenTelemetry + Prometheus/Azure Monitor

#### P1 高優先級模組
- **知識庫系統** - 向量搜索 + 版本控制
- **AI 整合** - Azure OpenAI 封裝
- **搜索模組** - 多算法向量搜索
- **工作流引擎** - 12狀態工作流
- **通知系統** - 多渠道通知
- **性能監控** - 應用級性能追蹤
- **韌性模組** - 容錯 + 重試 + 熔斷

#### P2 輔助工具模組
- **緩存系統** - Redis 雙層緩存
- **模板管理** - Handlebars + PDF
- **PDF 生成** - Puppeteer
- **文件解析器** - PDF/Word/Excel/OCR
- **Dynamics 365 整合**
- **Customer 360** - 客戶全景視圖

#### Phase 3 業務模組
- **會議管理** - 排程 + Teams 整合
- **日曆系統** - 事件管理 + 同步
- **分析模組** - 數據分析 + 報表
- **提醒系統** - 智能提醒引擎
- **推薦引擎** - 內容推薦
- **協作模組** - 團隊協作

### 🎭 零模組配置 (演示模式)

如果不選擇任何模組，你將獲得:

- ✅ **15個完整演示頁面** - 登錄、儀表板、知識庫、客戶管理、任務管理等
- ✅ **完整 UI 設計系統** - 20+ shadcn/ui 組件
- ✅ **演示數據和模擬 API** - 40+ API 函數，15個數據集
- ✅ **響應式設計** - 支持所有設備
- ✅ **深色模式** - 自動切換

演示頁面包括:
- 登錄/註冊頁面
- 主儀表板 (統計卡片 + 圖表)
- 知識庫管理
- 全局搜索
- 通知中心
- 客戶管理 CRM
- 任務管理系統
- AI 助手聊天
- 提案管理
- 模板管理
- 系統管理後台
- RESTful API 文檔

## 使用方式

### 基本用法

```bash
# 使用 npx (推薦)
npx create-ai-webapp my-app

# 或使用 npm
npm create ai-webapp my-app

# 或使用 yarn
yarn create ai-webapp my-app
```

### 互動式配置

運行命令後，CLI 會引導你完成以下配置:

1. **項目基本信息** - 名稱、描述、作者
2. **數據庫選擇** - PostgreSQL / MySQL / MongoDB / SQLite
3. **模組選擇** - 選擇需要的功能模組
4. **監控配置** - Prometheus / Azure Monitor / 兩者都要
5. **環境變數** - 數據庫連接、API 密鑰等
6. **示例數據** - 是否生成種子數據和示例日誌

### 項目結構

```
my-app/
├── app/                    # Next.js 14 App Router
│   ├── layout.tsx         # 根布局
│   ├── page.tsx          # 首頁
│   ├── (demo)/           # 演示頁面 (零模組配置)
│   └── api/              # API 路由
├── components/           # React 組件
│   └── ui/              # 26+ shadcn/ui 組件 (含 Toast 通知)
├── lib/                 # 核心工具
│   ├── db/             # 數據庫適配器
│   ├── demo-data.ts    # 演示數據 (零模組配置)
│   └── demo-api.ts     # 模擬 API (零模組配置)
├── prisma/             # Prisma ORM
│   └── schema.prisma   # 數據庫模型
├── .env.local          # 環境變數
├── package.json        # 項目配置
└── README.md           # 項目說明
```

## 數據庫支持

### PostgreSQL (推薦)

功能最完整，支持向量搜索 (pgvector)

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

### MySQL

廣泛使用，高性能

```bash
DATABASE_URL="mysql://user:password@localhost:3306/dbname"
```

### MongoDB

NoSQL，靈活 Schema

```bash
DATABASE_URL="mongodb://user:password@localhost:27017/dbname"
```

### SQLite

零配置，開發測試用

```bash
DATABASE_URL="file:./dev.db"
```

## 開發命令

```bash
# 開發服務器
npm run dev

# 生產構建
npm run build
npm start

# 代碼檢查
npm run lint

# 測試 (如果選擇了測試模組)
npm test
npm run test:e2e

# 數據庫
npm run prisma:generate    # 生成 Prisma Client
npm run prisma:migrate     # 運行遷移
npm run prisma:studio      # 數據庫 GUI

# 監控 (如果選擇了監控模組)
npm run monitoring:start   # 啟動 Prometheus + Grafana
npm run monitoring:stop    # 停止監控堆棧
```

## 示例項目

### 零模組配置 (演示模式)

```bash
npx create-ai-webapp demo-project
# 不選擇任何模組
# 獲得15個完整演示頁面
```

訪問 `http://localhost:3000/(demo)/login` 查看演示頁面

### 完整企業級應用

```bash
npx create-ai-webapp enterprise-app
# 選擇所有模組
# 獲得22個企業級功能模組
```

### AI 驅動的知識庫

```bash
npx create-ai-webapp knowledge-base
# 選擇: 認證 + AI整合 + 知識庫 + 搜索 + 監控
```

### 客戶管理系統

```bash
npx create-ai-webapp crm-system
# 選擇: 認證 + API Gateway + Customer 360 + Dynamics 365
```

## 環境要求

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **數據庫**: PostgreSQL 14+ / MySQL 8+ / MongoDB 6+ / SQLite 3+

## 項目統計

- **總代碼行數**: 86,536+
- **UI 組件**: 26個 (新增 Toast 通知)
- **功能模組**: 22個
- **測試**: 564+
- **文檔**: 完整中文文檔

## 文檔

創建項目後，查看以下文檔:

- **DEMO-MODE.md** - 演示模式完整說明 (零模組配置)
- **AI-ASSISTANT-GUIDE.md** - AI 助手使用指南
- **PROJECT-INDEX.md** - 項目文件索引
- **DEPLOYMENT-GUIDE.md** - 部署指南

## 常見問題

### 如何選擇數據庫?

- **PostgreSQL**: 功能最完整，推薦用於生產環境
- **MySQL**: 高性能，廣泛使用
- **MongoDB**: NoSQL，適合非結構化數據
- **SQLite**: 零配置，僅用於開發測試

### 零模組配置和完整配置有什麼區別?

- **零模組配置**: 獲得15個演示頁面，適合快速預覽和學習
- **完整配置**: 獲得22個企業級功能模組，適合生產環境

### 可以稍後添加模組嗎?

可以！參考模板倉庫的 `02-modules/` 目錄，手動複製需要的模組文件。

### 支持哪些 AI 服務?

- Azure OpenAI (內置)
- OpenAI API (兼容)
- 其他 OpenAI 兼容 API

## 版本歷史

### 5.0.13 (2025-10-12)

- ✅ 新增 Toast UI 組件系統 (toast.tsx + toaster.tsx)
- ✅ 完整的通知提示功能 (基於 @radix-ui/react-toast)
- ✅ UI 組件數量從 24 增加到 26

### 5.0.12 (2025-10-12)

- 🔴 Critical Fix: 添加缺失的 tailwindcss-animate 依賴
- ✅ 修復 "Cannot find module 'tailwindcss-animate'" 錯誤
- ✅ 確保 Tailwind CSS 動畫插件正常工作

### 5.0.11 (2025-10-12)

- 🔴 Critical Fix: 修復 pgvector 索引語法錯誤
- ✅ 移除不正確的 GIN 索引定義
- ✅ 添加 pgvector 索引手動創建指南

### 5.0.10 (2025-10-12)

- 🔴 Critical Fix: 使用 ankane/pgvector Docker 鏡像
- ✅ 修復 "could not open extension control file vector.control" 錯誤
- ✅ 添加完整的 Docker 容器管理命令
- ✅ 確保 pgvector 擴展正確安裝

### 5.0.0 (2025-10-11)

- ✅ 初始發布
- ✅ NPX 全局安裝支持
- ✅ 22個功能模組
- ✅ 15個演示頁面
- ✅ 4種數據庫支持
- ✅ 完整中文文檔

## 支持

- **GitHub**: https://github.com/laitim2001/ai-webapp-template
- **Issues**: https://github.com/laitim2001/ai-webapp-template/issues
- **Discussions**: https://github.com/laitim2001/ai-webapp-template/discussions

## 許可證

MIT License - 查看 [LICENSE](LICENSE) 文件

## 致謝

基於 [AI Sales Enablement Platform](https://github.com/laitim2001/ai-sales-enablement) 提取和優化。

---

**由 create-ai-webapp 提供支持** ⚡

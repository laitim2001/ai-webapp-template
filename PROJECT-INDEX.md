# 📑 項目完整索引 - AI Web App Template

**版本**: 5.0
**最後更新**: 2025-10-09
**快速導航**: [AI-ASSISTANT-GUIDE.md](AI-ASSISTANT-GUIDE.md) | [CLAUDE.md](CLAUDE.md) | [README.md](README.md)

---

## 🎯 索引使用指南

本索引提供項目所有文件和功能的完整導航。按照以下方式使用：

| 你想要... | 查看章節 |
|-----------|---------|
| **了解項目結構** | [1. 項目目錄結構](#1-項目目錄結構) |
| **查找文檔** | [2. 文檔索引](#2-文檔索引) |
| **查看模組** | [3. 功能模組索引](#3-功能模組索引) |
| **找組件** | [4. 組件索引](#4-組件索引) |
| **找API** | [5. API路由索引](#5-api路由索引) |
| **查看配置** | [6. 配置文件索引](#6-配置文件索引) |
| **查看腳本** | [7. 腳本和工具索引](#7-腳本和工具索引) |

---

## 1. 項目目錄結構

### 📁 完整目錄樹

```
ai-webapp-template/
│
├── 📄 核心文件
│   ├── README.md                          # 項目介紹
│   ├── AI-ASSISTANT-GUIDE.md              # AI助手統一入口 ⭐
│   ├── PROJECT-INDEX.md                   # 項目完整索引（本文件）⭐
│   ├── CLAUDE.md                          # Claude Code 開發指導
│   ├── package.json                       # 項目依賴
│   ├── next.config.js                     # Next.js 配置
│   ├── tsconfig.json                      # TypeScript 配置
│   ├── tailwind.config.js                 # Tailwind CSS 配置
│   └── init-project.js                    # 初始化 CLI 工具 ⭐⭐⭐
│
├── 📂 01-base/                            # 基礎模板層 ⭐⭐⭐
│   ├── app/                               # Next.js App Router
│   ├── components/                        # React 組件（114個文件）
│   ├── lib/                               # 核心工具庫（27個模組）
│   ├── types/                             # TypeScript 類型
│   ├── hooks/                             # 自定義 Hooks
│   ├── prisma/                            # 數據庫 Schema
│   └── public/                            # 靜態資源
│
├── 📂 02-modules/                         # 功能模組庫 ⭐⭐⭐
│   ├── module-auth/                       # P0: 認證授權
│   ├── module-security/                   # P0: Security & RBAC
│   ├── module-api-gateway/                # P0: API Gateway
│   ├── module-knowledge-base/             # P1: 知識庫系統
│   ├── module-ai-integration/             # P1: AI 整合
│   ├── module-search/                     # P1: 搜索引擎
│   ├── module-workflow/                   # P1: 工作流引擎
│   ├── module-notification/               # P1: 通知系統
│   ├── module-cache/                      # P1: 緩存系統
│   ├── module-performance/                # P1: 性能優化
│   ├── module-resilience/                 # P1: 彈性模組
│   ├── module-template/                   # P2: 範本管理
│   ├── module-pdf/                        # P2: PDF 生成
│   ├── module-parsers/                    # P2: 文件解析
│   ├── module-dynamics365/                # P2: Dynamics 365
│   ├── module-customer360/                # P2: 客戶360
│   ├── module-analytics/                  # P2: 用戶分析
│   ├── module-calendar/                   # P2: 日曆同步
│   ├── module-collaboration/              # P2: 協作功能
│   ├── module-meeting/                    # P2: 會議準備
│   ├── module-recommendation/             # P2: 推薦引擎
│   ├── module-reminder/                   # P2: 提醒系統
│   └── [23個模組詳細說明見下文]
│
├── 📂 00-monitoring/                      # 監控基礎設施 ⭐⭐⭐
│   ├── instrumentation.ts.template        # OpenTelemetry 初始化
│   ├── lib/monitoring/                    # 監控工具（7個文件）
│   ├── monitoring/                        # 配置文件（10個）
│   └── [Prometheus/Grafana/Azure Monitor配置]
│
├── 📂 Docs/                               # 技術文檔 ⭐⭐
│   ├── TEMPLATE-CREATION-FINAL-v5-COMPLETE.md  # 完整實施計劃（3,266行）
│   ├── SOURCE-PROJECT-SNAPSHOT.md         # 源項目快照
│   ├── SOURCE-PROJECT-VERIFICATION.md     # 100% 驗證報告
│   ├── TEMPLATE-VS-SOURCE-COMPARISON.md   # 對比分析
│   ├── V4-V5-COMPARISON-ANALYSIS.md       # 版本對比
│   ├── V5-ADDITIONS.md                    # v5.0 新增內容
│   ├── V5-COMPLETE-INTEGRATION-GUIDE.md   # 整合指南
│   ├── VERIFICATION-SUMMARY.md            # 驗證摘要
│   ├── SCAN-COMPLETENESS-REPORT.md        # 掃描完整性
│   └── [其他技術文檔]
│
├── 📂 examples/                           # 示例數據 ⭐
│   ├── seed-data/                         # 種子數據（5用戶+30記錄）
│   ├── sample-logs/                       # 範例日誌
│   └── ui-reference/                      # UI結構參考
│
├── 📂 tests/                              # 測試文件
│   ├── unit/                              # 單元測試（Jest）
│   ├── e2e/                               # E2E測試（Playwright）
│   └── integration/                       # 整合測試
│
└── 📂 scripts/                            # 工具腳本
    ├── deploy.sh                          # 部署腳本
    ├── backup.sh                          # 備份腳本
    └── [其他工具腳本]
```

---

## 2. 文檔索引

### 📚 核心文檔（必讀）

| 文檔 | 大小 | 用途 | 優先級 |
|------|------|------|--------|
| [AI-ASSISTANT-GUIDE.md](AI-ASSISTANT-GUIDE.md) | ~800行 | AI助手統一入口，快速了解項目 | ⭐⭐⭐ |
| [PROJECT-INDEX.md](PROJECT-INDEX.md) | 本文件 | 完整項目索引和導航 | ⭐⭐⭐ |
| [CLAUDE.md](CLAUDE.md) | ~400行 | Claude Code 開發指導 | ⭐⭐⭐ |
| [README.md](README.md) | ~200行 | 項目介紹和快速開始 | ⭐⭐⭐ |

### 📖 技術文檔（詳細參考）

| 文檔 | 行數 | 內容 | 用途 |
|------|------|------|------|
| [TEMPLATE-CREATION-FINAL-v5-COMPLETE.md](Docs/TEMPLATE-CREATION-FINAL-v5-COMPLETE.md) | 3,266 | v5.0 完整實施計劃 | 完整技術規範 |
| [SOURCE-PROJECT-SNAPSHOT.md](Docs/SOURCE-PROJECT-SNAPSHOT.md) | ~1,200 | 源項目完整快照 | 項目結構參考 |
| [SOURCE-PROJECT-VERIFICATION.md](Docs/SOURCE-PROJECT-VERIFICATION.md) | ~600 | 100% 驗證報告 | 驗證結果 |
| [TEMPLATE-VS-SOURCE-COMPARISON.md](Docs/TEMPLATE-VS-SOURCE-COMPARISON.md) | ~800 | 模板與源項目對比 | 差異分析 |
| [V4-V5-COMPARISON-ANALYSIS.md](Docs/V4-V5-COMPARISON-ANALYSIS.md) | ~400 | v4/v5 版本對比 | 版本演進 |
| [V5-ADDITIONS.md](Docs/V5-ADDITIONS.md) | ~300 | v5.0 新增內容 | 新功能說明 |
| [V5-COMPLETE-INTEGRATION-GUIDE.md](Docs/V5-COMPLETE-INTEGRATION-GUIDE.md) | ~500 | v5.0 整合指南 | 整合步驟 |
| [VERIFICATION-SUMMARY.md](Docs/VERIFICATION-SUMMARY.md) | ~400 | 驗證摘要 | 快速檢查 |
| [SCAN-COMPLETENESS-REPORT.md](Docs/SCAN-COMPLETENESS-REPORT.md) | ~310 | 掃描完整性報告 | 完整性驗證 |

### 📝 模組文檔（隨模組提供）

每個模組在 `02-modules/module-{name}/` 目錄下都包含：
- `README.md` - 模組說明和使用指南
- `install.sh` - 安裝腳本
- 使用範例代碼

---

## 3. 功能模組索引

### 🎯 模組分類（按優先級）

#### P0 - 核心必選模組（4個）

| 模組 | 路徑 | 文件數 | 代碼行數 | 說明 |
|------|------|--------|---------|------|
| **監控系統** | `00-monitoring/` | 7+10 | 2,776 | OpenTelemetry 完整堆疊 |
| **認證授權** | `02-modules/module-auth/` | 14 | 2,500+ | JWT + Azure AD SSO |
| **Security & RBAC** | `02-modules/module-security/` | 14 | 1,800+ | 細粒度權限控制 |
| **API Gateway** | `02-modules/module-api-gateway/` | 12 | 4,884 | 12個企業級中間件 |

#### P1 - 高優先級模組（8個）

| 模組 | 路徑 | 文件數 | 代碼行數 | 說明 |
|------|------|--------|---------|------|
| **知識庫系統** | `02-modules/module-knowledge-base/` | 40+ | 8,000+ | 文檔管理+版本控制 |
| **AI 整合** | `02-modules/module-ai-integration/` | 8 | 3,000+ | Azure OpenAI 封裝 |
| **搜索引擎** | `02-modules/module-search/` | 12 | 2,800+ | 多算法向量搜索 |
| **工作流引擎** | `02-modules/module-workflow/` | 10 | 2,035 | 12狀態流程管理 |
| **通知系統** | `02-modules/module-notification/` | 8 | 1,550 | 多渠道通知 |
| **緩存系統** | `02-modules/module-cache/` | 6 | 1,500+ | Redis 雙層緩存 |
| **性能優化** | `02-modules/module-performance/` | 8 | 600+ | 查詢優化+監控 |
| **彈性模組** | `02-modules/module-resilience/` | 8 | 600+ | 斷路器+重試 |

#### P2 - 可選業務模組（11個）

| 模組 | 路徑 | 文件數 | 代碼行數 | 說明 |
|------|------|--------|---------|------|
| **範本管理** | `02-modules/module-template/` | 6 | 1,150 | Handlebars 模板 |
| **PDF 生成** | `02-modules/module-pdf/` | 3 | 640 | Puppeteer PDF |
| **文件解析** | `02-modules/module-parsers/` | 6 | 1,280 | PDF/Word/Excel/OCR |
| **Dynamics 365** | `02-modules/module-dynamics365/` | 6 | 1,200+ | CRM 整合 |
| **客戶360** | `02-modules/module-customer360/` | 4 | 800+ | 客戶360視圖 |
| **用戶分析** | `02-modules/module-analytics/` | 2 | 482 | 行為追蹤 |
| **日曆同步** | `02-modules/module-calendar/` | 3 | 1,388 | Microsoft Graph |
| **協作功能** | `02-modules/module-collaboration/` | 2 | 487 | 編輯鎖定 |
| **會議準備** | `02-modules/module-meeting/` | 3 | 1,214 | AI會議分析 |
| **推薦引擎** | `02-modules/module-recommendation/` | 2 | 631 | 個性化推薦 |
| **提醒系統** | `02-modules/module-reminder/` | 3 | 674 | 提醒調度器 |

**總計**: 23個模組，164,091行代碼

---

## 4. 組件索引

### 🎨 組件目錄結構（19個目錄，114個文件）

#### 基礎UI組件（24個文件）

**路徑**: `01-base/components/ui/`

| 組件文件 | 用途 | 基於 |
|----------|------|------|
| `alert.tsx` | 警告提示 | Radix UI |
| `alert-dialog.tsx` | 對話框 | Radix UI |
| `avatar.tsx` | 頭像 | Radix UI |
| `badge.tsx` | 徽章 | Radix UI |
| `button.tsx` | 按鈕 | Radix UI |
| `card.tsx` | 卡片 | Radix UI |
| `checkbox.tsx` | 複選框 | Radix UI |
| `command.tsx` | 命令面板 | Radix UI |
| `dialog.tsx` | 對話框 | Radix UI |
| `dropdown-menu.tsx` | 下拉菜單 | Radix UI |
| `error-display.tsx` | 錯誤展示 | 自定義 |
| `input.tsx` | 輸入框 | Radix UI |
| `label.tsx` | 標籤 | Radix UI |
| `popover.tsx` | 彈出框 | Radix UI |
| `progress.tsx` | 進度條 | Radix UI |
| `select.tsx` | 選擇器 | Radix UI |
| `separator.tsx` | 分隔線 | Radix UI |
| `sheet.tsx` | 側邊欄 | Radix UI |
| `skeleton.tsx` | 骨架屏 | Radix UI |
| `slider.tsx` | 滑塊 | Radix UI |
| `switch.tsx` | 開關 | Radix UI |
| `tabs.tsx` | 標籤頁 | Radix UI |
| `textarea.tsx` | 文本域 | Radix UI |
| `use-toast.ts` | Toast鉤子 | 自定義 |

#### 知識庫組件（35個文件）

**路徑**: `01-base/components/knowledge/`

**核心編輯器** (3個):
- `enhanced-knowledge-editor.tsx` - 增強編輯器（TipTap）
- `rich-text-editor.tsx` - 富文本編輯器
- `advanced-editor-toolbar.tsx` - 編輯工具欄

**搜索相關** (5個):
- `enhanced-knowledge-search.tsx` - 增強搜索
- `advanced-search-builder.tsx` - 搜索構建器
- `knowledge-search.tsx` - 基礎搜索
- `quick-jump-search.tsx` - 快速跳轉
- `search-suggestions.tsx` - 搜索建議

**文檔管理** (8個):
- `knowledge-document-view.tsx` - 文檔查看
- `knowledge-document-edit.tsx` - 文檔編輯
- `knowledge-document-edit-with-version.tsx` - 版本編輯
- `document-preview.tsx` - 文檔預覽
- `knowledge-base-upload.tsx` - 文件上傳
- `bulk-upload.tsx` - 批量上傳
- `knowledge-create-form.tsx` - 創建表單
- `folder-selector.tsx` - 文件夾選擇

**列表與視圖** (4個):
- `knowledge-base-list.tsx` - 列表視圖
- `knowledge-base-list-optimized.tsx` - 優化列表
- `knowledge-base-filters.tsx` - 篩選器
- `knowledge-folder-tree.tsx` - 文件夾樹

**其他** (15個) - 分析、推薦、版本控制等

#### 其他功能組件（55個文件）

| 目錄 | 文件數 | 主要組件 |
|------|--------|---------|
| `admin/` | 2 | 性能儀表板、系統監控 |
| `assistant/` | 4 | AI聊天界面、消息列表 |
| `audit/` | 3 | 審計日誌、時間線 |
| `calendar/` | 3 | 日曆事件、同步狀態 |
| `collaboration/` | 2 | 編輯鎖、在線狀態 |
| `crm/` | 7 | 客戶列表、360視圖 |
| `dashboard/` | 6 | 統計卡片、活動時間線 |
| `features/` | 2 | 功能展示組件 |
| `layout/` | 5 | 頁面佈局、導航欄 |
| `meeting-prep/` | 5 | 會議分析、準備包 |
| `notifications/` | 3 | 通知中心、鈴鐺 |
| `permissions/` | 1 | 權限管理界面 |
| `recommendation/` | 2 | 內容推薦、反饋 |
| `reminder/` | 2 | 提醒列表、創建器 |
| `search/` | 8 | 語義搜索、結果展示 |
| `workflow/` | 12 | 工作流設計器、狀態機 |

---

## 5. API路由索引

### 🚀 API 域分類（23個域，82個端點）

#### 核心業務 API

**Knowledge Base API** (17個端點)
```
/api/knowledge-base
├── GET    /                           # 列表查詢
├── POST   /                           # 創建文檔
├── GET    /[id]                       # 獲取文檔
├── PUT    /[id]                       # 更新文檔
├── DELETE /[id]                       # 刪除文檔
├── GET    /[id]/content               # 獲取內容
├── GET    /[id]/download              # 下載文檔
├── GET    /[id]/versions              # 版本列表
├── GET    /[id]/versions/[versionId] # 特定版本
├── POST   /[id]/versions/compare     # 版本對比
├── POST   /[id]/versions/revert      # 回退版本
├── POST   /search                     # 基礎搜索
├── POST   /advanced-search            # 高級搜索
├── POST   /upload                     # 上傳文件
├── POST   /bulk-upload                # 批量上傳
├── POST   /check-duplicate            # 重複檢查
├── GET    /suggestions                # 搜索建議
├── GET    /tags                       # 標籤列表
├── GET    /analytics                  # 分析數據
└── GET    /processing                 # 處理狀態
```

**Authentication API** (7個端點)
```
/api/auth
├── POST   /register                   # 用戶註冊
├── POST   /login                      # 用戶登錄
├── POST   /logout                     # 用戶登出
├── POST   /refresh                    # 刷新令牌
├── GET    /me                         # 獲取當前用戶
├── GET    /azure-ad/login             # Azure AD 登錄
└── GET    /azure-ad/callback          # Azure AD 回調
```

**Templates API** (8個端點)
```
/api/templates
├── GET    /                           # 模板列表
├── POST   /                           # 創建模板
├── GET    /[id]                       # 獲取模板
├── PUT    /[id]                       # 更新模板
├── DELETE /[id]                       # 刪除模板
├── POST   /[id]/duplicate             # 複製模板
├── POST   /[id]/preview               # 預覽模板
├── POST   /[id]/export-pdf            # 導出PDF
└── GET    /stats                      # 統計數據
```

#### 其他 API 域（54個端點）

| API 域 | 端點數 | 主要功能 |
|--------|--------|---------|
| `ai/` | 2 | AI生成提案 |
| `analytics/` | 3 | 用戶行為追蹤 |
| `assistant/` | 1 | AI助手聊天 |
| `audit-logs/` | 3 | 審計日誌、導出 |
| `calendar/` | 3 | Microsoft Graph 同步 |
| `collaboration/` | 3 | 編輯鎖定管理 |
| `customers/` | 2 | 客戶管理、360視圖 |
| `health/` | 1 | 健康檢查 |
| `knowledge-folders/` | 4 | 文件夾管理 |
| `meeting-intelligence/` | 2 | AI會議分析 |
| `meeting-prep/` | 3 | 會議準備包 |
| `mock/` | 1 | Dynamics 365 模擬 |
| `monitoring/` | 1 | 監控初始化 |
| `notifications/` | 4 | 通知系統 |
| `proposals/` | 6 | 提案管理 |
| `proposal-templates/` | 4 | 提案模板 |
| `recommendations/` | 3 | 個性化推薦 |
| `reminders/` | 3 | 提醒管理 |
| `search/` | 1 | CRM搜索 |

**API 設計規範**: 所有端點遵循 RESTful 設計，統一響應格式，完整錯誤處理。

---

## 6. 配置文件索引

### ⚙️ 核心配置文件

| 文件 | 用途 | 位置 |
|------|------|------|
| `package.json` | NPM 依賴和腳本 | 根目錄 |
| `next.config.js` | Next.js 配置 | 根目錄 |
| `tsconfig.json` | TypeScript 配置 | 根目錄 |
| `tailwind.config.js` | Tailwind CSS 主題 | 根目錄 |
| `postcss.config.js` | PostCSS 配置 | 根目錄 |
| `.eslintrc.json` | ESLint 規則 | 根目錄 |
| `.gitignore` | Git 忽略規則 | 根目錄 |

### 🗄️ 數據庫配置

| 文件 | 用途 | 位置 |
|------|------|------|
| `prisma/schema.prisma` | Prisma Schema（34模型）| `01-base/prisma/` |
| `prisma/schema.postgresql.prisma` | PostgreSQL Schema | `01-base/prisma/` |
| `prisma/schema.mysql.prisma` | MySQL Schema | `01-base/prisma/` |
| `prisma/schema.mongodb.prisma` | MongoDB Schema | `01-base/prisma/` |
| `prisma/schema.sqlite.prisma` | SQLite Schema | `01-base/prisma/` |
| `prisma/seed.ts` | 種子數據腳本 | `01-base/prisma/` |

### 🧪 測試配置

| 文件 | 用途 | 位置 |
|------|------|------|
| `jest.config.js` | Jest 配置 | 根目錄 |
| `jest.setup.js` | Jest 設置 | 根目錄 |
| `playwright.config.ts` | Playwright 配置 | 根目錄 |

### 🐳 Docker 配置

| 文件 | 用途 | 位置 |
|------|------|------|
| `Dockerfile.dev` | 開發環境 Dockerfile | 根目錄 |
| `Dockerfile.prod` | 生產環境 Dockerfile | 根目錄 |
| `docker-compose.dev.yml` | 開發環境 Compose | 根目錄 |
| `docker-compose.prod.yml` | 生產環境 Compose | 根目錄 |
| `docker-compose.monitoring.yml` | 監控堆疊 Compose | 根目錄 |

### 🌍 環境變量

| 文件 | 用途 | 位置 |
|------|------|------|
| `.env.example` | 環境變量範例 | `01-base/` |
| `.env.template` | CLI生成的環境變量模板 | 項目根目錄（生成後）|
| `.env.local` | 本地環境變量 | 項目根目錄（gitignore）|
| `.env.test` | 測試環境變量 | `01-base/` |
| `.env.production.example` | 生產環境範例 | `01-base/` |
| `.env.monitoring.example` | 監控配置範例 | `01-base/` |
| `.env.security.example` | 安全配置範例 | `01-base/` |

---

## 7. 腳本和工具索引

### 🛠️ CLI 工具

| 腳本 | 用途 | 位置 |
|------|------|------|
| `init-project.js` | 項目初始化 CLI ⭐⭐⭐ | 根目錄 |

**功能**:
- 互動式項目配置
- 數據庫選擇和配置
- 模組選擇和安裝
- 環境變量生成
- 依賴自動安裝
- 數據庫自動初始化

### 📦 NPM 腳本

```json
{
  "scripts": {
    // 開發
    "dev": "next dev",
    "build": "next build",
    "start": "next start",

    // 代碼質量
    "lint": "next lint",
    "test": "jest",
    "test:e2e": "playwright test",
    "test:watch": "jest --watch",

    // 數據庫
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "db:seed": "ts-node prisma/seed.ts",
    "db:push": "prisma db push",

    // 監控
    "monitoring:start": "docker-compose -f docker-compose.monitoring.yml up -d",
    "monitoring:stop": "docker-compose -f docker-compose.monitoring.yml down",
    "monitoring:logs": "docker-compose -f docker-compose.monitoring.yml logs -f",

    // 工具
    "health-check": "node scripts/health-check.js",
    "check-index": "node scripts/check-index.js"
  }
}
```

### 🔧 工具腳本（scripts/）

| 腳本 | 用途 |
|------|------|
| `deploy.sh` | 部署腳本 |
| `backup.sh` | 備份腳本 |
| `health-check.js` | 健康檢查 |
| `check-index.js` | 索引驗證 |

---

## 8. 數據模型索引

### 🗄️ Prisma Schema（34個模型）

#### 核心系統（6個模型）
- `User` - 用戶
- `Session` - 會話
- `Role` - 角色
- `Permission` - 權限
- `RolePermission` - 角色權限關聯
- `UserRole` - 用戶角色關聯

#### 知識庫系統（9個模型）
- `KnowledgeFolder` - 文件夾
- `KnowledgeBase` - 知識文檔
- `KnowledgeChunk` - 向量嵌入（pgvector）
- `KnowledgeTag` - 標籤
- `ProcessingTask` - 處理任務
- `KnowledgeVersion` - 版本
- `KnowledgeVersionComment` - 版本註解
- `Document` - 文檔元數據
- `AIAnalysis` - AI分析

#### 提案系統（5個模型）
- `Proposal` - 提案
- `ProposalVersion` - 提案版本
- `ProposalTemplate` - 提案模板
- `ProposalTemplateUsage` - 模板使用
- `ProposalWorkflow` - 提案工作流

#### 範本系統（2個模型）
- `Template` - 範本
- `TemplateCategory` - 範本類別

#### 工作流系統（2個模型）
- `Workflow` - 工作流
- `WorkflowState` - 工作流狀態

#### 通知系統（2個模型）
- `Notification` - 通知
- `NotificationPreference` - 通知偏好

#### 提醒系統（1個模型）
- `Reminder` - 提醒

#### 分析系統（2個模型）
- `UserBehavior` - 用戶行為
- `SearchQuery` - 搜索查詢

#### 會議系統（2個模型）
- `Meeting` - 會議
- `MeetingPrepPackage` - 會議準備包

#### 其他系統（3個模型）
- `Customer` - 客戶
- `CalendarEvent` - 日曆事件
- `EditLock` - 編輯鎖

---

## 9. 依賴包索引

### 📦 核心依賴（114個包）

#### 框架和核心
- `next` (14.x) - Next.js 框架
- `react` (18.x) - React 庫
- `typescript` (5.x) - TypeScript

#### 數據庫和 ORM
- `@prisma/client` - Prisma ORM 客戶端
- `prisma` - Prisma CLI
- `mongodb` - MongoDB 驅動
- `mysql2` - MySQL 驅動

#### UI 組件庫
- `@radix-ui/*` (20個包) - 無障礙UI組件
- `lucide-react` - 圖標庫
- `tailwindcss` - CSS 框架
- `framer-motion` - 動畫庫

#### 富文本編輯器
- `@tiptap/react` - TipTap 核心
- `@tiptap/starter-kit` - 基礎擴展
- `@tiptap/extension-*` (8個包) - 功能擴展

#### API 和數據獲取
- `@trpc/client` - tRPC 客戶端
- `@trpc/server` - tRPC 服務端
- `@tanstack/react-query` - React Query
- `axios` - HTTP 客戶端

#### 認證和安全
- `next-auth` - NextAuth.js
- `jsonwebtoken` - JWT
- `bcrypt` - 密碼加密
- `@azure/msal-node` - Azure AD

#### 監控和日誌
- `@opentelemetry/*` (10個包) - OpenTelemetry
- `winston` - 日誌庫
- `prom-client` - Prometheus 客戶端

#### AI 和搜索
- `@azure/openai` - Azure OpenAI
- `openai` - OpenAI SDK
- `pgvector` - PostgreSQL 向量搜索

#### 工具庫
- `zod` - Schema 驗證
- `date-fns` - 日期處理
- `lodash` - 工具函數
- `class-variance-authority` - CSS 變體

**完整依賴列表**: 查看 `package.json`

---

## 10. 快速查找索引

### 🔍 按功能查找

#### 我想找...認證相關
- **模組**: `02-modules/module-auth/`
- **API**: `/api/auth/*`
- **組件**: 無（使用標準登錄頁面）
- **文檔**: [TEMPLATE-CREATION-FINAL-v5-COMPLETE.md](Docs/TEMPLATE-CREATION-FINAL-v5-COMPLETE.md#21)

#### 我想找...知識庫相關
- **模組**: `02-modules/module-knowledge-base/`
- **API**: `/api/knowledge-base/*`, `/api/knowledge-folders/*`
- **組件**: `components/knowledge/*` (35個組件)
- **數據模型**: 9個（KnowledgeFolder, KnowledgeBase等）

#### 我想找...搜索相關
- **模組**: `02-modules/module-search/`
- **API**: `/api/knowledge-base/search`, `/api/search/*`
- **組件**: `components/search/*` (8個組件)
- **庫**: `lib/search/`

#### 我想找...AI相關
- **模組**: `02-modules/module-ai-integration/`
- **API**: `/api/ai/*`
- **庫**: `lib/ai/` (8個文件)
- **依賴**: `@azure/openai`, `openai`

#### 我想找...工作流相關
- **模組**: `02-modules/module-workflow/`
- **API**: `/api/proposals/*/workflow`
- **組件**: `components/workflow/*` (12個組件)
- **數據模型**: Workflow, WorkflowState

#### 我想找...通知相關
- **模組**: `02-modules/module-notification/`
- **API**: `/api/notifications/*`
- **組件**: `components/notifications/*` (3個組件)
- **數據模型**: Notification, NotificationPreference

---

## 11. 維護和更新索引

### 📅 文檔維護計劃

| 文檔 | 更新頻率 | 負責人 |
|------|---------|--------|
| AI-ASSISTANT-GUIDE.md | 每次重大更新 | 維護者 |
| PROJECT-INDEX.md | 每次結構變更 | 維護者 |
| CLAUDE.md | 每次開發流程變更 | 維護者 |
| 模組 README.md | 模組變更時 | 模組開發者 |

### 🔄 版本控制

**當前版本**: 5.0
**下一版本**: 待定

**版本歷史**:
- v5.0 (2025-10-09) - 完整版本（23模組，164K行）
- v4.0 (2025-XX-XX) - 擴展版本（17模組，159K行）
- v3.0 (2025-XX-XX) - 基礎版本
- v2.0 (2025-XX-XX) - 早期版本
- v1.0 (2025-XX-XX) - 初始版本

---

## 📞 支持和反饋

### 獲取幫助

1. **查看文檔**: 首先查看本索引和 [AI-ASSISTANT-GUIDE.md](AI-ASSISTANT-GUIDE.md)
2. **搜索問題**: GitHub Issues 搜索類似問題
3. **提問討論**: GitHub Discussions 發起討論
4. **報告 Bug**: GitHub Issues 創建新 Issue

### 貢獻指南

查看項目根目錄的 `CONTRIBUTING.md`（如有）或遵循標準 Git 工作流。

---

**最後更新**: 2025-10-09
**索引版本**: 1.0
**狀態**: 🟢 當前有效

**返回**: [AI-ASSISTANT-GUIDE.md](AI-ASSISTANT-GUIDE.md) | [CLAUDE.md](CLAUDE.md) | [README.md](README.md)

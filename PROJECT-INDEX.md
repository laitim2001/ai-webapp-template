# 📑 項目完整索引 - AI Web App Template

**版本**: 5.0-alpha
**狀態**: 部分功能實現 (~45%完成)
**最後更新**: 2025-10-09

## ⚠️ 重要說明

本索引基於當前模板實現 (~45%) 和完整源項目分析 (100%)。

**當前模板包含**:
- 14個已提取模組 (48%完成)
- 23個基礎UI組件 (20%完成)
- 5個Prisma基礎模型 (15%完成)

**待補充內容**:
- 13個遺漏模組 (Security, Performance等)
- 29個業務模型
- 91個進階UI組件

**完整源項目規模**: 159,215行, 476文件, 27模組, 34模型, 114組件

**詳細分析**: 參考 `Docs/TEMPLATE-GAP-ANALYSIS-REPORT.md`

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
| **數據模型** | [8. 數據模型索引](#8-數據模型索引) |
| **分析報告** | [12. 分析報告索引](#12-分析報告索引) |

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
│   ├── components/                        # React 組件（部分提取）
│   ├── lib/                               # 核心工具庫（部分提取）
│   ├── types/                             # TypeScript 類型
│   ├── hooks/                             # 自定義 Hooks
│   ├── prisma/                            # 數據庫 Schema（部分）
│   └── public/                            # 靜態資源
│
├── 📂 02-modules/                         # 功能模組庫 ⭐⭐⭐
│   ├── module-auth/                       # ✅ P0: 認證授權
│   ├── module-api-gateway/                # ✅ P0: API Gateway
│   ├── module-knowledge-base/             # ✅ P1: 知識庫系統
│   ├── module-ai-integration/             # ✅ P1: AI 整合
│   ├── module-search/                     # ✅ P1: 搜索引擎
│   ├── module-workflow/                   # ✅ P1: 工作流引擎
│   ├── module-notification/               # ✅ P1: 通知系統
│   ├── module-cache/                      # ✅ P1: 緩存系統
│   ├── module-template/                   # ✅ P2: 範本管理
│   ├── module-pdf/                        # ✅ P2: PDF 生成
│   ├── module-parsers/                    # ✅ P2: 文件解析
│   ├── module-dynamics365/                # ✅ P2: Dynamics 365
│   ├── module-customer360/                # ✅ P2: 客戶360
│   └── [14個已提取模組 + 13個待補充]
│
├── 📂 00-monitoring/                      # 監控基礎設施 ⭐⭐⭐ ✅ 100%
│   ├── instrumentation.ts.template        # OpenTelemetry 初始化
│   ├── lib/monitoring/                    # 監控工具（7個文件）
│   ├── monitoring/                        # 配置文件（10個）
│   └── [Prometheus/Grafana/Azure Monitor配置]
│
├── 📂 Docs/                               # 技術文檔 ⭐⭐
│   ├── TEMPLATE-GAP-ANALYSIS-REPORT.md    # ⭐⭐⭐ 完整差距分析
│   ├── SOURCE-PROJECT-VERIFICATION.md     # ⭐⭐⭐ 100% 驗證報告
│   ├── SOURCE-PROJECT-SNAPSHOT.md         # 源項目完整快照
│   ├── TEMPLATE-VS-SOURCE-COMPARISON.md   # 模板vs源項目對比
│   ├── TEMPLATE-CREATION-FINAL-v5-COMPLETE.md  # 完整實施計劃
│   └── [其他技術文檔]
│
├── 📂 examples/                           # 示例數據 ⭐
│   ├── seed-data/                         # 種子數據
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
| [AI-ASSISTANT-GUIDE.md](AI-ASSISTANT-GUIDE.md) | ~900行 | AI助手統一入口，快速了解項目 | ⭐⭐⭐ |
| [PROJECT-INDEX.md](PROJECT-INDEX.md) | 本文件 | 完整項目索引和導航 | ⭐⭐⭐ |
| [CLAUDE.md](CLAUDE.md) | ~400行 | Claude Code 開發指導 | ⭐⭐⭐ |
| [README.md](README.md) | ~200行 | 項目介紹和快速開始 | ⭐⭐⭐ |

### 📖 技術文檔（詳細參考）

| 文檔 | 大小 | 內容 | 用途 |
|------|------|------|------|
| [TEMPLATE-GAP-ANALYSIS-REPORT.md](Docs/TEMPLATE-GAP-ANALYSIS-REPORT.md) | ~40KB | 完整差距分析報告 | ⭐⭐⭐ 必讀 |
| [SOURCE-PROJECT-VERIFICATION.md](Docs/SOURCE-PROJECT-VERIFICATION.md) | ~23KB | 100% 驗證報告 | ⭐⭐⭐ 必讀 |
| [SOURCE-PROJECT-SNAPSHOT.md](Docs/SOURCE-PROJECT-SNAPSHOT.md) | ~42KB | 源項目完整快照 | 項目結構參考 |
| [TEMPLATE-VS-SOURCE-COMPARISON.md](Docs/TEMPLATE-VS-SOURCE-COMPARISON.md) | ~30KB | 模板與源項目對比 | 差異分析 |
| [TEMPLATE-CREATION-FINAL-v5-COMPLETE.md](Docs/TEMPLATE-CREATION-FINAL-v5-COMPLETE.md) | 3,266行 | v5.0 完整實施計劃 | 完整技術規範 |

### 📝 模組文檔（隨模組提供）

每個模組在 `02-modules/module-{name}/` 目錄下都包含：
- `README.md` - 模組說明和使用指南
- `install.sh` - 安裝腳本
- 使用範例代碼

---

## 3. 功能模組索引

### 已提取模組（14個，~48%）

| # | 模組名稱 | 路徑 | 文件數 | 代碼量 | 狀態 | 優先級 |
|---|---------|------|--------|--------|------|--------|
| 1 | 監控系統 | 00-monitoring/ | 7+10 | 2,776行 | ✅ 完成 | P0 |
| 2 | 認證授權 | 02-modules/module-auth/ | 17 | 4,252行 | ✅ 完成 | P0 |
| 3 | API Gateway | 02-modules/module-api-gateway/ | 14 | 4,593行 | ✅ 完成 | P0 |
| 4 | 知識庫系統 | 02-modules/module-knowledge-base/ | 40+ | 8,000+行 | ✅ 完成 | P1 |
| 5 | AI 整合 | 02-modules/module-ai-integration/ | 8 | 3,000+行 | ✅ 完成 | P1 |
| 6 | 搜索引擎 | 02-modules/module-search/ | 12 | 2,800+行 | ✅ 完成 | P1 |
| 7 | 工作流引擎 | 02-modules/module-workflow/ | 10 | 2,035行 | ✅ 完成 | P1 |
| 8 | 通知系統 | 02-modules/module-notification/ | 8 | 1,550行 | ✅ 完成 | P1 |
| 9 | 緩存系統 | 02-modules/module-cache/ | 6 | 1,500+行 | ✅ 完成 | P1 |
| 10 | 範本管理 | 02-modules/module-template/ | 6 | 1,150行 | ✅ 完成 | P2 |
| 11 | PDF 生成 | 02-modules/module-pdf/ | 3 | 640行 | ✅ 完成 | P2 |
| 12 | 文件解析 | 02-modules/module-parsers/ | 6 | 1,280行 | ✅ 完成 | P2 |
| 13 | Dynamics 365 | 02-modules/module-dynamics365/ | 6 | 1,200+行 | ✅ 完成 | P2 |
| 14 | Customer 360 | 02-modules/module-customer360/ | 4 | 800+行 | ✅ 完成 | P2 |

### 待補充模組（13個，~52%）

| # | 模組名稱 | 源路徑 | 文件數 | 代碼量 | 狀態 | 優先級 |
|---|---------|--------|--------|--------|------|--------|
| 15 | **Security & RBAC** | lib/security/ | 14 | 1,800+行 | ❌ 遺漏 | P0 🔴 |
| 16 | **API 工具層** | lib/api/ | 2 | ~200行 | ❌ 遺漏 | P0 🔴 |
| 17 | **數據庫工具** | lib/db/ | 多個 | ~300行 | ❌ 遺漏 | P0 🔴 |
| 18 | **根目錄核心** | lib/*.ts | 7 | 1,375行 | ❌ 遺漏 | P0 🔴 |
| 19 | **Performance** | lib/performance/ | 6+測試 | 600+行 | ❌ 遺漏 | P1 🟡 |
| 20 | **Resilience** | lib/resilience/ | 6+測試 | 600+行 | ❌ 遺漏 | P1 🟡 |
| 21 | **Analytics** | lib/analytics/ | 2 | 482行 | ❌ 遺漏 | P2 🟢 |
| 22 | **Calendar** | lib/calendar/ | 3 | 1,388行 | ❌ 遺漏 | P2 🟢 |
| 23 | **Collaboration** | lib/collaboration/ | 2 | 487行 | ❌ 遺漏 | P2 🟢 |
| 24 | **Meeting** | lib/meeting/ | 3 | 1,214行 | ❌ 遺漏 | P2 🟢 |
| 25 | **Recommendation** | lib/recommendation/ | 2 | 631行 | ❌ 遺漏 | P2 🟢 |
| 26 | **Reminder** | lib/reminder/ | 3 | 674行 | ❌ 遺漏 | P2 🟢 |
| 27 | **Email** | lib/email/ | - | -行 | ❌ 遺漏 | P2 🟢 |

**重要說明**:
- `lib/*.ts` 包含關鍵的 `errors.ts` (653行) - 整個應用的錯誤處理標準
- Security & RBAC 是企業級應用必需的安全基礎設施
- API Gateway 實際有12個中間件（非10個）

---

## 4. 組件索引

### 已提取基礎組件（23個，~20%）

**路徑**: `01-base/components/ui/`

| 組件文件 | 用途 | 基於 | 狀態 |
|----------|------|------|------|
| `alert.tsx` | 警告提示 | Radix UI | ✅ |
| `alert-dialog.tsx` | 對話框 | Radix UI | ✅ |
| `avatar.tsx` | 頭像 | Radix UI | ✅ |
| `badge.tsx` | 徽章 | Radix UI | ✅ |
| `button.tsx` | 按鈕 | Radix UI | ✅ |
| `card.tsx` | 卡片 | Radix UI | ✅ |
| `checkbox.tsx` | 複選框 | Radix UI | ✅ |
| `command.tsx` | 命令面板 | Radix UI | ✅ |
| `dialog.tsx` | 對話框 | Radix UI | ✅ |
| `dropdown-menu.tsx` | 下拉菜單 | Radix UI | ✅ |
| `error-display.tsx` | 錯誤展示 | 自定義 | ✅ |
| `input.tsx` | 輸入框 | Radix UI | ✅ |
| `label.tsx` | 標籤 | Radix UI | ✅ |
| `popover.tsx` | 彈出框 | Radix UI | ✅ |
| `progress.tsx` | 進度條 | Radix UI | ✅ |
| `select.tsx` | 選擇器 | Radix UI | ✅ |
| `separator.tsx` | 分隔線 | Radix UI | ✅ |
| `sheet.tsx` | 側邊欄 | Radix UI | ✅ |
| `skeleton.tsx` | 骨架屏 | Radix UI | ✅ |
| `slider.tsx` | 滑塊 | Radix UI | ✅ |
| `switch.tsx` | 開關 | Radix UI | ✅ |
| `tabs.tsx` | 標籤頁 | Radix UI | ✅ |
| `textarea.tsx` | 文本域 | Radix UI | ✅ |

### 待補充進階組件（91個，~80%）

**源項目組件統計** (114個組件，19個目錄):

| # | 目錄 | 組件數 | 功能 | 重要性 | 狀態 |
|---|------|-------|------|--------|------|
| 1 | **ui/** | 23 | 基礎UI組件 | P0 🔴 | ✅ 已提取 |
| 2 | **admin/** | 2 | 管理後台 (性能儀表板、系統監控) | P1 🟡 | ❌ 遺漏 |
| 3 | **assistant/** | 3 | AI助手UI (ChatInput, ChatMessage, ChatWindow) | P1 🟡 | ❌ 遺漏 |
| 4 | **audit/** | 4 | 審計日誌 (Export, Filters, List, Stats) | P0 🔴 | ❌ 遺漏 |
| 5 | **calendar/** | 1 | 日曆視圖 | P2 🟢 | ❌ 遺漏 |
| 6 | **collaboration/** | 1 | 編輯鎖定指示器 | P2 🟢 | ❌ 遺漏 |
| 7 | **crm/** | 1 | 客戶360視圖 | P2 🟢 | ❌ 遺漏 |
| 8 | **dashboard/** | 6 | 儀表板佈局 | P1 🟡 | ❌ 遺漏 |
| 9 | **features/** | 多個 | 功能特定元件 | P2 🟢 | ❌ 遺漏 |
| 10 | **knowledge/** | 35 | 知識庫完整UI | P1 🟡 | ❌ 遺漏 |
| 11 | **layout/** | 多個 | 佈局元件 | P1 🟡 | ❌ 遺漏 |
| 12 | **meeting-prep/** | 5+ | 會議準備UI | P2 🟢 | ❌ 遺漏 |
| 13 | **notifications/** | 3+ | 通知中心 | P1 🟡 | ❌ 遺漏 |
| 14 | **permissions/** | 多個 | 權限管理UI | P0 🔴 | ❌ 遺漏 |
| 15 | **recommendation/** | 多個 | 推薦顯示 | P2 🟢 | ❌ 遺漏 |
| 16 | **reminder/** | 多個 | 提醒UI | P2 🟢 | ❌ 遺漏 |
| 17 | **search/** | 6 | 搜索界面 | P1 🟡 | ❌ 遺漏 |
| 18 | **workflow/** | 多個 | 工作流程視覺化 | P1 🟡 | ❌ 遺漏 |

**詳細清單**: 參考 `Docs/SOURCE-PROJECT-SNAPSHOT.md`

---

## 5. API路由索引

### 已實現API（基礎認證）

**Authentication API** (7個端點) - ✅ 已實現:
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

### 待補充API域（22個域，~75個端點）

**源項目完整API** (82個route.ts文件，分布於23個API域):

| # | API域 | 端點數 | 主要功能 | 狀態 |
|---|-------|--------|---------|------|
| 1 | `auth/` | 7 | 認證授權 | ✅ 已實現 |
| 2 | `knowledge-base/` | 17 | 文檔CRUD、版本管理、高級搜索 | ❌ 待補充 |
| 3 | `templates/` | 8 | 模板管理、預覽、導出PDF | ❌ 待補充 |
| 4 | `proposals/` | 6 | 提案管理、版本控制 | ❌ 待補充 |
| 5 | `ai/` | 2 | AI生成提案 | ❌ 待補充 |
| 6 | `analytics/` | 3 | 用戶行為追蹤 | ❌ 待補充 |
| 7 | `assistant/` | 1 | AI助手聊天 | ❌ 待補充 |
| 8 | `audit-logs/` | 3 | 審計日誌、導出 | ❌ 待補充 |
| 9 | `calendar/` | 3 | Microsoft Graph 同步 | ❌ 待補充 |
| 10 | `collaboration/` | 3 | 編輯鎖定管理 | ❌ 待補充 |
| 11 | `customers/` | 2 | 客戶管理、360視圖 | ❌ 待補充 |
| 12 | `health/` | 1 | 健康檢查 | ❌ 待補充 |
| 13 | `knowledge-folders/` | 4 | 文件夾管理 | ❌ 待補充 |
| 14 | `meeting-intelligence/` | 2 | AI會議分析 | ❌ 待補充 |
| 15 | `meeting-prep/` | 3 | 會議準備包 | ❌ 待補充 |
| 16 | `monitoring/` | 1 | 監控初始化 | ❌ 待補充 |
| 17 | `notifications/` | 4 | 通知系統 | ❌ 待補充 |
| 18 | `proposal-templates/` | 4 | 提案模板 | ❌ 待補充 |
| 19 | `recommendations/` | 3 | 個性化推薦 | ❌ 待補充 |
| 20 | `reminders/` | 3 | 提醒管理 | ❌ 待補充 |
| 21 | `search/` | 1 | CRM搜索 | ❌ 待補充 |
| 22 | `mock/` | 1 | Dynamics 365 模擬 | ❌ 待補充 |

**API 設計規範**: 所有端點遵循 RESTful 設計，統一響應格式，完整錯誤處理。

**詳細API清單**: 參考 `Docs/SOURCE-PROJECT-SNAPSHOT.md`

---

## 6. 配置文件索引

### ⚙️ 核心配置文件

| 文件 | 用途 | 位置 | 狀態 |
|------|------|------|------|
| `package.json` | NPM 依賴和腳本 | 根目錄 | ✅ |
| `next.config.js` | Next.js 配置 | 根目錄 | ✅ |
| `tsconfig.json` | TypeScript 配置 | 根目錄 | ✅ |
| `tailwind.config.js` | Tailwind CSS 主題 | 根目錄 | ✅ |
| `postcss.config.js` | PostCSS 配置 | 根目錄 | ✅ |
| `.eslintrc.json` | ESLint 規則 | 根目錄 | ✅ |
| `.gitignore` | Git 忽略規則 | 根目錄 | ✅ |

### 🗄️ 數據庫配置

| 文件 | 用途 | 位置 | 狀態 |
|------|------|------|------|
| `prisma/schema.prisma` | Prisma Schema（部分） | `01-base/prisma/` | ⚠️ 部分 |
| `prisma/schema.postgresql.prisma` | PostgreSQL Schema | `01-base/prisma/` | ⚠️ 部分 |
| `prisma/schema.mysql.prisma` | MySQL Schema | `01-base/prisma/` | ⚠️ 部分 |
| `prisma/schema.mongodb.prisma` | MongoDB Schema | `01-base/prisma/` | ⚠️ 部分 |
| `prisma/schema.sqlite.prisma` | SQLite Schema | `01-base/prisma/` | ⚠️ 部分 |
| `prisma/seed.ts` | 種子數據腳本 | `01-base/prisma/` | ✅ |

**注意**: Prisma Schema僅包含5個基礎模型，待補充29個業務模型

---

## 7. 腳本和工具索引

### 🛠️ CLI 工具

| 腳本 | 用途 | 位置 | 狀態 |
|------|------|------|------|
| `init-project.js` | 項目初始化 CLI ⭐⭐⭐ | 根目錄 | ✅ 完成 |

**功能**:
- 互動式項目配置
- 數據庫選擇和配置
- 模組選擇和安裝（14個已提取模組）
- 環境變量生成
- 依賴自動安裝
- 數據庫自動初始化

---

## 8. 數據模型索引

### 已包含基礎模型（5個，~15%）

| 模型名稱 | 用途 | 關聯 | 狀態 |
|---------|------|------|------|
| User | 用戶管理 | - | ✅ |
| RefreshToken | JWT令牌 | User | ✅ |
| TokenBlacklist | 令牌黑名單 | - | ✅ |

### 待補充業務模型（29個，~85%）

**源項目完整模型** (34個):

**客戶CRM (5個)** - ❌ 遺漏:
- Customer, CustomerContact, SalesOpportunity, CallRecord, Interaction

**知識庫系統 (9個)** - ❌ 遺漏:
- KnowledgeFolder, KnowledgeBase, KnowledgeChunk, KnowledgeTag
- ProcessingTask, KnowledgeVersion, KnowledgeVersionComment
- Document, AIAnalysis

**提案管理 (6個)** - ❌ 遺漏:
- Proposal, ProposalItem, ProposalTemplate
- ProposalGeneration, ProposalVersion, ProposalComment

**工作流引擎 (3個)** - ❌ 遺漏:
- ProposalWorkflow, WorkflowStateHistory, ApprovalTask

**通知系統 (4個)** - ❌ 遺漏:
- Notification, NotificationPreference
- NotificationTemplate, NotificationBatch

**認證與安全 (3個)** - ⚠️ 部分記錄:
- RefreshToken (✅ 已記錄)
- TokenBlacklist (✅ 已記錄)
- ApiKey (❌ 遺漏)

**配置與系統 (3個)** - ❌ 遺漏:
- SystemConfig, AuditLog, AIGenerationConfig

**其他業務模型** (1個) - ❌ 遺漏:
- User (✅ 已記錄，但可能缺少欄位)

**詳細Schema**: 參考 `Docs/SOURCE-PROJECT-SNAPSHOT.md`

---

## 9. 依賴包索引

### 📦 核心依賴

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

#### 認證和安全
- `next-auth` - NextAuth.js
- `jsonwebtoken` - JWT
- `bcrypt` - 密碼加密
- `@azure/msal-node` - Azure AD

#### 監控和日誌
- `@opentelemetry/*` (10個包) - OpenTelemetry
- `winston` - 日誌庫
- `prom-client` - Prometheus 客戶端

**完整依賴列表**: 查看 `package.json`

**待補充依賴** (~70個):
- TipTap富文本編輯器 (10個包)
- tRPC類型安全API (4個包)
- React Query
- 遺漏的Radix UI組件 (15個包)
- Microsoft Graph
- Azure服務包

---

## 10. 快速查找索引

### 🔍 按功能查找

#### 我想找...認證相關
- **模組**: `02-modules/module-auth/` ✅
- **API**: `/api/auth/*` ✅
- **組件**: 使用標準登錄頁面
- **文檔**: [TEMPLATE-CREATION-FINAL-v5-COMPLETE.md](Docs/TEMPLATE-CREATION-FINAL-v5-COMPLETE.md#21)

#### 我想找...知識庫相關
- **模組**: `02-modules/module-knowledge-base/` ✅
- **API**: `/api/knowledge-base/*` ❌ 待補充
- **組件**: `components/knowledge/*` ❌ 待補充 (35個組件)
- **數據模型**: ❌ 待補充 (9個模型)

#### 我想找...搜索相關
- **模組**: `02-modules/module-search/` ✅
- **API**: `/api/knowledge-base/search` ❌ 待補充
- **組件**: `components/search/*` ❌ 待補充 (6個組件)
- **庫**: `lib/search/` ✅ (部分)

#### 我想找...AI相關
- **模組**: `02-modules/module-ai-integration/` ✅
- **API**: `/api/ai/*` ❌ 待補充
- **庫**: `lib/ai/` ✅ (部分)
- **依賴**: `@azure/openai`, `openai` ✅

#### 我想找...工作流相關
- **模組**: `02-modules/module-workflow/` ✅
- **API**: `/api/proposals/*/workflow` ❌ 待補充
- **組件**: `components/workflow/*` ❌ 待補充 (12個組件)
- **數據模型**: ❌ 待補充 (Workflow, WorkflowState)

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

**當前版本**: 5.0-alpha (部分實現 ~45%)
**下一版本**: 5.1-beta (計劃完成度 ~70%)

**版本歷史**:
- v5.0-alpha (2025-10-09) - 部分功能（14模組，~45%完成）
- v4.0 (2025-XX-XX) - 擴展版本
- v3.0 (2025-XX-XX) - 基礎版本

---

## 12. 分析報告索引

### 源項目完整分析

| 文檔 | 大小 | 用途 | 優先級 |
|------|------|------|--------|
| SOURCE-PROJECT-SNAPSHOT.md | ~42KB | 源項目完整結構分析 | ⭐⭐⭐ |
| SOURCE-PROJECT-VERIFICATION.md | ~23KB | 100%驗證報告 | ⭐⭐⭐ |
| TEMPLATE-VS-SOURCE-COMPARISON.md | ~30KB | 模板vs源項目對比 | ⭐⭐⭐ |
| TEMPLATE-GAP-ANALYSIS-REPORT.md | ~40KB | 完整差距分析報告 | ⭐⭐⭐ |
| SCAN-COMPLETENESS-REPORT.md | ~8KB | 掃描完整性報告 | ⭐⭐ |

### 實施記錄

| 文檔 | 用途 |
|------|------|
| template-implementation-log.md | 實施進度記錄 |
| CHANGELOG.md | 版本變更記錄 |

---

## 📞 支持和反饋

### 獲取幫助

1. **查看文檔**: 首先查看本索引和 [AI-ASSISTANT-GUIDE.md](AI-ASSISTANT-GUIDE.md)
2. **閱讀差距分析**: 查看 [TEMPLATE-GAP-ANALYSIS-REPORT.md](Docs/TEMPLATE-GAP-ANALYSIS-REPORT.md)
3. **搜索問題**: GitHub Issues 搜索類似問題
4. **提問討論**: GitHub Discussions 發起討論
5. **報告 Bug**: GitHub Issues 創建新 Issue

### 貢獻指南

查看項目根目錄的 `CONTRIBUTING.md`（如有）或遵循標準 Git 工作流。

---

**最後更新**: 2025-10-09
**索引版本**: 2.0
**狀態**: ⚠️ 反映當前實現狀況 (~45%完成)

**返回**: [AI-ASSISTANT-GUIDE.md](AI-ASSISTANT-GUIDE.md) | [CLAUDE.md](CLAUDE.md) | [README.md](README.md)

**重要提醒**:
本索引準確反映了當前模板的實現狀況（~45%完成）和完整源項目的規模（100%驗證）。在使用模板前，請務必閱讀 `Docs/TEMPLATE-GAP-ANALYSIS-REPORT.md` 了解詳細的差距分析和補充計劃。

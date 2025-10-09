# 🤖 AI 助手指南 - AI Web App Template

**版本**: 5.0-alpha
**最後更新**: 2025-10-09
**項目類型**: Next.js 14 全棧應用模板
**GitHub**: https://github.com/laitim2001/ai-webapp-template

---

## ⚠️ 重要說明

**版本狀態**: 5.0-alpha - 部分功能實現 (~45%完成)
**適用**: 學習和評估，生產使用需等待完整版

### 當前狀態

**已實現** (~45%):
- ✅ 完整多數據庫支持架構
- ✅ 企業級監控系統 (100%完成)
- ✅ 14個核心功能模組 (48%完成)
- ✅ 23個基礎UI組件 (20%完成)
- ✅ 智能CLI初始化工具

**待補充** (~55%):
- 🚧 Security & RBAC 模組 (P0關鍵)
- 🚧 Performance & Resilience 模組 (P1)
- 🚧 完整Prisma Schema (29個模型)
- 🚧 91個進階UI組件
- 🚧 13個業務功能模組

### 源項目規模參考

**完整源項目** (100%驗證):
- 總代碼: 159,215 行
- 總文件: 476 個生產文件
- 功能模組: 27 個
- Prisma模型: 34 個
- UI組件: 114 個
- API端點: 82 個

**詳細分析**: 請查看 `Docs/SOURCE-PROJECT-VERIFICATION.md` 和 `Docs/TEMPLATE-GAP-ANALYSIS-REPORT.md`

---

## 📋 快速導航

| 需求 | 查看文檔 | 用途 |
|------|---------|------|
| **快速了解項目** | 👉 本文件 | 5分鐘速覽項目全貌 |
| **完整項目索引** | [PROJECT-INDEX.md](PROJECT-INDEX.md) | 所有文件和功能詳細索引 |
| **開發指南** | [CLAUDE.md](CLAUDE.md) | Claude Code 開發指導 |
| **實施計劃** | [Docs/TEMPLATE-CREATION-FINAL-v5-COMPLETE.md](Docs/TEMPLATE-CREATION-FINAL-v5-COMPLETE.md) | 完整模板實施計劃 |
| **差距分析** | [Docs/TEMPLATE-GAP-ANALYSIS-REPORT.md](Docs/TEMPLATE-GAP-ANALYSIS-REPORT.md) | 完整差距分析報告 |
| **初始化模板** | `node init-project.js` | 創建新項目 |

---

## 🎯 項目概述

這是一個**部分實現的 Next.js 14 全棧應用模板**，提供：

### 核心特性
- ✅ **多數據庫支持** - PostgreSQL/MySQL/MongoDB/SQLite 無縫切換
- ⚠️ **14個功能模組** - 已提取48%，待補充13個模組
- ⚠️ **23個UI組件** - 基礎組件完成，待補充91個進階組件
- ⚠️ **5個API端點** - 基礎認證完成，待補充77個端點
- ✅ **企業級監控** - OpenTelemetry + Prometheus/Azure Monitor (100%完成)
- ✅ **完整認證系統** - JWT雙令牌 + Azure AD SSO
- ✅ **測試框架** - Jest + Playwright (120+ 測試)

### 項目規模

**當前模板已實現** (~45%):
```
📊 已實現功能
├── 功能模組: 14 個 (48%完成)
├── UI組件: 23 個基礎組件 (20%完成)
├── Prisma模型: 5 個基礎模型 (15%完成)
├── 監控系統: 完整實現 (100%完成)
└── 多數據庫: 完整實現 (100%完成)
```

**源項目完整規模** (100%驗證):
```
📊 源項目統計
├── 總代碼行數: 159,215 行
├── 生產文件: 476 個
├── 功能模組: 27 個
├── Prisma模型: 34 個
├── UI組件: 114 個
└── API端點: 82 個
```

**待補充內容** (~55%):
```
🚧 待補充功能
├── 遺漏模組: 13 個 (Security, Performance等)
├── 業務模型: 29 個
├── 進階組件: 91 個
└── 核心文件: 7 個 (errors.ts等)
```

---

## 🚀 快速開始

### 1. 初始化新項目

```bash
# 克隆模板
git clone https://github.com/laitim2001/ai-webapp-template.git my-project
cd my-project

# 運行初始化 CLI
node init-project.js
```

### 2. CLI 引導流程

初始化 CLI 會引導你完成：

1. **項目信息** - 名稱、描述、作者
2. **數據庫選擇** - PostgreSQL (推薦) / MySQL / MongoDB / SQLite
3. **模組選擇** - 從14個已提取模組中選擇需要的功能
4. **監控配置** - Prometheus / Azure Monitor / Both
5. **環境設置** - 自動生成 `.env.local`
6. **依賴安裝** - 自動 `npm install`
7. **數據庫初始化** - Prisma generate + migrate

### 3. 啟動開發服務器

```bash
npm run dev
# 打開 http://localhost:3000
```

---

## 🧩 項目架構（5層架構）

```
第零層: 監控與可觀測性基礎 (OpenTelemetry) ✅ 100%完成
    ↓
第一層: 技術棧基礎設施 (Next.js + Prisma + 多數據庫) ✅ 100%完成
    ↓
第二層: 功能模組庫 (14個已提取 + 13個待補充) ⚠️ 48%完成
    ↓
第三層: 開發工具鏈 (CLI + 測試 + 文檔) ✅ 完成
    ↓
第四層: 部署與運維 (Docker + CI/CD) ✅ 完成
```

---

## 📦 功能模組清單

### 已提取模組（14個，~48%）

#### P0 - 核心必選模組（3個）

| 模組 | 路徑 | 文件數 | 代碼量 | 狀態 |
|------|------|--------|--------|------|
| **00-監控系統** | `00-monitoring/` | 7+10 | 2,776行 | ✅ 完成 |
| **01-認證授權** | `02-modules/module-auth/` | 17 | 4,252行 | ✅ 完成 |
| **03-API Gateway** | `02-modules/module-api-gateway/` | 14 | 4,593行 | ✅ 完成 (實際12個中間件) |

#### P1 - 高優先級模組（7個）

| 模組 | 路徑 | 文件數 | 代碼量 | 狀態 |
|------|------|--------|--------|------|
| **知識庫系統** | `02-modules/module-knowledge-base/` | 40+ | 8,000+行 | ✅ 完成 |
| **AI 整合層** | `02-modules/module-ai-integration/` | 8 | 3,000+行 | ✅ 完成 |
| **搜索引擎** | `02-modules/module-search/` | 12 | 2,800+行 | ✅ 完成 |
| **工作流程引擎** | `02-modules/module-workflow/` | 10 | 2,035行 | ✅ 完成 |
| **通知系統** | `02-modules/module-notification/` | 8 | 1,550行 | ✅ 完成 |
| **緩存系統** | `02-modules/module-cache/` | 6 | 1,500+行 | ✅ 完成 |

#### P2 - 可選模組（4個）

| 模組 | 路徑 | 文件數 | 代碼量 | 狀態 |
|------|------|--------|--------|------|
| **範本管理** | `02-modules/module-template/` | 6 | 1,150行 | ✅ 完成 |
| **PDF 生成** | `02-modules/module-pdf/` | 3 | 640行 | ✅ 完成 |
| **文件解析** | `02-modules/module-parsers/` | 6 | 1,280行 | ✅ 完成 |
| **Dynamics 365** | `02-modules/module-dynamics365/` | 6 | 1,200+行 | ✅ 完成 |
| **Customer 360** | `02-modules/module-customer360/` | 4 | 800+行 | ✅ 完成 |

### 待補充模組（13個，~52%）

#### P0 關鍵模組（必須補充）

| # | 模組名稱 | 源路徑 | 文件數 | 代碼量 | 優先級 |
|---|---------|--------|--------|--------|--------|
| 15 | **Security & RBAC** | `lib/security/` | 14 | 1,800+行 | 🔴 P0 |
| 16 | **API 工具層** | `lib/api/` | 2 | ~200行 | 🔴 P0 |
| 17 | **數據庫工具** | `lib/db/` | 多個 | ~300行 | 🔴 P0 |
| 18 | **根目錄核心** | `lib/*.ts` | 7 | 1,375行 | 🔴 P0 |

**重要說明**:
- `lib/*.ts` 包含關鍵的 `errors.ts` (653行) - 整個應用的錯誤處理標準
- Security & RBAC 是企業級應用必需的安全基礎設施

#### P1 高優先級模組

| # | 模組名稱 | 源路徑 | 文件數 | 代碼量 | 優先級 |
|---|---------|--------|--------|--------|--------|
| 19 | **Performance** | `lib/performance/` | 6+測試 | 600+行 | 🟡 P1 |
| 20 | **Resilience** | `lib/resilience/` | 6+測試 | 600+行 | 🟡 P1 |

#### P2 業務功能模組

| # | 模組名稱 | 源路徑 | 文件數 | 代碼量 | 優先級 |
|---|---------|--------|--------|--------|--------|
| 21 | **Analytics** | `lib/analytics/` | 2 | 482行 | 🟢 P2 |
| 22 | **Calendar** | `lib/calendar/` | 3 | 1,388行 | 🟢 P2 |
| 23 | **Collaboration** | `lib/collaboration/` | 2 | 487行 | 🟢 P2 |
| 24 | **Meeting** | `lib/meeting/` | 3 | 1,214行 | 🟢 P2 |
| 25 | **Recommendation** | `lib/recommendation/` | 2 | 631行 | 🟢 P2 |
| 26 | **Reminder** | `lib/reminder/` | 3 | 674行 | 🟢 P2 |
| 27 | **Email** | `lib/email/` | - | -行 | 🟢 P2 |

**總遺漏代碼**: ~8,000+ 行

---

## 🎨 UI 組件系統

### 已提取基礎組件（23個，~20%）

```
components/ui/              # 23個基礎組件（Radix UI）✅
├── alert.tsx              # 警告提示
├── alert-dialog.tsx       # 對話框
├── avatar.tsx             # 頭像
├── badge.tsx              # 徽章
├── button.tsx             # 按鈕
├── card.tsx               # 卡片
├── checkbox.tsx           # 複選框
├── command.tsx            # 命令面板
├── dialog.tsx             # 對話框
├── dropdown-menu.tsx      # 下拉菜單
├── error-display.tsx      # 錯誤展示
├── input.tsx              # 輸入框
├── label.tsx              # 標籤
├── popover.tsx            # 彈出框
├── progress.tsx           # 進度條
├── select.tsx             # 選擇器
├── separator.tsx          # 分隔線
├── sheet.tsx              # 側邊欄
├── skeleton.tsx           # 骨架屏
├── slider.tsx             # 滑塊
├── switch.tsx             # 開關
├── tabs.tsx               # 標籤頁
└── textarea.tsx           # 文本域
```

**特性**:
- ✅ 完全無障礙（WCAG 2.1 AA級）
- ✅ 深色模式支持
- ✅ 響應式設計（6個斷點）
- ✅ TypeScript 類型安全
- ✅ 20+ 預定義動畫

### 待補充進階組件（91個，~80%）

**源項目組件統計** (114個組件，19個目錄):

| # | 目錄 | 組件數 | 功能 | 重要性 |
|---|------|-------|------|--------|
| 1 | **admin/** | 2 | 管理後台 (性能儀表板、系統監控) | P1 🟡 |
| 2 | **assistant/** | 3 | AI助手UI (ChatInput, ChatMessage, ChatWindow) | P1 🟡 |
| 3 | **audit/** | 4 | 審計日誌 (Export, Filters, List, Stats) | P0 🔴 |
| 4 | **calendar/** | 1 | 日曆視圖 | P2 🟢 |
| 5 | **collaboration/** | 1 | 編輯鎖定指示器 | P2 🟢 |
| 6 | **crm/** | 1 | 客戶360視圖 | P2 🟢 |
| 7 | **knowledge/** | 35 | 知識庫完整UI | P1 🟡 |
| 8 | **meeting-prep/** | 5+ | 會議準備UI | P2 🟢 |
| 9 | **notifications/** | 3+ | 通知中心 | P1 🟡 |
| 10 | **permissions/** | 多個 | 權限管理UI | P0 🔴 |
| 11 | **recommendation/** | 多個 | 推薦顯示 | P2 🟢 |
| 12 | **reminder/** | 多個 | 提醒UI | P2 🟢 |
| 13 | **search/** | 6 | 搜索界面 | P1 🟡 |

**詳細清單**: 參考 `Docs/SOURCE-PROJECT-SNAPSHOT.md`

---

## 🗄️ 數據庫架構

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

**其他業務模型 (2個)** - ❌ 遺漏:
- AuditLog, SystemConfig

**詳細Schema**: 參考 `Docs/SOURCE-PROJECT-SNAPSHOT.md`

### 多數據庫適配器

```typescript
// 統一接口，支援4種數據庫
import { databaseAdapter } from '@/lib/db/database-adapter';

const users = await databaseAdapter.findMany('users', {
  where: { active: true }
});
```

---

## 🚀 API 路由系統

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

**核心業務 API** - ❌ 待補充:

**Knowledge Base API** (17個端點):
- 文檔CRUD、版本管理、高級搜索、上傳下載

**Templates API** (8個端點):
- 模板管理、預覽、導出PDF

**Proposals API** (6個端點):
- 提案管理、版本控制

**其他 API 域** (54個端點):
- AI Services (2端點)
- Analytics (3端點)
- Audit Logs (3端點)
- Calendar (3端點)
- Collaboration (3端點)
- Meeting Intelligence (2端點)
- Notifications (4端點)
- Recommendations (3端點)
- Reminders (3端點)
- 等等...

**詳細API清單**: 參考 `Docs/SOURCE-PROJECT-SNAPSHOT.md`

---

## 🔧 開發工作流

### 常用命令

```bash
# 開發
npm run dev              # 開發服務器 (localhost:3000)
npm run build            # 生產構建
npm start                # 生產服務器

# 代碼質量
npm run lint             # ESLint 檢查
npm run test             # Jest 單元測試
npm run test:e2e         # Playwright E2E測試

# 數據庫
npm run prisma:generate  # 生成 Prisma Client
npm run prisma:migrate   # 運行遷移
npm run prisma:studio    # 數據庫 GUI
npm run db:seed          # 種子數據

# 監控（如果選擇了監控模組）
npm run monitoring:start # 啟動 Prometheus/Grafana
npm run monitoring:stop  # 停止監控
```

### Git 工作流

```bash
# 創建功能分支
git checkout -b feature/my-feature

# 開發和提交
git add .
git commit -m "feat: add new feature"

# 推送和創建 PR
git push origin feature/my-feature
```

---

## 📊 監控與可觀測性

### OpenTelemetry 堆疊 ✅ 100%完成

**支持的後端**:
- ✅ **Prometheus + Grafana** (本地部署)
- ✅ **Azure Monitor** (雲端)
- ✅ **Console** (開發環境)

**監控內容**:
- 📈 應用性能指標（APM）
- 🔍 分佈式追踪（Tracing）
- 📊 業務指標（12個類別）
- ⚠️ 自動告警（46條規則，P1-P4級別）
- 📉 預建儀表板（4個 Grafana 儀表板）

**切換後端**: 5-10分鐘配置即可切換

---

## 🧪 測試策略

### 測試覆蓋

```
📋 測試框架
├── Jest - 單元測試（120+ 測試）
├── Playwright - E2E測試
├── 整合測試 - 5個場景自動化
└── UI驗證 - 23組件 + 20動畫驗證
```

**測試類型**:
- ✅ 單元測試 - 工具函數、邏輯層
- ✅ 集成測試 - API端點、數據庫
- ✅ E2E測試 - 用戶流程、頁面交互
- ✅ 可訪問性測試 - WCAG 2.1 合規

---

## 📚 文檔系統

### 核心文檔

| 文檔 | 用途 |
|------|------|
| [AI-ASSISTANT-GUIDE.md](AI-ASSISTANT-GUIDE.md) | AI 助手快速指南（本文件） |
| [PROJECT-INDEX.md](PROJECT-INDEX.md) | 完整項目索引 |
| [CLAUDE.md](CLAUDE.md) | Claude Code 開發指導 |
| [README.md](README.md) | 項目介紹和快速開始 |
| [Docs/](Docs/) | 詳細技術文檔 |

### 分析報告（重要）

| 文檔 | 大小 | 用途 | 優先級 |
|------|------|------|--------|
| [SOURCE-PROJECT-VERIFICATION.md](Docs/SOURCE-PROJECT-VERIFICATION.md) | ~23KB | 100%驗證報告 | ⭐⭐⭐ |
| [TEMPLATE-GAP-ANALYSIS-REPORT.md](Docs/TEMPLATE-GAP-ANALYSIS-REPORT.md) | ~40KB | 完整差距分析報告 | ⭐⭐⭐ |
| [SOURCE-PROJECT-SNAPSHOT.md](Docs/SOURCE-PROJECT-SNAPSHOT.md) | ~42KB | 源項目完整結構分析 | ⭐⭐⭐ |
| [TEMPLATE-VS-SOURCE-COMPARISON.md](Docs/TEMPLATE-VS-SOURCE-COMPARISON.md) | ~30KB | 模板vs源項目對比 | ⭐⭐⭐ |

---

## 🎓 常見使用場景

### 場景 1: 創建知識管理系統

```bash
# 初始化時選擇：
✓ Knowledge Base 模組 (待補充完整schema)
✓ Search 模組
✓ AI Integration 模組（可選）
✓ Analytics 模組（待補充）

# 注意：當前版本僅包含部分功能
```

### 場景 2: 創建企業內部系統

```bash
# 初始化時選擇：
✓ Authentication 模組（已完成）
⚠️ RBAC 模組（待補充）
✓ API Gateway 模組（已完成）
⚠️ Workflow 模組（待補充完整schema）
⚠️ Notification 模組（待補充完整schema）

# 注意：Security & RBAC 模組尚未提取
```

### 場景 3: 創建 AI 驅動應用

```bash
# 初始化時選擇：
✓ AI Integration 模組（已完成）
⚠️ Meeting 模組（待補充）
⚠️ Recommendation 模組（待補充）
⚠️ Analytics 模組（待補充）

# 注意：部分AI相關模組尚未提取
```

---

## 🔍 關鍵技術決策

### 為什麼選擇這些技術？

**Next.js 14 + App Router**:
- ✅ React 服務器組件 - 更好的性能
- ✅ 內建 API 路由 - 全棧開發
- ✅ 自動代碼分割 - 優化加載
- ✅ 圖片優化 - next/image

**Prisma ORM**:
- ✅ 類型安全 - TypeScript 集成
- ✅ 遷移管理 - 版本控制
- ✅ 多數據庫支持 - 靈活切換
- ✅ 關係處理 - 自動 JOIN

**Radix UI**:
- ✅ 無障礙優先 - WCAG 2.1 AA
- ✅ 無樣式組件 - 完全可定制
- ✅ 鍵盤導航 - 完整支持
- ✅ 焦點管理 - 自動處理

**OpenTelemetry**:
- ✅ 供應商中立 - 輕鬆切換後端
- ✅ 標準協議 - 行業標準
- ✅ 豐富生態 - 大量集成
- ✅ 自動埋點 - 減少手動工作

---

## 🚨 常見問題解答

### Q1: 為什麼說是~45%完成？

**回答**: 經過完整的源項目分析和差距評估，當前模板包含：
- 14個已提取模組 / 27個總模組 = 48%
- 23個基礎組件 / 114個總組件 = 20%
- 5個基礎模型 / 34個總模型 = 15%
- 監控系統100%完成
- 綜合評估約45%完成度

詳見 `Docs/TEMPLATE-GAP-ANALYSIS-REPORT.md`

### Q2: 缺少哪些關鍵模組？

**P0關鍵** (必須補充):
- Security & RBAC (1,800+行) - 企業必需
- 根目錄核心文件 (1,375行) - errors.ts等
- API工具層 & 數據庫工具

**P1高優先級**:
- Performance & Resilience 模組
- 完整的Prisma Schema (29個業務模型)

**P2業務功能**:
- Analytics, Calendar, Collaboration
- Meeting, Recommendation, Reminder

### Q3: 如何選擇數據庫？

**推薦**: PostgreSQL（支持 pgvector 向量搜索）

| 數據庫 | 適用場景 | 限制 |
|--------|---------|------|
| **PostgreSQL** | 生產環境、需要向量搜索 | 需要安裝和配置 |
| **MySQL** | 生產環境、傳統關係型數據 | 不支持向量搜索 |
| **MongoDB** | NoSQL需求、靈活Schema | 需要特殊適配器處理 |
| **SQLite** | 開發/測試、快速原型 | **不適合生產環境** |

### Q4: 如何添加自定義模組？

1. 在 `02-modules/` 創建新目錄
2. 添加代碼文件和配置
3. 創建 `install.sh` 安裝腳本
4. 更新 `init-project.js` 的 `MODULE_OPTIONS`

### Q5: 如何切換監控後端？

編輯環境變量：
```env
MONITORING_BACKEND=prometheus  # 或 azure_monitor 或 console
```

重啟服務即可，無需修改代碼。

### Q6: 模組之間有依賴關係嗎？

有些模組有依賴：
- **Knowledge Base** 依賴 **Search** 模組（待補充完整schema）
- **Meeting** 模組建議搭配 **AI Integration**（待補充）
- **Recommendation** 依賴 **Analytics** 模組（待補充）

CLI 會自動提示依賴關係。

---

## 📖 進階學習

### 推薦閱讀順序

1. **快速開始** (5分鐘)
   - ✅ 閱讀本文件
   - ✅ 了解當前狀態和限制
   - ✅ 運行 `node init-project.js`

2. **深入理解** (1小時)
   - 📖 閱讀 [PROJECT-INDEX.md](PROJECT-INDEX.md)
   - 📖 閱讀 [TEMPLATE-GAP-ANALYSIS-REPORT.md](Docs/TEMPLATE-GAP-ANALYSIS-REPORT.md)
   - 📖 理解已實現vs待補充功能

3. **完整掌握** (1天)
   - 📚 研讀 [SOURCE-PROJECT-VERIFICATION.md](Docs/SOURCE-PROJECT-VERIFICATION.md)
   - 📚 理解源項目完整結構
   - 📚 規劃需要補充的功能

4. **實戰開發** (持續)
   - 💻 根據需求選擇已實現模組
   - 💻 根據差距報告補充缺失功能
   - 💻 遇到問題查閱文檔

---

## 🤝 貢獻指南

歡迎貢獻！請遵循以下流程：

1. Fork 項目
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 創建 Pull Request

**提交規範**:
- `feat:` 新功能
- `fix:` Bug 修復
- `docs:` 文檔更新
- `style:` 代碼格式
- `refactor:` 重構
- `test:` 測試
- `chore:` 構建/工具

---

## 📞 支持與反饋

- **GitHub Issues**: https://github.com/laitim2001/ai-webapp-template/issues
- **GitHub Discussions**: https://github.com/laitim2001/ai-webapp-template/discussions
- **文檔**: 查閱 `Docs/` 目錄

---

## 📄 授權

查看 [LICENSE](LICENSE) 文件了解詳情。

---

**最後更新**: 2025-10-09
**版本**: 5.0-alpha
**狀態**: ⚠️ 部分實現（~45%完成）- 適合學習評估，生產使用需等待完整版

**下一步**:
1. 查看 [PROJECT-INDEX.md](PROJECT-INDEX.md) 獲取完整項目索引
2. 閱讀 [TEMPLATE-GAP-ANALYSIS-REPORT.md](Docs/TEMPLATE-GAP-ANALYSIS-REPORT.md) 了解詳細差距分析
3. 參考 [SOURCE-PROJECT-VERIFICATION.md](Docs/SOURCE-PROJECT-VERIFICATION.md) 查看源項目完整驗證

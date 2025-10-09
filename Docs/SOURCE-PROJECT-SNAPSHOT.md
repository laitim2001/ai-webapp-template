# 來源專案快照 - AI 銷售賦能平台

**生成日期**: 2025-10-09
**來源**: `C:\ai-sales-enablement-webapp\`
**目的**: 用於模板提取的完整結構分析

---

## 執行摘要

### 專案統計（已於 2025-10-09 驗證）
- **生產檔案總數**: 476 個 TypeScript/JavaScript 檔案（不含 POC）
- **生產程式碼總行數**: 159,215 行
- **POC 檔案**: 381 個檔案（實驗性程式碼 - 已從模板中排除）
- **元件**: 114 個檔案分布在 19 個元件目錄中
- **應用路由**: 121 個檔案（頁面 + API 路由）
- **API 路由檔案**: 82 個 route.ts 檔案
- **函式庫模組**: 27 個不同模組（125 個檔案）
- **Prisma 模型**: 34 個資料庫模型
- **單元測試**: 31 個測試檔案
- **E2E 測試**: 17 個測試檔案
- **額外測試**: 3 個測試檔案
- **文檔檔案**: 296 個 Markdown 檔案
- **API 領域**: 23 個不同的 API 領域
- **監控檔案**: 7 個 OpenTelemetry 檔案
- **中介軟體檔案**: 12 個 API Gateway 檔案
- **安全檔案**: 19 個 RBAC/加密檔案

**關於 POC 目錄的說明**: 來源專案包含一個 `poc/` 目錄，其中有 381 個實驗性程式碼檔案（Azure OpenAI 測試、Dynamics 365 整合測試、pgvector 效能測試和模擬 CRM 資料）。此目錄**已從模板中排除**，因為它包含的是舊版研發程式碼，而非可用於生產的功能。上述統計數據僅反映適合提取到模板中的可用於生產的程式碼。

**驗證**: 請參閱 `SOURCE-PROJECT-VERIFICATION.md` 以獲取完整的 100% 驗證詳細資訊。

---

## 1. 完整目錄結構

### 根目錄結構
```
C:\ai-sales-enablement-webapp\
├── app/                      # Next.js 14 App Router
│   ├── (auth)/              # 認證頁面（路由群組）
│   │   ├── login/
│   │   └── register/
│   ├── api/                 # API 路由（23 個領域）
│   ├── dashboard/           # 儀表板頁面
│   │   ├── (routes)/
│   │   ├── admin/
│   │   ├── assistant/
│   │   ├── customers/
│   │   ├── knowledge/
│   │   ├── notifications/
│   │   ├── proposals/
│   │   ├── search/
│   │   ├── settings/
│   │   ├── tasks/
│   │   └── templates/
│   ├── auth/
│   └── globals/
│
├── components/              # React 元件（31,650 行）
│   ├── admin/              # 管理儀表板元件
│   ├── assistant/          # AI 助理聊天元件
│   ├── audit/              # 稽核日誌元件
│   ├── calendar/           # 日曆整合
│   ├── collaboration/      # 即時協作
│   ├── crm/                # 客戶 360 度視圖
│   ├── dashboard/          # 儀表板小工具
│   ├── features/           # 功能特定元件
│   ├── knowledge/          # 知識庫 UI（50+ 元件）
│   │   ├── analytics/
│   │   └── version/
│   ├── layout/             # 版面配置元件
│   ├── meeting-prep/       # 會議準備
│   ├── notifications/      # 通知系統
│   ├── permissions/        # 權限管理
│   ├── recommendation/     # AI 推薦
│   ├── reminder/           # 提醒系統
│   ├── search/             # 進階搜尋 UI
│   ├── ui/                 # 基礎 UI 元件（23 個元件）
│   └── workflow/           # 工作流程管理
│       ├── approval/
│       ├── comments/
│       └── version/
│
├── lib/                    # 核心函式庫（100+ 檔案）
│   ├── ai/                 # AI 整合（8 個檔案）
│   ├── analytics/          # 使用者行為追蹤（2 個檔案）
│   ├── api/                # API 工具（2 個檔案）
│   ├── auth/               # 認證（2 個檔案）
│   ├── cache/              # Redis 快取（2 個檔案）
│   ├── calendar/           # 日曆同步（3 個檔案）
│   ├── collaboration/      # 編輯鎖定（2 個檔案）
│   ├── db/                 # 資料庫工具
│   ├── integrations/       # 外部整合
│   │   ├── customer-360/
│   │   └── dynamics365/
│   ├── knowledge/          # 知識庫邏輯（5 個檔案）
│   ├── meeting/            # 會議智能（3 個檔案）
│   ├── middleware/         # API Gateway（12 個檔案）
│   ├── monitoring/         # OpenTelemetry 監控（7 個檔案，2,776 行）
│   ├── notification/       # 多通道通知（4 個檔案）
│   ├── parsers/            # 文件解析器（5 個檔案）
│   ├── pdf/                # PDF 生成（3 個檔案）
│   ├── performance/        # 效能優化（6 個檔案）
│   ├── recommendation/     # 推薦引擎（2 個檔案）
│   ├── reminder/           # 提醒排程器（3 個檔案）
│   ├── resilience/         # 斷路器與重試（6 個檔案）
│   ├── search/             # 向量搜尋（9 個檔案）
│   ├── security/           # RBAC 與權限（11 個檔案）
│   ├── startup/            # 初始化（1 個檔案）
│   ├── template/           # Handlebars 範本（3 個檔案）
│   ├── utils/              # 一般工具
│   ├── workflow/           # 工作流程引擎（5 個檔案）
│   └── [root files]/       # 核心工具（7 個檔案，1,375 行）
│
├── prisma/                 # 資料庫 Schema
│   └── schema.prisma       # 34 個模型（PostgreSQL）
│
├── monitoring/             # 監控設定
│   ├── alertmanager/
│   │   └── alertmanager.yml
│   ├── grafana/
│   │   ├── dashboards/     # 4 個預建儀表板
│   │   │   ├── 01-system-overview.json
│   │   │   ├── 02-api-performance.json
│   │   │   ├── 03-business-metrics.json
│   │   │   └── 04-resource-usage.json
│   │   └── provisioning/
│   │       ├── dashboards/
│   │       └── datasources/
│   └── prometheus/
│       ├── alerts.yml      # 46 個警報規則
│       └── prometheus.yml
│
├── __tests__/              # 單元測試（36 個檔案）
├── e2e/                    # E2E 測試（16 個檔案）
├── docs/                   # 文檔（60+ 檔案）
├── scripts/                # 工具腳本
├── public/                 # 靜態資源
├── types/                  # TypeScript 型別定義
└── hooks/                  # 自訂 React hooks
```

---

## 2. Package.json 分析

### 生產相依套件（共 68 個）

#### 框架核心
- `next`: ^14.2.25
- `react`: ^18.3.0
- `react-dom`: ^18.3.0
- `typescript`: （透過 devDependencies）

#### 資料庫與 ORM
- `@prisma/client`: ^5.17.0
- `pg`: ^8.12.0（PostgreSQL 驅動程式）
- `pgvector`: ^0.1.8（向量搜尋擴充）

#### 認證與身分識別
- `@azure/msal-node`: ^3.8.0（Azure AD SSO）
- `@clerk/nextjs`: ^6.33.0（認證提供者）
- `bcryptjs`: ^2.4.3（密碼雜湊）
- `jsonwebtoken`: ^9.0.2（JWT tokens）
- `jose`: ^5.6.3（JWT 工具）

#### AI 與 OpenAI 整合
- `@azure/openai`: ^1.0.0-beta.12
- `openai`: ^4.104.0

#### Azure 服務
- `@azure/identity`: ^4.12.0
- `@azure/keyvault-secrets`: ^4.10.0
- `@microsoft/microsoft-graph-client`: ^3.0.7（日曆同步）

#### UI 元件函式庫
- `@radix-ui/react-alert-dialog`: ^1.1.15
- `@radix-ui/react-avatar`: ^1.1.0
- `@radix-ui/react-checkbox`: ^1.3.3
- `@radix-ui/react-dialog`: ^1.1.15
- `@radix-ui/react-dropdown-menu`: ^2.1.16
- `@radix-ui/react-label`: ^2.1.0
- `@radix-ui/react-popover`: ^1.1.0
- `@radix-ui/react-progress`: ^1.1.7
- `@radix-ui/react-select`: ^2.1.0
- `@radix-ui/react-separator`: ^1.1.0
- `@radix-ui/react-slider`: ^1.3.6
- `@radix-ui/react-slot`: ^1.1.0
- `@radix-ui/react-switch`: ^1.2.6
- `@radix-ui/react-tabs`: ^1.1.0
- `@radix-ui/react-toast`: ^1.2.0

#### 富文本編輯器
- `@tiptap/react`: ^3.6.2
- `@tiptap/starter-kit`: ^3.6.2
- `@tiptap/extension-image`: ^3.6.2
- `@tiptap/extension-link`: ^3.6.2
- `@tiptap/extension-placeholder`: ^3.6.2
- `@tiptap/extension-table`: ^3.6.5
- `@tiptap/extension-table-cell`: ^3.6.5
- `@tiptap/extension-table-header`: ^3.6.5
- `@tiptap/extension-table-row`: ^3.6.5
- `@tiptap/pm`: ^3.6.2

#### 狀態管理與資料擷取
- `@tanstack/react-query`: ^4.36.1
- `@trpc/client`: ^10.45.0
- `@trpc/next`: ^10.45.0
- `@trpc/react-query`: ^10.45.0
- `@trpc/server`: ^10.45.0

#### 樣式與 UI 工具
- `tailwindcss`: （透過 devDependencies）
- `tailwind-merge`: ^2.4.0
- `tailwindcss-animate`: ^1.0.7
- `class-variance-authority`: ^0.7.0
- `clsx`: ^2.1.0
- `lucide-react`: ^0.408.0（圖示庫）
- `@heroicons/react`: ^2.2.0
- `@headlessui/react`: ^2.2.8

#### 快取與效能
- `ioredis`: ^5.8.0（Redis 客戶端）

#### 文件處理
- `pdf-parse`: ^2.1.1（PDF 解析）
- `mammoth`: ^1.11.0（Word 文件解析）
- `xlsx`: ^0.18.5（Excel 解析）
- `tesseract.js`: ^6.0.1（OCR）
- `puppeteer`: ^24.23.0（PDF 生成）

#### 範本引擎
- `handlebars`: ^4.7.8

#### 表單管理
- `react-hook-form`: ^7.52.0
- `@hookform/resolvers`: ^3.7.0
- `zod`: ^3.23.0（Schema 驗證）

#### 檔案上傳
- `react-dropzone`: ^14.3.8

#### 工具
- `axios`: ^1.7.0（HTTP 客戶端）
- `date-fns`: ^3.6.0（日期工具）
- `dotenv`: ^17.2.2（環境變數）
- `cmdk`: ^1.1.1（命令選單）

### 開發相依套件（共 23 個）

#### 測試
- `@playwright/test`: ^1.45.0（E2E 測試）
- `@testing-library/react`: ^16.0.0
- `@testing-library/jest-dom`: ^6.4.0
- `@testing-library/user-event`: ^14.5.0
- `@testing-library/dom`: ^10.4.1
- `jest`: ^29.7.0
- `jest-environment-jsdom`: ^29.7.0
- `@types/jest`: ^29.5.0

#### TypeScript 型別定義
- `@types/node`: ^20.14.0
- `@types/react`: ^18.3.0
- `@types/react-dom`: ^18.3.0
- `@types/bcryptjs`: ^2.4.6
- `@types/handlebars`: ^4.0.40
- `@types/jsonwebtoken`: ^9.0.6
- `@types/lodash`: ^4.17.20
- `@types/pg`: ^8.11.0
- `@types/tar`: ^6.1.13

#### Linting 與程式碼品質
- `eslint`: ^8.57.0
- `eslint-config-next`: ^14.2.0
- `@typescript-eslint/eslint-plugin`: ^7.16.0
- `@typescript-eslint/parser`: ^7.16.0

#### 建置工具
- `autoprefixer`: ^10.4.0
- `postcss`: ^8.4.0
- `prisma`: ^5.17.0（Prisma CLI）
- `tsx`: ^4.16.0

#### 負載測試
- `autocannon`: ^7.15.0

#### 工具
- `cross-env`: ^10.1.0
- `tar`: ^7.5.1

---

## 3. Prisma Schema 分析

### 資料庫設定
- **提供者**: PostgreSQL
- **擴充功能**: pgvector（用於向量搜尋）
- **模型總數**: 34

### 全部 34 個 Prisma 模型

#### 1. 使用者管理（1 個模型）
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String?
  role          String    @default("user")
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  // Relations to all other models
}
```

#### 2. 客戶與 CRM（5 個模型）
```prisma
model Customer { }          # 客戶主資料
model CustomerContact { }   # 客戶聯絡人
model SalesOpportunity { }  # 銷售流程
model CallRecord { }        # 客戶互動
model Interaction { }       # 客戶參與歷史
```

#### 3. 知識庫系統（9 個模型）
```prisma
model KnowledgeFolder { }         # 資料夾階層
model KnowledgeBase { }           # 文件
model KnowledgeChunk { }          # 向量嵌入（pgvector）
model KnowledgeTag { }            # 標籤系統
model ProcessingTask { }          # 非同步處理佇列
model KnowledgeVersion { }        # 版本控制
model KnowledgeVersionComment { } # 版本註解
model Document { }                # 文件中繼資料
model AIAnalysis { }              # AI 生成的洞察
```

#### 4. 提案管理（6 個模型）
```prisma
model Proposal { }           # 提案
model ProposalItem { }       # 行項目
model ProposalTemplate { }   # 範本
model ProposalGeneration { } # 生成追蹤
model ProposalVersion { }    # 版本歷史
model ProposalComment { }    # 註解
```

#### 5. 工作流程引擎（3 個模型）
```prisma
model ProposalWorkflow { }      # 工作流程實例
model WorkflowStateHistory { }  # 狀態轉換（12 個狀態）
model ApprovalTask { }          # 核准任務
```

#### 6. 通知系統（4 個模型）
```prisma
model Notification { }           # 通知
model NotificationPreference { } # 使用者偏好設定
model NotificationTemplate { }   # 範本
model NotificationBatch { }      # 批次傳送
```

#### 7. 認證與安全（3 個模型）
```prisma
model RefreshToken { }   # JWT 刷新令牌
model TokenBlacklist { } # 已撤銷的令牌
model ApiKey { }         # API 金鑰管理
```

#### 8. 設定與系統（3 個模型）
```prisma
model SystemConfig { }      # 系統設定
model AuditLog { }          # 稽核日誌
model AIGenerationConfig { } # AI 生成設定
```

### 向量搜尋模型
- **KnowledgeChunk**: 使用 `vector(1536)` 型別配合 pgvector 擴充
- 啟用知識庫的語意搜尋

---

## 4. 監控系統檔案

### lib/monitoring/ 結構（7 個檔案，共 2,776 行）

| 檔案 | 行數 | 用途 |
|------|-------|---------|
| `backend-factory.ts` | 217 | 監控後端的工廠模式（Prometheus/Azure/Console） |
| `config.ts` | 118 | 監控設定管理 |
| `connection-monitor.ts` | 540 | 資料庫連線池監控 |
| `middleware.ts` | 104 | Express/Next.js 監控中介軟體 |
| `monitor-init.ts` | 312 | 初始化與啟動邏輯 |
| `performance-monitor.ts` | 1,025 | 核心效能監控服務 |
| `telemetry.ts` | 460 | OpenTelemetry 整合層 |

### monitoring/ 設定檔案

#### Prometheus 設定
- `monitoring/prometheus/prometheus.yml` - 主要 Prometheus 設定
- `monitoring/prometheus/alerts.yml` - 46 個警報規則（P1-P4 嚴重性）

#### Grafana 儀表板（4 個預建）
- `01-system-overview.json` - 系統範圍指標
- `02-api-performance.json` - API 端點效能
- `03-business-metrics.json` - 業務 KPI
- `04-resource-usage.json` - 資源使用率

#### AlertManager
- `monitoring/alertmanager/alertmanager.yml` - 警報路由設定

### 監控功能
- **後端抽象化**: 在 Prometheus/Azure Monitor/Console 之間切換
- **46 個警報規則**: P1（嚴重）、P2（高）、P3（中等）、P4（低）
- **12 個指標類別**: HTTP、資料庫、快取、佇列、AI、業務等
- **4 個 Grafana 儀表板**: 預先設定的視覺化
- **OpenTelemetry**: 供應商中立的檢測

---

## 5. lib/ 中的核心模組

### 模組細分（27+ 模組）

#### AI 整合（lib/ai/ - 8 個檔案）
- `azure-openai-service.ts` - Azure OpenAI 包裝器
- `chat.ts` - 聊天完成
- `embeddings.ts` - 文字嵌入
- `enhanced-embeddings.ts` - 進階嵌入邏輯
- `openai.ts` - OpenAI SDK 包裝器
- `proposal-generation-service.ts` - AI 提案生成
- `types.ts` - 型別定義
- `index.ts` - 模組匯出

**主要功能**:
- Azure OpenAI 整合
- 向量搜尋的嵌入
- AI 提案生成
- 型別安全的 AI 回應

#### 認證（lib/auth/ + lib/auth-server.ts + lib/auth.ts - 4 個檔案，約 430 行）
- `azure-ad-service.ts` - Azure AD SSO 整合
- `token-service.ts` - JWT 令牌管理（雙令牌系統）
- `auth-server.ts` - 伺服器端認證工具（179 行）
- `auth.ts` - 客戶端認證工具（73 行）

**主要功能**:
- JWT 雙令牌認證
- Azure AD SSO 整合
- 令牌刷新與黑名單
- 基於角色的存取控制

#### API Gateway（lib/middleware/ - 12 個檔案）
- `api-versioning.ts` - API 版本管理
- `cors.ts` - CORS 設定
- `https-enforcement.ts` - HTTPS 重新導向
- `rate-limiter.ts` - 速率限制
- `request-id.ts` - 請求 ID 生成
- `request-transformer.ts` - 請求轉換
- `request-validator.ts` - 請求驗證
- `response-cache.ts` - 回應快取
- `response-transformer.ts` - 回應轉換
- `route-matcher.ts` - 路由比對邏輯
- `routing-config.ts` - 路由設定
- `security-headers.ts` - 安全標頭

**主要功能**:
- 10+ 個企業級中介軟體
- Redis 速率限制
- 請求/回應轉換
- 安全標頭（CSP、HSTS 等）

#### 知識庫（lib/knowledge/ - 5 個檔案）
- `analytics-service.ts` - 搜尋分析
- `full-text-search.ts` - 全文搜尋
- `index.ts` - 模組匯出
- `search-history-manager.ts` - 搜尋歷史追蹤
- `version-control.ts` - 文件版本控制

**主要功能**:
- 全文 + 向量搜尋混合
- 搜尋分析與歷史
- 文件版本控制
- 標籤管理

#### 搜尋系統（lib/search/ - 9 個檔案）
- `contextual-result-enhancer.ts` - 結果增強
- `crm-search-adapter.ts` - CRM 整合
- `pgvector-search.ts` - PostgreSQL 向量搜尋
- `query-processor.ts` - 查詢處理
- `result-ranker.ts` - 結果排序
- `search-analytics.ts` - 分析追蹤
- `search-suggestions.ts` - 查詢建議
- `semantic-query-processor.ts` - 語意處理
- `vector-search.ts` - 向量搜尋引擎

**主要功能**:
- 多演算法向量搜尋
- 混合搜尋（向量 + 全文）
- 語意查詢理解
- 結果排序與增強

#### 工作流程引擎（lib/workflow/ - 5 個檔案）
- `approval-manager.ts` - 核准工作流程
- `comment-system.ts` - 工作流程註解
- `engine.ts` - 核心工作流程引擎
- `index.ts` - 模組匯出
- `version-control.ts` - 工作流程版本控制

**主要功能**:
- 12 狀態工作流程引擎
- 多層級核准系統
- 工作流程版本控制
- 註解討論串

#### 通知系統（lib/notification/ - 4 個檔案）
- `email-service.ts` - 電子郵件通知
- `engine.ts` - 通知引擎
- `in-app-service.ts` - 應用內通知
- `index.ts` - 模組匯出

**主要功能**:
- 多通道（電子郵件、應用內）
- 範本系統
- 使用者偏好設定
- 批次傳送

#### 快取系統（lib/cache/ - 2 個檔案）
- `redis-client.ts` - Redis 客戶端包裝器
- `vector-cache.ts` - 向量搜尋快取

**主要功能**:
- Redis 雙層快取
- 向量嵌入快取
- TTL 管理

#### 文件解析器（lib/parsers/ - 5 個檔案）
- `excel-parser.ts` - Excel 解析
- `image-ocr-parser.ts` - Tesseract OCR
- `pdf-parser.ts` - PDF 解析
- `word-parser.ts` - Word 文件解析
- `index.ts` - 模組匯出

**主要功能**:
- PDF、Word、Excel 解析
- 圖片 OCR
- 文字提取

#### PDF 生成（lib/pdf/ - 3 個檔案）
- `pdf-generator.ts` - Puppeteer PDF 生成
- `proposal-pdf-template.ts` - 提案範本
- `index.ts` - 模組匯出

**主要功能**:
- HTML 轉 PDF 轉換
- 基於範本的生成
- Puppeteer 整合

#### 範本引擎（lib/template/ - 3 個檔案）
- `handlebars-helpers.ts` - 自訂 Handlebars 輔助函式
- `template-engine.ts` - 範本引擎
- `template-manager.ts` - 範本管理

**主要功能**:
- Handlebars 範本
- 自訂輔助函式
- 範本快取

#### 安全與 RBAC（lib/security/ - 11 個檔案）
- `action-restrictions.ts` - 基於動作的權限
- `audit-log-prisma.ts` - Prisma 稽核日誌
- `audit-log.ts` - 稽核日誌服務
- `audit-log.test.ts` - 稽核日誌測試
- `field-level-permissions.ts` - 欄位層級存取
- `fine-grained-permissions.ts` - 細粒度 RBAC
- `gdpr.ts` - GDPR 合規性
- `permission-middleware.ts` - 權限中介軟體
- `permission-middleware.test.ts` - 中介軟體測試
- `rbac.ts` - 核心 RBAC 邏輯
- `rbac.test.ts` - RBAC 測試
- `resource-conditions.ts` - 基於資源的條件
- `sensitive-fields-config.ts` - 敏感欄位設定
- `index.ts` - 模組匯出

**主要功能**:
- 基於角色的存取控制（RBAC）
- 細粒度權限
- 欄位層級權限
- GDPR 合規性工具
- 稽核日誌

#### 效能優化（lib/performance/ - 6 個檔案）
- `monitor.ts` - 效能監控
- `monitor.test.ts` - 監控測試
- `query-optimizer.ts` - 資料庫查詢優化
- `query-optimizer.test.ts` - 優化器測試
- `response-cache.ts` - 回應快取
- `response-cache.test.ts` - 快取測試

**主要功能**:
- 查詢優化
- 回應快取
- 效能監控
- 單元測試

#### 韌性（lib/resilience/ - 6 個檔案）
- `circuit-breaker.ts` - 斷路器模式
- `circuit-breaker.test.ts` - 斷路器測試
- `health-check.ts` - 健康檢查
- `health-check.test.ts` - 健康檢查測試
- `retry.ts` - 重試邏輯
- `retry.test.ts` - 重試測試

**主要功能**:
- 斷路器模式
- 指數退避重試
- 健康檢查
- 單元測試

#### 其他模組
- **lib/analytics/**（2 個檔案）- 使用者行為追蹤
- **lib/api/**（2 個檔案）- API 工具（錯誤處理器、回應輔助函式）
- **lib/calendar/**（3 個檔案）- Microsoft Graph 日曆同步
- **lib/collaboration/**（2 個檔案）- 即時編輯鎖定
- **lib/meeting/**（3 個檔案）- 會議智能與準備
- **lib/recommendation/**（2 個檔案）- 推薦引擎
- **lib/reminder/**（3 個檔案）- 提醒排程
- **lib/integrations/customer-360/**（1 個檔案）- 客戶 360 度視圖
- **lib/integrations/dynamics365/**（3 個檔案）- Dynamics 365 整合
- **lib/startup/**（1 個檔案）- 應用程式初始化

#### lib/ 根目錄檔案（7 個檔案，1,375 行）
- `auth.ts`（73 行）- 認證工具
- `auth-server.ts`（179 行）- 伺服器認證
- `db.ts`（36 行）- 資料庫工具
- `errors.ts`（653 行）- 錯誤處理
- `middleware.ts`（255 行）- 核心中介軟體
- `prisma.ts`（77 行）- Prisma 客戶端
- `utils.ts`（102 行）- 一般工具

---

## 6. components/ 中的 UI 元件

### 元件目錄結構（18 個目錄）

#### admin/（2 個元件）
- `performance-dashboard.tsx` - 效能指標儀表板
- `system-monitor.tsx` - 系統監控儀表板

#### assistant/（3 個元件）
- `ChatInput.tsx` - 聊天輸入欄位
- `ChatMessage.tsx` - 聊天訊息顯示
- `ChatWindow.tsx` - 聊天視窗容器

#### audit/（4 個元件）
- `AuditLogExport.tsx` - 匯出稽核日誌
- `AuditLogFilters.tsx` - 篩選稽核日誌
- `AuditLogList.tsx` - 顯示稽核日誌
- `AuditLogStats.tsx` - 稽核統計

#### calendar/（1 個元件）
- `CalendarView.tsx` - 日曆整合視圖

#### collaboration/（1 個元件）
- `EditLockIndicator.tsx` - 即時編輯鎖定指示器

#### crm/（1 個元件）
- `customer-360-view.tsx` - 客戶 360 度視圖

#### dashboard/（7 個元件）
- `ai-insights.tsx` - AI 生成的洞察小工具
- `dashboard-stats.tsx` - 統計卡片
- `quick-actions.tsx` - 快速動作按鈕
- `recent-activity.tsx` - 最近活動動態
- `sales-chart.tsx` - 銷售圖表
- `top-customers.tsx` - 頂級客戶列表

#### knowledge/（29+ 元件）
主要知識庫 UI 元件：
- `advanced-editor-toolbar.tsx` - 富文本編輯器工具列
- `advanced-search-builder.tsx` - 進階搜尋查詢建構器
- `breadcrumb-navigation.tsx` - 資料夾麵包屑
- `bulk-upload.tsx` - 批次文件上傳
- `document-preview.tsx` - 文件預覽
- `enhanced-knowledge-editor.tsx` - 富文本編輯器
- `enhanced-knowledge-search.tsx` - 增強搜尋介面
- `folder-selector.tsx` - 資料夾選擇 UI
- `knowledge-base-filters.tsx` - 篩選元件
- `knowledge-base-list.tsx` - 文件列表
- `knowledge-base-list-optimized.tsx` - 優化列表呈現
- `knowledge-base-upload.tsx` - 單一檔案上傳
- `knowledge-create-form.tsx` - 文件建立表單
- `knowledge-document-edit.tsx` - 文件編輯器
- `knowledge-document-edit-with-version.tsx` - 版本化編輯器
- `knowledge-document-view.tsx` - 文件檢視器
- `knowledge-folder-tree.tsx` - 資料夾樹狀導航
- `knowledge-management-dashboard.tsx` - 知識儀表板
- `knowledge-recommendation-widget.tsx` - AI 推薦
- `knowledge-review-workflow.tsx` - 審查工作流程 UI
- `knowledge-search.tsx` - 搜尋介面
- `quick-jump-search.tsx` - 快速跳轉搜尋
- `rich-text-editor.tsx` - TipTap 富文本編輯器
- `search-analytics-dashboard.tsx` - 搜尋分析
- `search-results-optimizer.tsx` - 搜尋結果優化
- `search-suggestions.tsx` - 搜尋建議

**knowledge/analytics/**（4 個元件）：
- `BarChart.tsx`
- `DocumentList.tsx`
- `PieChart.tsx`
- `StatsCard.tsx`

**knowledge/version/**（2 個元件）：
- `KnowledgeVersionComparison.tsx` - 版本差異視圖
- `KnowledgeVersionHistory.tsx` - 版本歷史列表

#### layout/（應用版面配置元件）
- 導航元件
- 頁首/頁尾
- 側邊欄

#### meeting-prep/（會議準備元件）
- 會議準備套件 UI

#### notifications/（通知 UI 元件）
- 通知鈴鐺
- 通知列表

#### permissions/（權限管理 UI）
- 權限編輯器
- 角色管理

#### recommendation/（推薦 UI）
- AI 推薦卡片

#### reminder/（提醒 UI）
- 提醒列表
- 提醒編輯器

#### search/（進階搜尋 UI）
- 搜尋篩選器
- 搜尋結果

#### ui/（23 個基礎元件）
**基於 Radix UI 的元件**：
- `alert-dialog.tsx`
- `alert.tsx`
- `avatar.tsx`
- `badge.tsx`
- `button.tsx`
- `card.tsx`
- `checkbox.tsx`
- `command.tsx`
- `dialog.tsx`
- `dropdown-menu.tsx`
- `error-display.tsx`
- `input.tsx`
- `label.tsx`
- `popover.tsx`
- `progress.tsx`
- `select.tsx`
- `separator.tsx`
- `sheet.tsx`
- `skeleton.tsx`
- `slider.tsx`
- `switch.tsx`
- `tabs.tsx`
- `textarea.tsx`

#### workflow/（工作流程 UI 元件）
**主要工作流程元件**：
- 工作流程編輯器
- 狀態機視覺化

**workflow/approval/**（核准 UI）：
- 核准任務
- 核准按鈕

**workflow/comments/**（註解 UI）：
- 註解討論串
- 回覆系統

**workflow/version/**（版本 UI）：
- 版本比較
- 版本歷史

### 元件統計總計
- **元件總數**: 80+ 個 TSX 檔案
- **總行數**: 31,650 行
- **最大模組**: knowledge/（29+ 元件）
- **基礎 UI 元件**: 23 個基於 Radix UI 的元件

---

## 7. app/api/ 中的 API 路由

### API 路由結構（23 個領域）

#### ai/（2 個路由）
- `generate-proposal/route.ts` - AI 提案生成
- `regenerate-proposal/route.ts` - 重新生成提案

#### analytics/（3 個路由）
- `behaviors/route.ts` - 使用者行為追蹤
- `profile/route.ts` - 使用者檔案分析
- `track/route.ts` - 事件追蹤

#### assistant/（1 個路由）
- `chat/route.ts` - AI 助理聊天端點

#### audit-logs/（3 個路由）
- `export/route.ts` - 匯出稽核日誌
- `route.ts` - 列出稽核日誌
- `stats/route.ts` - 稽核統計

#### auth/（7 個路由）
- `azure-ad/callback/route.ts` - Azure AD 回呼
- `azure-ad/login/route.ts` - Azure AD 登入
- `login/route.ts` - 標準登入
- `logout/route.ts` - 登出
- `me/route.ts` - 當前使用者資訊
- `refresh/route.ts` - 令牌刷新
- `register/route.ts` - 使用者註冊

#### calendar/（3 個路由）
- `auth/route.ts` - 日曆 OAuth
- `events/route.ts` - 日曆事件
- `sync/route.ts` - 日曆同步

#### collaboration/（3 個路由）
- `locks/route.ts` - 列出鎖定
- `locks/lock/[lockId]/route.ts` - 鎖定操作
- `locks/[resourceType]/[resourceId]/status/route.ts` - 鎖定狀態

#### customers/（2 個路由）
- `route.ts` - 客戶 CRUD
- `[id]/360-view/route.ts` - 客戶 360 度視圖

#### health/（1 個路由）
- `route.ts` - 健康檢查端點

#### knowledge-base/（15 個路由）
主要知識庫 API：
- `advanced-search/route.ts` - 進階搜尋
- `analytics/route.ts` - 知識分析
- `bulk-upload/route.ts` - 批次文件上傳
- `check-duplicate/route.ts` - 重複檢測
- `processing/route.ts` - 文件處理狀態
- `route.ts` - 主要 CRUD 操作
- `route-optimized.ts` - 優化查詢
- `search/route.ts` - 搜尋端點
- `suggestions/route.ts` - 搜尋建議
- `tags/route.ts` - 標籤管理
- `upload/route.ts` - 單一檔案上傳

**動態路由**：
- `[id]/content/route.ts` - 文件內容
- `[id]/download/route.ts` - 下載文件
- `[id]/route.ts` - 單一文件 CRUD
- `[id]/versions/route.ts` - 版本列表
- `[id]/versions/compare/route.ts` - 版本比較
- `[id]/versions/revert/route.ts` - 還原版本
- `[id]/versions/[versionId]/route.ts` - 單一版本

#### knowledge-folders/（4 個路由）
- `route.ts` - 資料夾 CRUD
- `reorder/route.ts` - 重新排序資料夾
- `[id]/move/route.ts` - 移動資料夾
- `[id]/route.ts` - 單一資料夾操作

#### meeting-intelligence/（2 個路由）
- `analyze/route.ts` - 分析會議記錄
- `recommendations/route.ts` - 會議推薦

#### meeting-prep/（1 個路由）
- `route.ts` - 會議準備套件

#### mock/（測試用的模擬資料端點）

#### monitoring/（監控端點）
- 健康指標
- 效能資料

#### notifications/（通知端點）
- 傳送通知
- 通知偏好設定

#### proposals/（提案端點）
- 提案 CRUD
- 提案生成

#### proposal-templates/（範本端點）
- 範本 CRUD
- 範本管理

#### recommendations/（推薦端點）
- AI 推薦
- 推薦回饋

#### reminders/（提醒端點）
- 提醒 CRUD
- 提醒排程

#### search/（搜尋端點）
- 全域搜尋
- 跨實體搜尋

#### templates/（範本端點）
- 範本 CRUD

#### [...slug]/（萬用路由）
- 後備處理器

### API 統計總計
- **API 領域總數**: 23
- **路由檔案總數**: 70+ 個 route.ts 檔案
- **最複雜**: knowledge-base（15 個路由）

---

## 8. 文檔系統

### 根目錄文檔檔案（15 個檔案）

| 檔案 | 用途 |
|------|---------|
| `README.md` | 專案概述 |
| `AI-ASSISTANT-GUIDE.md` | AI 助理使用指南（76KB） |
| `CLAUDE.md` | Claude Code 指示（29KB） |
| `DEPLOYMENT-GUIDE.md` | 部署說明（30KB） |
| `DEVELOPMENT-LOG.md` | 開發日誌（622KB） |
| `DEVELOPMENT-SERVICE-MANAGEMENT.md` | 服務管理指南 |
| `FIXLOG.md` | 錯誤追蹤日誌（100KB） |
| `INDEX-MAINTENANCE-GUIDE.md` | 索引維護指南（24KB） |
| `PROJECT-INDEX.md` | 專案導航（162KB） |
| `START-SERVICES.md` | 服務啟動指南 |
| `STARTUP-GUIDE.md` | 入門指南（23KB） |
| `e2e-test-summary.md` | E2E 測試結果 |
| `test-execution-report.md` | 測試執行報告 |
| `github.md` | GitHub 工作流程指南 |

### docs/ 目錄（60+ 檔案）

#### 架構文檔
- `architecture.md` - 系統架構
- `api-specification.md` - API 規格
- `front-end-spec.md` - 前端規格

#### 設定指南
- `azure-openai-setup-guide.md` - Azure OpenAI 設定
- `dynamics365-setup-guide.md` - Dynamics 365 設定
- `microsoft-graph-setup-guide.md` - Microsoft Graph 設定

#### 監控文檔
- `monitoring-operations-manual.md` - 操作手冊
- `monitoring-usage-examples.md` - 使用範例
- `monitoring-migration-strategy.md` - 遷移策略
- `azure-monitor-migration-checklist.md` - Azure Monitor 遷移

#### 測試文檔
- `COMPLETE-UAT-TEST-PLAN.md` - UAT 測試計畫
- `load-testing-plan.md` - 負載測試計畫
- `load-testing-execution-guide.md` - 負載測試指南
- `load-testing-summary.md` - 負載測試摘要
- `load-test-execution-report-2025-10-07.md` - 負載測試結果

#### 開發文檔
- `mvp-development-plan.md` - MVP 開發計畫
- `mvp-implementation-checklist.md` - MVP 檢查清單
- `future-innovations.md` - 未來功能
- `code-comments-enhancement-plan.md` - 程式碼品質計畫
- `code-comments-qa.md` - 程式碼註解 QA
- `ai-comment-context-analysis.md` - AI 註解分析
- `ai-comment-reference-documents.md` - 註解參考
- `ai-comments-completion-report.md` - 註解完成
- `ai-full-automation-plan.md` - 自動化計畫

#### API 文檔
- `api/knowledge-base-api.md` - 知識庫 API 文檔
- `api-gateway-architecture.md` - API gateway 架構
- `api-gateway-decision.md` - API gateway 決策

#### 索引維護
- `index-maintenance-improvement-log.md` - 索引改進
- `index-maintenance-root-cause-analysis.md` - 索引問題
- `INDEX-REMINDER-SETUP.md` - 索引提醒設定

---

## 9. 設定檔案

### 環境檔案（7 個檔案）
- `.env` - 使用中的環境變數
- `.env.local` - 本機覆寫
- `.env.example` - 範例設定（6.7KB）
- `.env.production.example` - 生產環境範例（6.6KB）
- `.env.monitoring.example` - 監控設定（2KB）
- `.env.security.example` - 安全設定（6KB）
- `.env.test` - 測試環境

### Docker 設定（5 個檔案）
- `docker-compose.dev.yml` - 開發環境 compose
- `docker-compose.monitoring.yml` - 監控堆疊（3.5KB）
- `docker-compose.prod.yml` - 生產環境 compose（4.6KB）
- `Dockerfile.dev` - 開發環境映像
- `Dockerfile.prod` - 生產環境映像（2KB）

### Next.js 設定（2 個檔案）
- `next.config.js` - 標準設定（1.7KB）
- `next.config.optimized.js` - 優化設定（5.4KB）

### 測試設定（3 個檔案）
- `jest.config.js` - Jest 單元測試（1.3KB）
- `jest.config.workflow.js` - 工作流程測試（2KB）
- `playwright.config.ts` - Playwright E2E 測試（3KB）

### 建置與工具（4 個檔案）
- `tailwind.config.js` - Tailwind CSS 設定（5.4KB）
- `postcss.config.js` - PostCSS 設定（2.9KB）
- `tsconfig.json` - TypeScript 設定（843 bytes）
- `.eslintrc.json` - ESLint 設定（3.4KB）

### 工具腳本
- `jest.setup.js` - Jest 設定（6.5KB）
- `jest.setup.workflow.js` - 工作流程測試設定（2KB）
- `healthcheck.js` - 健康檢查腳本（4.4KB）
- `instrumentation.ts` - OpenTelemetry 檢測（1.3KB）

---

## 10. 測試檔案統計

### 單元測試（__tests__/ - 36 個檔案）

**測試覆蓋範圍**：
- 認證測試
- API 端點測試
- 工具函式測試
- 監控測試
- 安全測試（RBAC、權限）
- 效能測試（查詢優化器、快取）
- 韌性測試（斷路器、重試）

**測試檔案與行數**：
- `lib/performance/monitor.test.ts`
- `lib/performance/query-optimizer.test.ts`
- `lib/performance/response-cache.test.ts`
- `lib/resilience/circuit-breaker.test.ts`
- `lib/resilience/health-check.test.ts`
- `lib/resilience/retry.test.ts`
- `lib/security/audit-log.test.ts`
- `lib/security/permission-middleware.test.ts`
- `lib/security/rbac.test.ts`
- （+ 27 個額外測試檔案）

### E2E 測試（e2e/ + tests/ - 16 個檔案）

**E2E 測試情境**：
- 認證流程（登入、登出、SSO）
- 知識庫操作（CRUD、搜尋、上傳）
- 提案生成工作流程
- 儀表板導航
- 搜尋功能
- 使用者工作流程

**測試結果**：
- E2E 測試報告在 `e2e-results/`
- Playwright 報告在 `playwright-report/`
- 可用的測試執行報告

### 測試統計摘要
- **單元測試總數**: 36 個測試檔案
- **E2E 測試總數**: 16 個測試檔案
- **測試覆蓋率**: 120+ 個測試案例
- **測試框架**: Jest（單元）、Playwright（E2E）
- **測試基礎設施**: GitHub Actions CI/CD

---

## 11. 額外專案檔案

### 腳本目錄
- 資料庫遷移腳本
- 種子資料腳本
- 建置腳本
- 部署腳本

### 公開資源
- 圖片
- 圖示
- 靜態檔案

### 型別目錄
- 共享 TypeScript 型別定義
- API 型別定義
- 元件屬性型別

### Hooks 目錄
- 自訂 React hooks
- 可重用邏輯 hooks

### 索引目錄
- 搜尋索引設定
- 資料庫索引定義

### POC 目錄
- 概念驗證實作
- 實驗性功能

### 暫存/建置成品
- `.next/` - Next.js 建置輸出
- `node_modules/` - 相依套件
- `coverage/` - 測試覆蓋率報告
- `output/` - 建置輸出
- `temp/` - 暫存檔案

---

## 12. 關鍵整合點

### 整合的外部服務
1. **Azure OpenAI** - AI 完成與嵌入
2. **Azure AD** - SSO 認證
3. **Microsoft Graph** - 日曆同步
4. **Dynamics 365** - CRM 整合
5. **Redis** - 快取層
6. **PostgreSQL + pgvector** - 具向量搜尋的資料庫
7. **Prometheus** - 指標收集
8. **Grafana** - 指標視覺化
9. **AlertManager** - 警報管理

### 內部服務架構
- **Next.js 14 App Router** - 前端與 API
- **Prisma ORM** - 資料庫存取層
- **OpenTelemetry** - 可觀測性
- **tRPC** - 型別安全 API 層（選用）
- **React Query** - 客戶端資料擷取
- **Radix UI** - 元件原語
- **TipTap** - 富文本編輯
- **Handlebars** - 範本引擎
- **Puppeteer** - PDF 生成

---

## 13. 模組提取優先順序

### 高優先順序（核心模板）
1. **監控系統**（lib/monitoring/、monitoring/）- 2,776 行
2. **API Gateway**（lib/middleware/）- 12 個中介軟體
3. **認證**（lib/auth/）- JWT + Azure AD
4. **資料庫抽象化**（lib/db.ts、lib/prisma.ts）
5. **UI 元件系統**（components/ui/）- 23 個元件
6. **基礎版面配置**（app/layout.tsx、components/layout/）

### 中優先順序（選用模組）
7. **知識庫**（lib/knowledge/、components/knowledge/、app/api/knowledge-base/）
8. **搜尋系統**（lib/search/、components/search/、app/api/search/）
9. **工作流程引擎**（lib/workflow/、components/workflow/）
10. **通知系統**（lib/notification/、components/notifications/）
11. **AI 整合**（lib/ai/、app/api/ai/）
12. **範本引擎**（lib/template/）
13. **PDF 生成**（lib/pdf/）
14. **文件解析器**（lib/parsers/）

### 低優先順序（領域特定）
15. **CRM 功能**（components/crm/、lib/integrations/customer-360/）
16. **Dynamics 365**（lib/integrations/dynamics365/）
17. **會議智能**（lib/meeting/、components/meeting-prep/）
18. **日曆同步**（lib/calendar/、components/calendar/）

---

## 14. 提取挑戰與考量

### 資料庫相依性
- **34 個 Prisma 模型** - 需要區分核心與選用
- **pgvector 擴充** - 向量搜尋為選用
- **多資料庫支援** - 需要 PostgreSQL/MySQL/MongoDB/SQLite 的抽象化

### 環境變數
- **50+ 環境變數** - 需要範本系統
- **秘密管理** - Azure Key Vault 整合
- **多環境設定** - 開發/預備/生產

### 監控複雜性
- **供應商中立設計** - Prometheus/Azure Monitor 抽象化
- **46 個警報規則** - 需要可設定
- **4 個 Grafana 儀表板** - 需要為選用

### 模組相依性
- **知識庫 ↔ 搜尋** - 緊密耦合
- **工作流程 ↔ 通知** - 核准通知
- **認證 ↔ 所有模組** - 各處都需要認證

### 測試基礎設施
- **120+ 測試** - 需要模組化
- **E2E 測試情境** - 應為選用
- **CI/CD 管線** - GitHub Actions 整合

---

## 15. 建議的模板結構

基於此分析，建議的模板結構：

```
ai-webapp-template/
├── 00-monitoring/          # 監控系統（原樣提取）
├── 01-base/                # 核心模板（認證、資料庫、UI、版面配置）
├── 02-modules/             # 選用模組
│   ├── module-auth/
│   ├── module-api-gateway/
│   ├── module-knowledge-base/
│   ├── module-search/
│   ├── module-ai-integration/
│   ├── module-workflow/
│   ├── module-notification/
│   ├── module-cache/
│   ├── module-template/
│   ├── module-pdf/
│   ├── module-parsers/
│   ├── module-dynamics365/
│   ├── module-customer360/
│   └── module-performance/
├── 03-examples/            # 範例實作
├── 04-ui-design-system/    # 設計系統文檔
└── init-project.js         # 互動式 CLI
```

---

## 結論

### 專案規模摘要
- **161,166 行程式碼**分布在 642 個檔案中
- **27+ 個不同模組**在 lib/ 中
- **34 個資料庫模型**具有向量搜尋
- **80+ 個 React 元件**分布在 18 個目錄中
- **70+ 個 API 路由**分布在 23 個領域中
- **120+ 測試**（單元 + E2E）
- **45+ 文檔檔案**

### 提取就緒性
✅ **結構良好**: 清晰的模組邊界
✅ **已文檔化**: 全面的文檔
✅ **已測試**: 良好的測試覆蓋率
✅ **可設定**: 基於環境的設定
⚠️ **複雜**: 許多相依性需要管理
⚠️ **龐大**: 160K+ LOC 需要仔細提取

### 下一步驟
1. **階段 1**: 提取監控系統（2,776 行）
2. **階段 2**: 提取基礎模板（認證、資料庫、UI）
3. **階段 3**: 提取選用模組（知識庫、搜尋、工作流程）
4. **階段 4**: 建立 init-project.js CLI
5. **階段 5**: 建立文檔與範例

---

**報告生成日期**: 2025-10-09
**來源專案**: AI 銷售賦能平台
**目標模板**: AI Web App Template v5.0

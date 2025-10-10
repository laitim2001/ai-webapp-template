# 📑 模板項目完整文件索引

**版本**: 5.0-alpha
**狀態**: 階段性完成 (~60%完成) - Phase 1 完成 ✅
**最後更新**: 2025-10-10

## 🎯 索引使用指南

本索引提供模板項目所有文件的詳細信息，按目錄結構組織。

**與其他文檔的關係**:
- **TEMPLATE-DEVELOPMENT-GUIDE.md**: AI助手快速參考（30秒了解）→ 先讀這個
- **TEMPLATE-INDEX.md**: 完整文件索引（本文件）→ 需要找具體文件時查閱
- **PROJECT-INDEX.md**: 高層次導航 → 需要理解整體結構時查閱
- **TEMPLATE-GAP-ANALYSIS-REPORT.md**: 差距分析 → 了解已實現vs待補充

**使用方式**:
1. 需要找具體文件 → 使用本索引（按目錄快速定位）
2. 需要了解功能 → 使用 PROJECT-INDEX.md（按功能查找）
3. 需要了解差距 → 使用 TEMPLATE-GAP-ANALYSIS-REPORT.md

---

## 1. 核心文件索引

### 📄 根目錄核心文件

| 文件 | 大小 | 用途 | 重要性 |
|------|------|------|--------|
| init-project.js | ~800行 | 初始化CLI工具，引導用戶配置新項目 | ⭐⭐⭐ |
| TEMPLATE-DEVELOPMENT-GUIDE.md | ~367行 | 模板開發指南，AI助手快速參考 | ⭐⭐⭐ |
| TEMPLATE-INDEX.md | 本文件 | 完整文件索引 | ⭐⭐⭐ |
| PROJECT-INDEX.md | ~555行 | 高層次項目導航 | ⭐⭐ |
| README.md | ~200行 | 項目介紹和快速開始 | ⭐⭐⭐ |
| CHANGELOG.md | ~500行 | 版本變更記錄 | ⭐⭐ |
| CLAUDE.md | ~400行 | Claude Code 開發指導 | ⭐⭐⭐ |
| package.json | ~100行 | 項目依賴（模板本身，非生成項目） | ⭐⭐ |
| .gitignore | ~50行 | Git 忽略規則 | ⭐⭐ |

---

## 2. 01-base/ 基礎模板層索引

### 2.1 模板文件 (.template)

所有 .template 文件在初始化時會被複製並替換佔位符。

| 文件 | 大小 | 佔位符 | 用途 |
|------|------|--------|------|
| package.json.template | ~150行 | PROJECT_NAME, DATABASE_TYPE | 生成項目依賴配置 |
| next.config.js.template | ~50行 | PROJECT_NAME | Next.js 配置 |
| tsconfig.json.template | ~30行 | - | TypeScript 配置 |
| tailwind.config.js.template | ~100行 | - | Tailwind CSS 主題配置 |
| AI-ASSISTANT-GUIDE.md.template | ~300行 | PROJECT_NAME, DATABASE_TYPE, INSTALLED_MODULES等 | 新項目AI助手指南 |
| env.template | ~100行 | 多個環境變數 | 環境變數參考 |

**佔位符說明**:
- `{{PROJECT_NAME}}` - 項目名稱
- `{{DATABASE_TYPE}}` - 數據庫類型（postgresql/mysql/mongodb/sqlite）
- `{{DATABASE_URL}}` - 數據庫連接字串
- `{{NEXTAUTH_SECRET}}` - NextAuth 密鑰（自動生成）
- `{{INSTALLED_MODULES}}` - 已安裝模組列表
- `{{AUTHOR}}` - 作者信息

### 2.2 Prisma Schema

每種數據庫類型的獨立 Schema 文件。

| 文件 | 大小 | 模型數 | 說明 |
|------|------|--------|------|
| schema.postgresql.prisma | ~200行 | 5個基礎模型 | PostgreSQL Schema（推薦，支持向量搜索） |
| schema.mysql.prisma | ~200行 | 5個基礎模型 | MySQL Schema |
| schema.mongodb.prisma | ~150行 | 5個基礎模型 | MongoDB Schema（無關係，使用嵌套文檔） |
| schema.sqlite.prisma | ~200行 | 5個基礎模型 | SQLite Schema（僅開發測試用） |
| schema.prisma.template | ~200行 | 5個基礎模型 | 通用參考模板 |

**基礎模型** (5個):
```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  name          String?
  password      String
  role          String    @default("USER")
  // ... 其他欄位
}

model RefreshToken {
  id          String   @id @default(uuid())
  token       String   @unique
  userId      String
  expiresAt   DateTime
  // ... 其他欄位
}

model TokenBlacklist {
  id        String   @id @default(uuid())
  token     String   @unique
  createdAt DateTime @default(now())
}

model Session {
  id           String   @id @default(uuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  // ... 其他欄位
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  // ... 其他欄位
}
```

**待補充模型** (29個):
- 客戶CRM (5個): Customer, CustomerContact, SalesOpportunity, CallRecord, Interaction
- 知識庫系統 (9個): KnowledgeFolder, KnowledgeBase, KnowledgeChunk等
- 提案管理 (6個): Proposal, ProposalItem, ProposalTemplate等
- 工作流引擎 (3個): ProposalWorkflow, WorkflowStateHistory, ApprovalTask
- 通知系統 (4個): Notification, NotificationPreference, NotificationTemplate, NotificationBatch
- 配置與系統 (3個): SystemConfig, AuditLog, AIGenerationConfig

**詳細清單**: 參考 `Docs/TEMPLATE-GAP-ANALYSIS-REPORT.md` 附錄B

### 2.3 文檔

| 文件 | 大小 | 用途 |
|------|------|------|
| docs/UI-DESIGN-SYSTEM.md | ~500行 | 完整UI設計系統文檔 |
| docs/ANIMATION-GUIDE.md | ~200行 | 動畫系統指南 |
| docs/RESPONSIVE-DESIGN-GUIDE.md | ~150行 | 響應式設計指南 |
| docs/components/README.md | ~100行 | 組件使用說明 |

### 2.4 核心代碼結構

```
01-base/
├── app/                    # Next.js 14 App Router
│   ├── layout.tsx         # 根佈局
│   ├── page.tsx           # 首頁
│   ├── globals.css        # 全局樣式
│   └── api/               # API 路由（基礎）
│       └── health/        # 健康檢查端點
│
├── components/            # React 組件（部分提取）
│   └── ui/               # 26個基礎 Radix UI 組件 ⭐ Phase 1新增3個
│       ├── alert.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── form.tsx          # ✅ Phase 1新增 - react-hook-form整合
│       ├── input.tsx
│       ├── pagination.tsx    # ✅ Phase 1新增 - 分頁組件
│       ├── select.tsx
│       ├── table.tsx         # ✅ Phase 1新增 - 數據表格
│       └── ... (17個其他)
│
├── lib/                  # 核心工具庫（部分提取）
│   ├── db/              # 數據庫適配器 ⭐⭐⭐
│   │   ├── database-adapter.ts      # 統一接口
│   │   ├── postgresql-adapter.ts    # PostgreSQL實現
│   │   ├── mysql-adapter.ts         # MySQL實現
│   │   ├── mongodb-adapter.ts       # MongoDB實現（特殊處理）
│   │   └── sqlite-adapter.ts        # SQLite實現
│   │
│   ├── errors.ts.template   # 統一錯誤處理系統 ⭐⭐⭐ (Day 38-40 新增)
│   ├── utils.ts.template    # 通用工具函數庫 ⭐⭐⭐ (Day 38-40 增強)
│   └── prisma.ts.template   # Prisma 客戶端單例 ⭐⭐⭐ (Day 38-40 新增)
│
├── types/               # TypeScript 類型定義
│   └── index.ts
│
├── hooks/               # 自定義 React Hooks
│   └── use-toast.ts
│
├── prisma/              # 數據庫 Schema 和遷移
│   ├── schema.postgresql.prisma
│   ├── schema.mysql.prisma
│   ├── schema.mongodb.prisma
│   ├── schema.sqlite.prisma
│   └── seed.ts          # 種子數據腳本
│
├── __tests__/           # 單元測試 ⭐ Phase 1新增
│   └── unit/
│       ├── errors.test.ts.template           # ✅ errors.ts測試 (~200行)
│       ├── utils.test.ts.template            # ✅ utils.ts測試 (~250行)
│       └── database-adapter.test.ts.template # ✅ DB適配器測試 (~200行)
│
├── tests/               # E2E測試 ⭐ Phase 1新增
│   └── e2e/
│       └── auth-flow.spec.ts.template        # ✅ 認證流程E2E (~250行)
│
├── scripts/             # 工具腳本 ⭐ Phase 1新增
│   ├── backup-db.sh.template                 # ✅ 多DB備份腳本 (~350行)
│   ├── restore-db.sh.template                # ✅ 多DB恢復腳本 (~350行)
│   └── healthcheck.js.template               # ✅ 健康檢查腳本 (~250行)
│
├── nginx/               # Nginx配置 ⭐ Phase 1新增
│   └── nginx.conf.template                   # ✅ 反向代理配置 (~180行)
│
├── docs/                # 項目文檔
│   ├── UI-DESIGN-SYSTEM.md
│   ├── ANIMATION-GUIDE.md
│   ├── RESPONSIVE-DESIGN-GUIDE.md
│   ├── API-DESIGN-PATTERNS.md.template       # ✅ Phase 1新增 - API設計規範 (~450行)
│   └── INDEX-REMINDER-SETUP.md.template      # ✅ Phase 1新增 - 索引提醒設置 (~50行)
│
├── 📄 文檔模板 ⭐ Phase 1新增8個
│   ├── PROJECT-INDEX.md.template             # ✅ 項目導航索引 (~400行)
│   ├── DEPLOYMENT-GUIDE.md.template          # ✅ 完整部署指南 (~250行)
│   ├── DEVELOPMENT-LOG.md.template           # ✅ 開發日誌模板 (~250行)
│   ├── FIXLOG.md.template                    # ✅ 修復日誌模板 (~200行)
│   ├── INDEX-MAINTENANCE-GUIDE.md.template   # ✅ 索引維護指南 (~80行)
│   └── NEW-DEVELOPER-SETUP-GUIDE.md.template # ✅ 新開發者指南 (~300行)
│
├── 🐳 部署配置 ⭐ Phase 1新增9個
│   ├── Dockerfile.prod.template              # ✅ 生產環境Dockerfile (~85行)
│   ├── Dockerfile.dev.template               # ✅ 開發環境Dockerfile (~32行)
│   ├── docker-compose.dev.yml.template       # ✅ 開發環境編排 (~107行)
│   ├── docker-compose.prod.yml.template      # ✅ 生產環境編排 (~167行)
│   └── .env.production.template              # ✅ 生產環境變數 (~180行)
│
└── public/              # 靜態資源
    ├── favicon.ico
    └── images/
```

**文件統計** (Phase 1更新):
- App 路由: ~10個文件
- UI 組件: 26個文件 (+3個 ✅)
- 數據庫適配器: 5個文件
- **文檔模板**: 8個文件 (+8個 ✅)
- **部署配置**: 9個文件 (+9個 ✅)
- **測試模板**: 4個文件 (+4個 ✅)
- **腳本工具**: 3個文件 (+3個 ✅)
- 其他工具: ~10個文件
- **總計**: ~75個基礎文件 (+25個 ✅)

---

## 3. 02-modules/ 功能模組庫索引

### 3.1 已提取模組 (15個)

#### P0 核心模組 (4個)

**1. 監控系統 (00-monitoring/)**

| 文件類型 | 路徑 | 文件數 | 代碼量 |
|---------|------|--------|--------|
| 核心文件 | instrumentation.ts.template | 1 | ~100行 |
| 監控工具庫 | lib/monitoring/ | 7 | 2,776行 |
| 配置文件 | monitoring/ | 10+ | - |
| 文檔 | README.md | 1 | ~300行 |

**監控工具庫詳細** (lib/monitoring/):
- backend-factory.ts (~300行) - 後端工廠模式
- config.ts (~200行) - 監控配置
- connection-monitor.ts (~250行) - 連接監控
- middleware.ts (~400行) - 中間件
- monitor-init.ts (~300行) - 初始化
- performance-monitor.ts (~400行) - 性能監控
- telemetry.ts (~926行) - 遙測主邏輯

**配置文件詳細** (monitoring/):
- prometheus.yml - Prometheus 配置
- grafana/provisioning/ - Grafana 自動配置
- alerts/ - 46個告警規則（P1-P4）
- docker-compose.yml - 本地監控堆棧

**2. 認證授權 (module-auth/)**

| 文件類型 | 數量 | 代碼量 |
|---------|------|--------|
| 核心文件 | 17 | 4,252行 |
| Prisma模型 | 3 | RefreshToken, TokenBlacklist, Session |
| API端點 | 7 | 認證相關API |

**核心文件**:
- lib/auth/jwt.ts - JWT 令牌管理
- lib/auth/azure-ad.ts - Azure AD SSO
- lib/auth/middleware.ts - 認證中間件
- app/api/auth/*.ts - 7個認證端點

**3. API Gateway (module-api-gateway/)**

| 文件類型 | 數量 | 代碼量 |
|---------|------|--------|
| 中間件文件 | 12 | 4,593行 |

**4. Security & RBAC (module-security/)** ⭐ **Day 35-36 新增**

| 文件類型 | 數量 | 代碼量 |
|---------|------|--------|
| 核心文件 | 14 | 2,800行 |
| 測試文件 | 3 | 1,100行 |
| 測試配置 | 2 | - |
| 總計 | 19 | 2,900+行 |

**核心文件詳細** (lib/security/):
- rbac.ts (~800行) - 角色權限核心系統
- audit-log.ts (~600行) - 審計日誌系統
- permission-middleware.ts (~400行) - 權限中間件
- fine-grained-permissions.ts (~300行) - 細粒度權限
- gdpr.ts (~400行) - GDPR 合規性
- field-level-security.ts (~200行) - 字段級安全
- index.ts (~100行) - 統一導出

**測試文件詳細** (__tests__/):
- rbac.test.ts (380行, 80+測試)
- audit-log.test.ts (350行, 60+測試)
- permission-middleware.test.ts (360行, 50+測試)
- jest.config.js - Jest 配置
- jest.setup.js - 測試環境設置

**功能特性**:
- 4種角色: ADMIN, SALES_MANAGER, SALES_REP, USER
- 30+ 權限定義
- 完整審計日誌追蹤
- GDPR 合規 (數據導出、刪除)
- Field-level 安全性
- 可疑活動檢測
- 190+ 測試案例
- 85% 測試覆蓋率

**12個中間件詳細** (lib/middleware/):
1. api-versioning.ts - API版本管理
2. cors.ts - CORS配置
3. https-enforcement.ts - HTTPS強制
4. rate-limiter.ts - 速率限制
5. request-id.ts - 請求ID追蹤
6. request-transformer.ts - 請求轉換
7. request-validator.ts - 請求驗證
8. response-cache.ts - 響應緩存
9. response-transformer.ts - 響應轉換
10. route-matcher.ts - 路由匹配
11. routing-config.ts - 路由配置
12. security-headers.ts - 安全頭部

#### P1 高優先級模組 (7個)

**5. 知識庫系統 (module-knowledge-base/)**

| 文件類型 | 數量 | 代碼量 |
|---------|------|--------|
| 核心文件 | 40+ | 8,000+行 |
| 組件 | 24+ | 知識庫UI |
| API端點 | 17 | 文檔CRUD、搜索 |
| Prisma模型 | 9 | 知識庫相關模型 |

**核心功能**:
- 向量搜索（pgvector）
- 版本控制系統
- 文檔處理和分塊
- AI分析整合

**6. AI 整合 (module-ai-integration/)**

| 文件類型 | 數量 | 代碼量 |
|---------|------|--------|
| 核心文件 | 8 | 3,000+行 |

**核心文件**:
- lib/ai/azure-openai.ts - Azure OpenAI 封裝
- lib/ai/prompts.ts - 提示詞管理
- lib/ai/streaming.ts - 流式響應
- lib/ai/embeddings.ts - 向量嵌入

**7. 搜索引擎 (module-search/)**

| 文件類型 | 數量 | 代碼量 |
|---------|------|--------|
| 核心文件 | 12 | 2,800+行 |
| 組件 | 6 | 搜索UI |

**搜索算法**:
- 向量相似度搜索
- 全文搜索
- 混合搜索策略
- 重排序算法

**8. 工作流引擎 (module-workflow/)**

| 文件類型 | 數量 | 代碼量 |
|---------|------|--------|
| 核心文件 | 10 | 2,035行 |
| 組件 | 多個 | 工作流視覺化 |
| Prisma模型 | 3 | 工作流相關模型 |

**12個狀態**:
- DRAFT, PENDING_REVIEW, REVIEWING, REVISION_NEEDED
- APPROVED, REJECTED, GENERATING, GENERATION_FAILED
- READY_FOR_DELIVERY, DELIVERED, ARCHIVED, CANCELLED

**9. 通知系統 (module-notification/)**

| 文件類型 | 數量 | 代碼量 |
|---------|------|--------|
| 核心文件 | 8 | 1,550行 |
| Prisma模型 | 4 | 通知相關模型 |

**通知渠道**:
- 站內通知
- 電子郵件
- 推送通知（可選）

**10. 緩存系統 (module-cache/)**

| 文件類型 | 數量 | 代碼量 |
|---------|------|--------|
| 核心文件 | 6 | 1,500+行 |

**緩存策略**:
- Redis 雙層緩存
- 自動失效機制
- 熱數據預加載

**11. Performance 監控 (module-performance/)**

| 文件類型 | 數量 | 代碼量 |
|---------|------|--------|
| 核心文件 | 4 | ~500行 |

**注意**: 這是監控系統的性能服務部分，非完整 Performance 模組。

#### P2 業務功能模組 (4個)

**12. 範本管理 (module-template/)**

| 文件類型 | 數量 | 代碼量 |
|---------|------|--------|
| 核心文件 | 6 | 1,150行 |

**功能**:
- Handlebars 模板引擎
- 模板CRUD
- 預覽和導出

**13. PDF 生成 (module-pdf/)**

| 文件類型 | 數量 | 代碼量 |
|---------|------|--------|
| 核心文件 | 3 | 640行 |

**技術**: Puppeteer PDF 生成

**14. 文件解析 (module-parsers/)**

| 文件類型 | 數量 | 代碼量 |
|---------|------|--------|
| 核心文件 | 6 | 1,280行 |

**支持格式**:
- PDF 解析
- Word 解析
- Excel 解析
- OCR 文字識別

**15. Dynamics 365 (module-dynamics365/)**

| 文件類型 | 數量 | 代碼量 |
|---------|------|--------|
| 核心文件 | 6 | 1,200+行 |

**整合功能**:
- CRM 數據同步
- 客戶360視圖

**16. lib/ 根目錄核心文件** ⭐ **Day 38-40 新增**

| 文件類型 | 數量 | 代碼量 |
|---------|------|--------|
| 核心文件 | 3 | 1,113行 |

**核心文件詳細** (01-base/lib/):
- **errors.ts.template** (615行) - 統一錯誤處理系統
  - ErrorType 枚舉（23種錯誤類型）
  - ErrorSeverity 枚舉（4個嚴重等級）
  - AppError 類別（8個靜態便捷方法）
  - ErrorClassifier（自動分類：Prisma/JWT/Network/AI/Validation）
  - ErrorLogger（環境特定日誌策略）
  - ErrorMetrics（統計數據收集）

- **utils.ts.template** (400行) - 增強版通用工具庫
  - CSS 類名合併（cn + Tailwind 衝突解決）
  - 字符串處理（truncate, capitalize, toKebabCase, toCamelCase）
  - 數字格式化（formatNumber, formatPercentage, formatCurrency）
  - 日期/時間處理（formatDate, formatRelativeTime）
  - 數組工具（unique, groupBy, chunk）
  - 對象工具（deepClone, removeEmpty）
  - 延遲/防抖/節流（sleep, debounce, throttle）
  - ID 生成（generateId, generateUUID）
  - 驗證工具（isValidEmail, isValidUrl）
  - 文件工具（formatFileSize, getFileExtension）
  - 錯誤處理（safeJsonParse, getErrorMessage）
  - URL 處理（absoluteUrl）

- **prisma.ts.template** (98行) - Prisma 客戶端單例
  - 單例模式實現
  - 開發環境熱重載優化
  - 生產環境優雅關閉
  - 環境特定日誌配置
  - 連接池管理

**功能特性**:
- 36+ 實用工具函數
- 統一錯誤處理系統
- 自動錯誤分類和日誌
- 完整錯誤上下文追蹤
- 環境特定優化

### 3.2 模組通用文檔

每個模組目錄都包含：

| 文件 | 用途 |
|------|------|
| README.md | 模組說明和使用指南 |
| install.sh | 安裝腳本 |
| examples/ | 使用範例代碼 |

### 3.3 待補充模組 (12個)

| # | 模組名稱 | 源路徑 | 文件數 | 代碼量 | 優先級 | 狀態 |
|---|---------|--------|--------|--------|--------|------|
| 16 | **API 工具層** | lib/api/ | 2 | ~200行 | P0 🔴 | ❌ 遺漏 |
| 17 | **數據庫工具** | lib/db/ | 多個 | ~300行 | P0 🔴 | ❌ 遺漏 |
| 18 | **根目錄核心** | lib/*.ts | 3 (部分) | 1,113行 | P0 🔴 | ✅ 部分 (Day 38-40) |
| 19 | **Performance** | lib/performance/ | 6 | 600+行 | P1 🟡 | ❌ 遺漏 |
| 20 | **Resilience** | lib/resilience/ | 6 | 600+行 | P1 🟡 | ❌ 遺漏 |
| 21 | **Analytics** | lib/analytics/ | 2 | 482行 | P2 🟢 | ❌ 遺漏 |
| 22 | **Calendar** | lib/calendar/ | 3 | 1,388行 | P2 🟢 | ❌ 遺漏 |
| 23 | **Collaboration** | lib/collaboration/ | 2 | 487行 | P2 🟢 | ❌ 遺漏 |
| 24 | **Meeting** | lib/meeting/ | 3 | 1,214行 | P2 🟢 | ❌ 遺漏 |
| 25 | **Recommendation** | lib/recommendation/ | 2 | 631行 | P2 🟢 | ❌ 遺漏 |
| 26 | **Reminder** | lib/reminder/ | 3 | 674行 | P2 🟢 | ❌ 遺漏 |
| 27 | **Email** | lib/email/ | - | -行 | P2 🟢 | ❌ 遺漏 |

**注意**: Security & RBAC 模組已於 Day 35-36 完成 (19個文件, 2,900+行代碼)

**詳細說明**: 參考 `Docs/TEMPLATE-GAP-ANALYSIS-REPORT.md` 第2章

---

## 4. Docs/ 文檔索引

### 4.1 核心分析報告 (必讀)

| 文檔 | 大小 | 用途 | 優先級 |
|------|------|------|--------|
| TEMPLATE-GAP-ANALYSIS-REPORT.md | ~40KB | 完整差距分析報告 | ⭐⭐⭐ |
| SOURCE-PROJECT-VERIFICATION.md | ~23KB | 100%驗證報告 | ⭐⭐⭐ |
| SOURCE-PROJECT-SNAPSHOT.md | ~42KB | 源項目完整快照 | ⭐⭐ |
| TEMPLATE-VS-SOURCE-COMPARISON.md | ~30KB | 模板vs源項目對比 | ⭐⭐ |

**使用建議**:
1. 先讀 TEMPLATE-GAP-ANALYSIS-REPORT.md - 了解差距
2. 再讀 SOURCE-PROJECT-VERIFICATION.md - 了解源項目
3. 最後讀 TEMPLATE-VS-SOURCE-COMPARISON.md - 了解對比

### 4.2 實施計劃文檔

| 文檔 | 狀態 | 說明 |
|------|------|------|
| TEMPLATE-CREATION-FINAL-v5-COMPLETE.md | 已過時 | 聲稱96.3%完成（實際45%），僅供參考 |
| template-implementation-log.md | 維護中 | 開發日誌（Day 1-31） |
| V4-V5-COMPARISON-ANALYSIS.md | 參考 | v4/v5版本對比 |
| V5-ADDITIONS.md | 參考 | v5新增內容整理 |

### 4.3 模組提取計劃

各個模組的提取計劃文檔：

| 文檔 | 模組 | 狀態 |
|------|------|------|
| auth-extraction-plan.md | 認證授權 | ✅ 已完成 |
| api-gateway-extraction-plan.md | API Gateway | ✅ 已完成 |
| knowledge-base-extraction-plan.md | 知識庫 | ✅ 已完成 |
| monitoring-extraction-plan.md | 監控系統 | ✅ 已完成 |
| search-module-extraction-plan.md | 搜索引擎 | ✅ 已完成 |

### 4.4 其他技術文檔

| 文檔 | 用途 |
|------|------|
| DATABASE-SWITCHING-GUIDE.md | 數據庫切換指南 |
| DAY26-CLI-ANALYSIS.md | CLI 工具分析 |
| DAY27-INTEGRATION-TEST-REPORT.md | 整合測試報告 |
| DAY28-UI-VERIFICATION-REPORT.md | UI 驗證報告 |

---

## 5. examples/ 示例數據索引

### 5.1 種子數據 (seed-data/)

| 文件 | 內容 | 用途 |
|------|------|------|
| users.json | 5個示例用戶 | 測試用戶數據 |
| projects.json | 10個示例項目 | 測試項目數據 |
| content-items.json | 20個示例內容項 | 測試內容數據 |

### 5.2 示例日誌 (sample-logs/)

| 文件 | 用途 |
|------|------|
| DEVELOPMENT-LOG-sample.md | 開發日誌範例 |
| FIXLOG-sample.md | 修復日誌範例 |

### 5.3 UI 參考 (ui-reference/)

| 文件 | 內容 |
|------|------|
| UI-STRUCTURE.md | UI 結構完整樹 |
| COMPONENT-USAGE.md | 組件使用指南 |
| LAYOUT-PATTERNS.md | 佈局模式範例 |

---

## 6. scripts/ 工具腳本索引

| 腳本 | 用途 | 行數 |
|------|------|------|
| integration-tests.js | 整合測試腳本（5個場景） | ~500行 |
| test-cli-simple.js | CLI 簡單測試 | ~100行 |
| test-cli-workflow.js | CLI 完整工作流測試 | ~200行 |

**測試場景**:
1. PostgreSQL + 全部模組
2. MySQL + 核心模組
3. MongoDB + 知識庫模組
4. SQLite + 最小配置
5. PostgreSQL + 自定義配置

---

## 7. 配置文件索引

### 7.1 Git 配置

| 文件 | 用途 | 行數 |
|------|------|------|
| .gitignore | Git 忽略規則 | ~50行 |
| .gitattributes | Git 屬性配置 | ~10行 |

### 7.2 編輯器配置

| 文件 | 用途 |
|------|------|
| .editorconfig | 編輯器配置 |
| .prettierrc | Prettier 格式化配置 |
| .eslintrc.json | ESLint 規則配置 |

### 7.3 TypeScript 配置

| 文件 | 用途 |
|------|------|
| tsconfig.json | TypeScript 主配置 |
| tsconfig.node.json | Node.js 環境配置 |

---

## 8. 組件完整清單

### 8.1 已提取基礎組件 (23個)

**路徑**: `01-base/components/ui/`

| # | 組件文件 | 行數 | 基於 | 用途 |
|---|----------|------|------|------|
| 1 | alert.tsx | ~50 | Radix UI | 警告提示 |
| 2 | alert-dialog.tsx | ~100 | Radix UI | 確認對話框 |
| 3 | avatar.tsx | ~40 | Radix UI | 用戶頭像 |
| 4 | badge.tsx | ~30 | Radix UI | 徽章標籤 |
| 5 | button.tsx | ~80 | Radix UI | 按鈕 |
| 6 | card.tsx | ~60 | Radix UI | 卡片容器 |
| 7 | checkbox.tsx | ~50 | Radix UI | 複選框 |
| 8 | command.tsx | ~150 | Radix UI | 命令面板 |
| 9 | dialog.tsx | ~100 | Radix UI | 對話框 |
| 10 | dropdown-menu.tsx | ~120 | Radix UI | 下拉菜單 |
| 11 | error-display.tsx | ~60 | 自定義 | 錯誤展示 |
| 12 | input.tsx | ~50 | Radix UI | 輸入框 |
| 13 | label.tsx | ~30 | Radix UI | 標籤 |
| 14 | popover.tsx | ~80 | Radix UI | 彈出框 |
| 15 | progress.tsx | ~40 | Radix UI | 進度條 |
| 16 | select.tsx | ~100 | Radix UI | 選擇器 |
| 17 | separator.tsx | ~30 | Radix UI | 分隔線 |
| 18 | sheet.tsx | ~100 | Radix UI | 側邊欄 |
| 19 | skeleton.tsx | ~40 | Radix UI | 骨架屏 |
| 20 | slider.tsx | ~60 | Radix UI | 滑塊 |
| 21 | switch.tsx | ~50 | Radix UI | 開關 |
| 22 | tabs.tsx | ~80 | Radix UI | 標籤頁 |
| 23 | textarea.tsx | ~50 | Radix UI | 文本域 |

**總代碼量**: ~1,600行

### 8.2 待補充進階組件 (91個)

源項目完整組件統計 (114個組件，19個目錄):

| # | 目錄 | 組件數 | 功能 | 重要性 | 狀態 |
|---|------|-------|------|--------|------|
| 1 | ui/ | 23 | 基礎UI組件 | P0 🔴 | ✅ 已提取 |
| 2 | admin/ | 2 | 性能儀表板、系統監控 | P1 🟡 | ❌ 遺漏 |
| 3 | assistant/ | 3 | ChatInput, ChatMessage, ChatWindow | P1 🟡 | ❌ 遺漏 |
| 4 | audit/ | 4 | Export, Filters, List, Stats | P0 🔴 | ❌ 遺漏 |
| 5 | calendar/ | 1 | 日曆視圖 | P2 🟢 | ❌ 遺漏 |
| 6 | collaboration/ | 1 | 編輯鎖定指示器 | P2 🟢 | ❌ 遺漏 |
| 7 | crm/ | 1 | 客戶360視圖 | P2 🟢 | ❌ 遺漏 |
| 8 | dashboard/ | 6 | 儀表板佈局 | P1 🟡 | ❌ 遺漏 |
| 9 | features/ | 多個 | 功能特定元件 | P2 🟢 | ❌ 遺漏 |
| 10 | knowledge/ | 35 | 知識庫完整UI（含analytics子目錄4個） | P1 🟡 | ❌ 遺漏 |
| 11 | layout/ | 多個 | 佈局元件 | P1 🟡 | ❌ 遺漏 |
| 12 | meeting-prep/ | 5+ | 會議準備UI | P2 🟢 | ❌ 遺漏 |
| 13 | notifications/ | 3+ | 通知中心 | P1 🟡 | ❌ 遺漏 |
| 14 | permissions/ | 多個 | 權限管理UI | P0 🔴 | ❌ 遺漏 |
| 15 | recommendation/ | 多個 | 推薦顯示 | P2 🟢 | ❌ 遺漏 |
| 16 | reminder/ | 多個 | 提醒UI | P2 🟢 | ❌ 遺漏 |
| 17 | search/ | 6 | 搜索界面 | P1 🟡 | ❌ 遺漏 |
| 18 | workflow/ | 多個 | 工作流程視覺化 | P1 🟡 | ❌ 遺漏 |
| 19 | proposals/ | 多個 | 提案管理UI | P2 🟢 | ❌ 遺漏 |

**總遺漏**: ~91個組件

---

## 9. API 路由完整清單

### 9.1 已實現 API

**Authentication API** (7個端點) - ✅ 已實現:

```
/api/auth/
├── POST   /register           # 用戶註冊
├── POST   /login              # 用戶登錄
├── POST   /logout             # 用戶登出
├── POST   /refresh            # 刷新令牌
├── GET    /me                 # 獲取當前用戶
├── GET    /azure-ad/login     # Azure AD 登錄
└── GET    /azure-ad/callback  # Azure AD 回調
```

### 9.2 待補充 API 域 (22個域)

源項目完整 API (82個route.ts文件，23個API域):

| # | API域 | 端點數 | 主要功能 | 狀態 |
|---|-------|--------|---------|------|
| 1 | auth/ | 7 | 認證授權 | ✅ 已實現 |
| 2 | knowledge-base/ | 17 | 文檔CRUD、版本管理、高級搜索 | ❌ 待補充 |
| 3 | templates/ | 8 | 模板管理、預覽、導出PDF | ❌ 待補充 |
| 4 | proposals/ | 6 | 提案管理、版本控制 | ❌ 待補充 |
| 5 | ai/ | 2 | AI生成提案 | ❌ 待補充 |
| 6 | analytics/ | 3 | 用戶行為追蹤 | ❌ 待補充 |
| 7 | assistant/ | 1 | AI助手聊天 | ❌ 待補充 |
| 8 | audit-logs/ | 3 | 審計日誌、導出 | ❌ 待補充 |
| 9 | calendar/ | 3 | Microsoft Graph 同步 | ❌ 待補充 |
| 10 | collaboration/ | 3 | 編輯鎖定管理 | ❌ 待補充 |
| 11 | customers/ | 2 | 客戶管理、360視圖 | ❌ 待補充 |
| 12 | health/ | 1 | 健康檢查 | ❌ 待補充 |
| 13 | knowledge-folders/ | 4 | 文件夾管理 | ❌ 待補充 |
| 14 | meeting-intelligence/ | 2 | AI會議分析 | ❌ 待補充 |
| 15 | meeting-prep/ | 3 | 會議準備包 | ❌ 待補充 |
| 16 | monitoring/ | 1 | 監控初始化 | ❌ 待補充 |
| 17 | notifications/ | 4 | 通知系統 | ❌ 待補充 |
| 18 | proposal-templates/ | 4 | 提案模板 | ❌ 待補充 |
| 19 | recommendations/ | 3 | 個性化推薦 | ❌ 待補充 |
| 20 | reminders/ | 3 | 提醒管理 | ❌ 待補充 |
| 21 | search/ | 1 | CRM搜索 | ❌ 待補充 |
| 22 | mock/ | 1 | Dynamics 365 模擬 | ❌ 待補充 |

---

## 10. 依賴包完整清單

### 10.1 核心依賴 (已包含)

**框架和核心**:
- next@14.x
- react@18.x
- react-dom@18.x
- typescript@5.x

**數據庫和 ORM**:
- @prisma/client
- prisma
- mongodb
- mysql2

**UI 組件庫**:
- @radix-ui/* (20個基礎包)
- lucide-react
- tailwindcss
- framer-motion

**認證和安全**:
- next-auth
- jsonwebtoken
- bcrypt
- @azure/msal-node

**監控和日誌**:
- @opentelemetry/* (10個包)
- winston
- prom-client

### 10.2 待補充依賴 (~70個)

**TipTap富文本編輯器** (10個包):
```json
"@tiptap/react": "^3.6.2",
"@tiptap/starter-kit": "^3.6.2",
"@tiptap/extension-image": "^3.6.2",
"@tiptap/extension-link": "^3.6.2",
"@tiptap/extension-placeholder": "^3.6.2",
"@tiptap/extension-table": "^3.6.5",
"@tiptap/extension-table-cell": "^3.6.5",
"@tiptap/extension-table-header": "^3.6.5",
"@tiptap/extension-table-row": "^3.6.5",
"@tiptap/pm": "^3.6.2"
```

**tRPC類型安全API** (4個包):
```json
"@trpc/client": "^10.45.0",
"@trpc/next": "^10.45.0",
"@trpc/react-query": "^10.45.0",
"@trpc/server": "^10.45.0"
```

**其他重要依賴**:
- @tanstack/react-query
- @microsoft/microsoft-graph-client
- @azure/identity
- @azure/keyvault-secrets
- pg, pgvector
- 額外15個Radix UI組件包

---

## 11. 測試文件索引

### 11.1 單元測試 (Jest)

**位置**: `__tests__/` 或測試文件旁

| 測試類型 | 數量 | 範例 |
|---------|------|------|
| 安全測試 | 3 | rbac.test.ts, encryption.test.ts |
| 工作流測試 | 1 | workflow.test.ts |
| 監控測試 | 多個 | 各監控組件測試 |
| API測試 | 多個 | 中間件測試 |

### 11.2 E2E 測試 (Playwright)

**位置**: `e2e/` 或 `tests/e2e/`

| 測試場景 | 文件 |
|---------|------|
| 認證流程 | auth.spec.ts |
| 知識庫操作 | knowledge-base.spec.ts |
| 工作流程 | workflow.spec.ts |

### 11.3 整合測試

**位置**: `scripts/integration-tests.js`

5個整合測試場景，覆蓋不同數據庫和模組組合。

---

## 12. 監控配置完整索引

### 12.1 Prometheus 配置

**位置**: `00-monitoring/monitoring/prometheus.yml`

**內容**:
- Scrape 配置
- 指標收集間隔
- 目標配置

### 12.2 Grafana 配置

**位置**: `00-monitoring/monitoring/grafana/`

| 文件 | 用途 |
|------|------|
| provisioning/datasources/ | 數據源配置 |
| provisioning/dashboards/ | 儀表板自動加載 |
| dashboards/*.json | 4個預建儀表板 |

**4個儀表板**:
1. 應用性能監控
2. 資源使用監控
3. 業務指標監控
4. 告警概覽

### 12.3 Alertmanager 配置

**位置**: `00-monitoring/monitoring/alerts/`

**46個告警規則** (P1-P4嚴重級別):

| 嚴重級別 | 數量 | 範例 |
|---------|------|------|
| P1 (Critical) | 10 | 服務宕機、數據庫連接失敗 |
| P2 (High) | 15 | 高CPU使用率、慢查詢 |
| P3 (Medium) | 12 | 緩存命中率低 |
| P4 (Low) | 9 | 磁盤空間警告 |

---

## 📊 統計總結

### 模板項目規模

**當前實現** (~48%):
- 核心文件: ~15個
- 01-base/ 文件: ~50個
- 已提取模組: 15個 (代碼量: ~38,000行) **+1 模組**
- 監控系統: 17個文件 (2,776行)
- Security & RBAC: 19個文件 (2,900+行) ⭐ **Day 35-36 新增**
- 基礎UI組件: 23個 (~1,600行)
- 測試: 190+ 測試案例 (85% 覆蓋率)
- 文檔: 60+ 個
- 示例數據: 10+ 個文件

**源項目完整規模** (100%):
- 總代碼行數: 159,215行
- 生產文件: 476個
- 功能模組: 27個
- UI組件: 114個
- Prisma模型: 34個
- API端點: 82個
- 測試: 120+

### 完成度

- **整體完成度**: ~48% **+3%**
- **已實現**: 15模組 + 23組件 + 5模型 + 190+測試
- **待補充**: 12模組 + 91組件 + 29模型

---

## 📖 下一步

1. 📘 閱讀 TEMPLATE-DEVELOPMENT-GUIDE.md - 了解開發規則
2. 📊 查看 TEMPLATE-GAP-ANALYSIS-REPORT.md - 了解差距
3. 🔍 使用本索引查找具體文件
4. 🚀 運行 `node init-project.js` - 創建新項目

---

## 🔗 相關文檔

- [TEMPLATE-DEVELOPMENT-GUIDE.md](TEMPLATE-DEVELOPMENT-GUIDE.md) - AI助手快速參考
- [PROJECT-INDEX.md](PROJECT-INDEX.md) - 高層次導航
- [TEMPLATE-GAP-ANALYSIS-REPORT.md](Docs/TEMPLATE-GAP-ANALYSIS-REPORT.md) - 完整差距分析
- [SOURCE-PROJECT-VERIFICATION.md](Docs/SOURCE-PROJECT-VERIFICATION.md) - 100%驗證報告
- [README.md](README.md) - 項目介紹

---

**版本**: 5.0-alpha | **最後更新**: 2025-10-09 | **狀態**: ⚠️ 部分實現 (~45%)

**重要提醒**: 本索引準確反映了當前模板的實現狀況。在使用模板前，請務必閱讀差距分析報告了解詳細的缺失功能。

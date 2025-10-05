# 🎯 Web App 初始化模板 - v5.0 最終修訂版
# AI Web App Template - Final Revision v5.0

**版本**: 5.0 (基於明確需求的最終版本)
**日期**: 2025-01-10 (計劃) / 2025-10-05 (實施)
**狀態**: ✅ 需求已100%確認 → 🔄 實施中
**GitHub**: https://github.com/laitim2001/ai-webapp-template.git

### 🔖 重要文檔參考

在執行本計劃時，請同時參考以下文檔：

1. **📍 SOURCE-SNAPSHOT.md** - 源項目基線快照信息
   - 記錄了源項目的固定 commit hash
   - 定義了"已完成功能"的判定標準
   - 說明了快照時間點策略

2. **📊 template-implementation-log.md** - 實施進度記錄
   - 詳細記錄每天的完成任務
   - 統計已創建的文件和代碼行數
   - 追蹤待完成任務和遇到的問題

**AI助手恢復工作流程**:
- 讀取本文件 (TEMPLATE-CREATION-FINAL-v5.md) 了解整體計劃
- 讀取 SOURCE-SNAPSHOT.md 了解源項目基線和提取標準
- 讀取 template-implementation-log.md 了解當前進度
- 從進度記錄的下一個待完成任務開始繼續執行

---

## 📋 需求確認總結

基於5次深度分析和明確確認，本模板將實現：

| 需求項目 | 確認結果 | 實施策略 |
|---------|---------|---------|
| **功能範圍** | 只包含已完成部分 | 排除開發中功能，只提取生產級代碼 |
| **UI一致性** | 100%一致（架構+風格+理念） | 提取完整設計系統，保留所有動畫 |
| **技術棧** | 完全相同 | 鎖定所有依賴版本，支持未來擴展 |
| **BMad文件** | 不包含 | 排除`.bmad-core/`和`web-bundles/` |
| **環境配置** | CLI自動配置 | 智能詢問並生成配置 |
| **數據庫選項** | 支持替代方案 | PostgreSQL/MySQL/MongoDB/SQLite |
| **示例數據** | 包含種子數據 | 提供完整的示例數據集 |
| **文檔結構** | 保留格式+範例 | 清空內容但保留結構和範例 |
| **動畫效果** | 完全一致 | 提取所有CSS動畫和過渡 |

---

## 🏗️ 模板架構（基於確認需求）

### 核心原則
1. **零BMad依賴** - 完全獨立運行
2. **數據庫靈活性** - 支持4種數據庫
3. **CLI智能配置** - 自動詢問並配置環境
4. **完整文檔範例** - 保留結構+1-2個範例記錄
5. **UI完全一致** - 設計系統完整提取

---

## 📦 模板結構總覽

```
ai-webapp-template/
├── 📁 00-monitoring/              # 監控系統（7,000+行）
├── 📁 01-base/                    # 基礎設施（支持4種數據庫）
├── 📁 02-modules/                 # 14個功能模組（只包含已完成）
├── 📁 03-toolchain/               # 開發工具鏈（含範例）
├── 📁 04-ui-design-system/        # 🆕 完整UI設計系統
├── 📁 scripts/                    # 智能CLI工具
└── 📁 examples/                   # 🆕 示例數據和範例記錄
```

---

## 🆕 第一層：00-monitoring/ (與v4.0相同)

> 保持不變，7,000+行監控系統

---

## 🆕 第二層：01-base/ (增強數據庫支持)

### 1.1 多數據庫支持策略

```
01-base/
├── prisma/
│   ├── schema.prisma.template                 # PostgreSQL (預設)
│   ├── schema-mysql.prisma.template           # MySQL變體
│   ├── schema-mongodb.prisma.template         # MongoDB變體  
│   ├── schema-sqlite.prisma.template          # SQLite變體
│   └── seed.ts.template                       # 種子數據腳本
├── lib/db/
│   ├── prisma-client.ts.template              # Prisma客戶端
│   ├── connection-pool.ts.template            # 連接池管理
│   └── database-adapter.ts.template           # 🆕 數據庫適配器層
├── package.json.template                      # 基礎依賴
├── package-postgresql.json                    # PostgreSQL專用依賴
├── package-mysql.json                         # MySQL專用依賴
├── package-mongodb.json                       # MongoDB專用依賴
└── package-sqlite.json                        # SQLite專用依賴
```

### 1.2 數據庫適配器設計

```typescript
// lib/db/database-adapter.ts.template
/**
 * 數據庫適配器層
 * 
 * 提供統一的數據庫操作接口，支持多種數據庫後端。
 * 讓模組代碼保持數據庫無關性。
 */

export interface DatabaseAdapter {
  // CRUD操作
  findUnique<T>(model: string, where: any): Promise<T | null>;
  findMany<T>(model: string, options: any): Promise<T[]>;
  create<T>(model: string, data: any): Promise<T>;
  update<T>(model: string, where: any, data: any): Promise<T>;
  delete<T>(model: string, where: any): Promise<T>;
  
  // 事務支持
  transaction<T>(callback: (tx: any) => Promise<T>): Promise<T>;
  
  // 原始查詢（用於複雜場景）
  raw<T>(query: string, params?: any[]): Promise<T>;
}

// PostgreSQL實現
export class PostgreSQLAdapter implements DatabaseAdapter {
  // ... 使用Prisma實現
}

// MongoDB實現
export class MongoDBAdapter implements DatabaseAdapter {
  // ... 使用Mongoose或Prisma MongoDB實現
}

// MySQL實現
export class MySQLAdapter implements DatabaseAdapter {
  // ... 使用Prisma實現
}

// SQLite實現
export class SQLiteAdapter implements DatabaseAdapter {
  // ... 使用Prisma實現
}

// 工廠函數
export function createDatabaseAdapter(
  type: 'postgresql' | 'mysql' | 'mongodb' | 'sqlite'
): DatabaseAdapter {
  switch (type) {
    case 'postgresql':
      return new PostgreSQLAdapter();
    case 'mysql':
      return new MySQLAdapter();
    case 'mongodb':
      return new MongoDBAdapter();
    case 'sqlite':
      return new SQLiteAdapter();
    default:
      throw new Error(`Unsupported database type: ${type}`);
  }
}
```

---

## 🆕 第三層：04-ui-design-system/ (完整UI系統)

### 設計系統結構

```
04-ui-design-system/
├── 📄 DESIGN-SYSTEM-GUIDE.md.template         # 設計系統完整指南
├── 📁 colors/
│   ├── colors.css.template                    # CSS變數定義
│   ├── colors.ts.template                     # TypeScript色彩常量
│   └── tailwind-colors.js.template            # Tailwind配置
├── 📁 typography/
│   ├── fonts.css.template                     # 字體定義
│   ├── typography.css.template                # 排版樣式
│   └── text-styles.ts.template                # TypeScript樣式常量
├── 📁 spacing/
│   ├── spacing.css.template                   # 間距系統（8px網格）
│   └── spacing.ts.template                    # TypeScript間距常量
├── 📁 animations/
│   ├── transitions.css.template               # 過渡動畫
│   ├── keyframes.css.template                 # 關鍵幀動畫
│   └── micro-interactions.css.template        # 微交互動畫
├── 📁 components/
│   └── ... (20+ UI組件，完整提取)
└── 📁 examples/
    ├── color-palette.html                     # 色彩範例頁
    ├── typography-showcase.html               # 排版展示頁
    └── animation-demo.html                    # 動畫演示頁
```

### 完整色彩系統提取

```css
/* colors/colors.css.template */
/**
 * 色彩系統 - 完整提取自當前項目
 * 來源: docs/front-end-spec.md
 */

:root {
  /* ===== 主色彩 (Primary) ===== */
  --color-primary: #0052CC;
  --color-primary-hover: #0747A6;
  --color-primary-active: #05389E;
  --color-primary-light: #4C9AFF;
  --color-primary-lighter: #B3D4FF;
  
  /* ===== 輔色 (Secondary) ===== */
  --color-secondary: #4A4A4A;
  --color-secondary-hover: #333333;
  --color-secondary-light: #6B6B6B;
  --color-secondary-lighter: #9E9E9E;
  
  /* ===== 強調色 (Accent) ===== */
  --color-accent: #FFAB00;
  --color-accent-hover: #FF991F;
  --color-accent-light: #FFC400;
  --color-accent-lighter: #FFE380;
  
  /* ===== 語義化顏色 ===== */
  --color-success: #36B37E;
  --color-success-light: #79F2C0;
  --color-warning: #FFC400;
  --color-warning-light: #FFE380;
  --color-error: #DE350B;
  --color-error-light: #FF8F73;
  --color-info: #0065FF;
  --color-info-light: #4C9AFF;
  
  /* ===== 中性色階 (Neutral) ===== */
  --color-neutral-50: #FAFBFC;
  --color-neutral-100: #F4F5F7;
  --color-neutral-200: #EBECF0;
  --color-neutral-300: #DFE1E6;
  --color-neutral-400: #C1C7D0;
  --color-neutral-500: #B3BAC5;
  --color-neutral-600: #8993A4;
  --color-neutral-700: #6B778C;
  --color-neutral-800: #5E6C84;
  --color-neutral-900: #172B4D;
  
  /* ===== 背景色 ===== */
  --color-bg-primary: #FFFFFF;
  --color-bg-secondary: #FAFBFC;
  --color-bg-tertiary: #F4F5F7;
  --color-bg-overlay: rgba(9, 30, 66, 0.54);
  
  /* ===== 文字顏色 ===== */
  --color-text-primary: #172B4D;
  --color-text-secondary: #5E6C84;
  --color-text-tertiary: #8993A4;
  --color-text-inverse: #FFFFFF;
  --color-text-link: #0052CC;
  --color-text-link-hover: #0747A6;
  
  /* ===== 邊框顏色 ===== */
  --color-border-primary: #DFE1E6;
  --color-border-secondary: #EBECF0;
  --color-border-focus: #4C9AFF;
  
  /* ===== 陰影 ===== */
  --shadow-small: 0px 1px 2px rgba(0, 0, 0, 0.08);
  --shadow-medium: 0px 2px 4px rgba(0, 0, 0, 0.12);
  --shadow-large: 0px 4px 8px rgba(0, 0, 0, 0.16);
  --shadow-xlarge: 0px 8px 16px rgba(0, 0, 0, 0.20);
  --shadow-hover: 0px 4px 8px rgba(0, 0, 0, 0.1);
}
```

### 完整動畫系統提取

```css
/* animations/transitions.css.template */
/**
 * 過渡動畫系統
 * 來源: 當前項目的全局樣式
 * 
 * 設計原則:
 * - 所有動畫時長基於 Bezier 曲線
 * - 使用 ease-out 用於進入動畫
 * - 使用 ease-in 用於退出動畫
 * - 使用 ease-in-out 用於雙向動畫
 */

:root {
  /* ===== 動畫時長 ===== */
  --duration-instant: 50ms;
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --duration-slower: 400ms;
  
  /* ===== 緩動函數 ===== */
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* ===== 通用過渡類 ===== */
.transition-all {
  transition: all var(--duration-normal) var(--ease-out);
}

.transition-colors {
  transition: color var(--duration-fast) var(--ease-out),
              background-color var(--duration-fast) var(--ease-out),
              border-color var(--duration-fast) var(--ease-out);
}

.transition-transform {
  transition: transform var(--duration-normal) var(--ease-out);
}

.transition-opacity {
  transition: opacity var(--duration-fast) var(--ease-out);
}

.transition-shadow {
  transition: box-shadow var(--duration-normal) var(--ease-out);
}

/* ===== 按鈕懸浮效果 ===== */
.btn-hover-effect {
  transition: all var(--duration-fast) var(--ease-out);
}

.btn-hover-effect:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-hover);
}

.btn-hover-effect:active {
  transform: translateY(0);
  box-shadow: var(--shadow-small);
}

/* ===== 卡片懸浮效果 ===== */
.card-hover {
  transition: all var(--duration-normal) var(--ease-out);
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-large);
}

/* ===== 淡入淡出 ===== */
.fade-enter {
  opacity: 0;
}

.fade-enter-active {
  opacity: 1;
  transition: opacity var(--duration-normal) var(--ease-out);
}

.fade-exit {
  opacity: 1;
}

.fade-exit-active {
  opacity: 0;
  transition: opacity var(--duration-fast) var(--ease-in);
}

/* ===== 滑入滑出 ===== */
.slide-enter {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-enter-active {
  transform: translateX(0);
  opacity: 1;
  transition: transform var(--duration-normal) var(--ease-out),
              opacity var(--duration-normal) var(--ease-out);
}

/* ===== 彈跳效果 ===== */
.bounce-enter-active {
  animation: bounce-in var(--duration-slower) var(--ease-bounce);
}

@keyframes bounce-in {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
```

```css
/* animations/keyframes.css.template */
/**
 * 關鍵幀動畫
 * 來源: 當前項目的所有動畫效果
 */

/* ===== 加載動畫 ===== */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* ===== Skeleton Screen 動畫 ===== */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.skeleton {
  animation: shimmer 2s infinite linear;
  background: linear-gradient(
    90deg,
    var(--color-neutral-200) 0%,
    var(--color-neutral-100) 50%,
    var(--color-neutral-200) 100%
  );
  background-size: 1000px 100%;
}

/* ===== 進度條動畫 ===== */
@keyframes progress {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* ===== 通知滑入動畫 ===== */
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

/* ===== AI思考動畫（神經元脈衝）===== */
@keyframes neuralPulse {
  0%, 100% {
    box-shadow: 0 0 0 0 var(--color-accent);
    opacity: 1;
  }
  50% {
    box-shadow: 0 0 0 10px transparent;
    opacity: 0.8;
  }
}

.ai-thinking {
  animation: neuralPulse 2s ease-in-out infinite;
}

/* ===== 成功動畫（打勾）===== */
@keyframes checkmark {
  0% {
    stroke-dashoffset: 100;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

.success-checkmark {
  stroke-dasharray: 100;
  animation: checkmark 0.5s ease-out forwards;
}
```

---

## 🆕 examples/ 目錄（示例數據和範例記錄）

```
examples/
├── 📁 seed-data/                          # 種子數據
│   ├── users.json                         # 示例用戶（5個）
│   ├── knowledge-items.json               # 示例知識庫條目（20個）
│   ├── proposals.json                     # 示例提案（10個）
│   └── README.md                          # 種子數據說明
├── 📁 sample-logs/                        # 範例日誌記錄
│   ├── DEVELOPMENT-LOG-sample.md          # 1-2個開發記錄範例
│   ├── FIXLOG-sample.md                   # 1-2個修復記錄範例
│   └── README.md                          # 如何使用範例
└── 📁 ui-screenshots/                     # 🆕 UI截圖參考
    ├── dashboard.png                      # 儀表板截圖
    ├── knowledge-base-list.png            # 知識庫列表
    ├── search-interface.png               # 搜索界面
    ├── login-page.png                     # 登入頁面
    └── README.md                          # UI參考說明
```

### 種子數據範例

```json
// examples/seed-data/users.json
[
  {
    "email": "admin@example.com",
    "name": "系統管理員",
    "role": "ADMIN",
    "password": "hashed_password_here"
  },
  {
    "email": "sales.manager@example.com",
    "name": "銷售經理",
    "role": "SALES_MANAGER",
    "password": "hashed_password_here"
  },
  {
    "email": "sales.rep@example.com",
    "name": "銷售代表",
    "role": "SALES_REP",
    "password": "hashed_password_here"
  },
  {
    "email": "user1@example.com",
    "name": "一般用戶1",
    "role": "USER",
    "password": "hashed_password_here"
  },
  {
    "email": "user2@example.com",
    "name": "一般用戶2",
    "role": "USER",
    "password": "hashed_password_here"
  }
]
```

### 範例日誌記錄

```markdown
<!-- examples/sample-logs/DEVELOPMENT-LOG-sample.md -->

# 📝 開發日誌

> **使用說明**: 
> 本文件展示如何正確記錄開發活動。請保持最新記錄在最上面的格式。
> 詳細指南請參考 AI-ASSISTANT-GUIDE.md

---

## 📅 2025-01-15 (範例記錄 2)

### ✅ 完成項目

#### 1. 實現知識庫搜索功能優化

**背景**: 
用戶反饋搜索結果相關性不足，需要優化搜索算法。

**實現內容**:
- 升級向量搜索算法，引入混合搜索策略
- 新增 6 維度智能評分系統
- 實現搜索結果上下文增強

**技術細節**:
```typescript
// lib/search/result-ranker.ts
export function rankResults(results: SearchResult[]): RankedResult[] {
  return results.map(result => ({
    ...result,
    score: calculateScore(result, {
      similarity: 0.4,      // 相似度權重
      recency: 0.2,         // 時間權重
      popularity: 0.15,     // 熱度權重
      userPreference: 0.15, // 用戶偏好權重
      category: 0.05,       // 分類權重
      author: 0.05          // 作者權重
    })
  }));
}
```

**代碼變更**:
- 新增: `lib/search/result-ranker.ts` (350 行)
- 修改: `lib/search/vector-search.ts` (+120 行)
- 測試: `__tests__/lib/search/result-ranker.test.ts` (150 行)

**測試結果**:
- ✅ 單元測試: 15/15 通過
- ✅ 整合測試: 8/8 通過
- ✅ 搜索相關性提升: 35%

**相關文檔**:
- 更新 `docs/search-optimization-guide.md`
- 更新 PROJECT-INDEX.md (新增搜索模組條目)

---

## 📅 2025-01-10 (範例記錄 1)

### ✅ 完成項目

#### 1. 建立專案基礎架構

**實現內容**:
- 初始化 Next.js 14 專案結構
- 配置 TypeScript 和 ESLint
- 建立基礎認證系統

**代碼變更**:
- 新增: 完整專案結構
- 新增: 認證相關 API 路由
- 新增: 基礎 UI 組件

**測試結果**:
- ✅ 專案能正常啟動
- ✅ 基礎認證流程測試通過

---

> **💡 提示**: 記錄開發日誌時請保持格式一致，包含背景、實現內容、技術細節、代碼變更和測試結果。
```

---

## 🚀 智能CLI工具（v5.0 增強版）

### CLI功能增強

```javascript
// scripts/init-project.js (v5.0 增強版)

async function initProject() {
  console.log(chalk.bold.cyan('\n🚀 AI Web App Template Initializer v5.0\n'));
  
  // ===== Step 1: 項目基本信息 =====
  const projectInfo = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: '項目名稱:',
      validate: (input) => /^[a-z0-9-]+$/.test(input),
    },
    {
      type: 'input',
      name: 'description',
      message: '項目描述:',
    },
  ]);

  // ===== Step 2: 數據庫選擇（支持4種）=====
  console.log(chalk.bold.yellow('\n📦 數據庫配置\n'));
  const database = await inquirer.prompt([
    {
      type: 'list',
      name: 'type',
      message: '選擇數據庫:',
      choices: [
        { name: 'PostgreSQL (推薦，功能最完整)', value: 'postgresql' },
        { name: 'MySQL (廣泛使用)', value: 'mysql' },
        { name: 'MongoDB (NoSQL)', value: 'mongodb' },
        { name: 'SQLite (輕量級，開發用)', value: 'sqlite' },
      ],
      default: 'postgresql',
    },
    {
      type: 'confirm',
      name: 'autoConfig',
      message: '是否自動配置數據庫連接？',
      default: true,
    },
    {
      type: 'input',
      name: 'host',
      message: '數據庫主機:',
      default: 'localhost',
      when: (answers) => answers.autoConfig && answers.type !== 'sqlite',
    },
    {
      type: 'input',
      name: 'port',
      message: '數據庫端口:',
      default: (answers) => {
        switch (answers.type) {
          case 'postgresql': return '5432';
          case 'mysql': return '3306';
          case 'mongodb': return '27017';
          default: return '5432';
        }
      },
      when: (answers) => answers.autoConfig && answers.type !== 'sqlite',
    },
    {
      type: 'input',
      name: 'username',
      message: '數據庫用戶名:',
      default: 'postgres',
      when: (answers) => answers.autoConfig && answers.type !== 'sqlite',
    },
    {
      type: 'password',
      name: 'password',
      message: '數據庫密碼:',
      when: (answers) => answers.autoConfig && answers.type !== 'sqlite',
    },
    {
      type: 'input',
      name: 'database',
      message: '數據庫名稱:',
      default: (answers) => projectInfo.projectName.replace(/-/g, '_'),
      when: (answers) => answers.autoConfig && answers.type !== 'sqlite',
    },
  ]);

  // ===== Step 3: 監控配置 =====
  const monitoring = await configureMonitoring();

  // ===== Step 4: 功能模組選擇 =====
  const modules = await selectModules();

  // ===== Step 5: 開發工具鏈 =====
  const toolchain = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'tools',
      message: '選擇開發工具鏈:',
      choices: [
        { name: '📖 文檔系統 (含範例記錄)', value: 'docs', checked: true },
        { name: '🧪 測試框架 (120+ 測試)', value: 'testing', checked: true },
        { name: '🐳 Docker 部署配置', value: 'deployment', checked: true },
      ],
    },
    {
      type: 'confirm',
      name: 'includeSampleLogs',
      message: '是否包含範例日誌記錄？(推薦新手)',
      default: true,
      when: (answers) => answers.tools.includes('docs'),
    },
  ]);

  // ===== Step 6: 示例數據 =====
  const seedData = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'includeSeedData',
      message: '是否包含示例數據？(5個用戶 + 20個知識庫條目)',
      default: true,
    },
  ]);

  // ===== Step 7: UI截圖參考 =====
  const uiReference = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'includeScreenshots',
      message: '是否包含原項目UI截圖作為參考？',
      default: true,
    },
  ]);

  // ===== Step 8: 生成項目 =====
  console.log(chalk.bold.green('\n📦 正在生成項目...\n'));
  
  const spinner = ora('初始化項目結構...').start();
  
  try {
    // 8.1 複製基礎結構
    await copyBaseTemplate(projectInfo);
    spinner.succeed('基礎結構已創建');
    
    // 8.2 配置數據庫
    spinner.start('配置數據庫...');
    await configurDatabase(database, projectInfo);
    spinner.succeed(`${database.type} 數據庫配置完成`);
    
    // 8.3 安裝監控系統
    if (monitoring.enableMonitoring) {
      spinner.start('安裝監控系統...');
      await installMonitoring(monitoring, projectInfo);
      spinner.succeed('監控系統安裝完成');
    }
    
    // 8.4 安裝功能模組
    for (const module of modules.selected) {
      spinner.start(`安裝 ${module} 模組...`);
      await installModuleWithDbAdapter(module, database.type, projectInfo);
      spinner.succeed(`${module} 模組安裝完成`);
    }
    
    // 8.5 安裝工具鏈
    for (const tool of toolchain.tools) {
      spinner.start(`安裝 ${tool} 工具鏈...`);
      await installToolchain(tool, projectInfo);
      spinner.succeed(`${tool} 工具鏈安裝完成`);
    }
    
    // 8.6 安裝UI設計系統
    spinner.start('配置 UI 設計系統...');
    await installUIDesignSystem(projectInfo);
    spinner.succeed('UI 設計系統配置完成');
    
    // 8.7 安裝示例數據
    if (seedData.includeSeedData) {
      spinner.start('準備示例數據...');
      await copySeedData(projectInfo);
      spinner.succeed('示例數據已準備');
    }
    
    // 8.8 複製範例日誌
    if (toolchain.includeSampleLogs) {
      spinner.start('複製範例日誌記錄...');
      await copySampleLogs(projectInfo);
      spinner.succeed('範例日誌記錄已複製');
    }
    
    // 8.9 複製UI截圖
    if (uiReference.includeScreenshots) {
      spinner.start('複製 UI 截圖參考...');
      await copyUIScreenshots(projectInfo);
      spinner.succeed('UI 截圖參考已複製');
    }
    
    // 8.10 替換佔位符
    spinner.start('配置項目變數...');
    await replaceTemplateVars(projectInfo, database);
    spinner.succeed('項目變數配置完成');
    
    // 8.11 安裝依賴
    spinner.start('安裝 npm 依賴...');
    await installDependencies(database.type);
    spinner.succeed('npm 依賴安裝完成');
    
    // 8.12 初始化數據庫
    spinner.start('初始化數據庫...');
    await initializeDatabase(database.type);
    spinner.succeed('數據庫初始化完成');
    
    // 8.13 運行種子數據（如果選擇）
    if (seedData.includeSeedData) {
      spinner.start('載入示例數據...');
      await runSeedData();
      spinner.succeed('示例數據已載入');
    }
    
    // 8.14 生成動態文檔
    spinner.start('生成項目文檔...');
    await generateDynamicDocs(projectInfo, modules.selected, database.type);
    spinner.succeed('項目文檔生成完成');
    
  } catch (error) {
    spinner.fail('項目生成失敗');
    console.error(chalk.red('\n錯誤:'), error.message);
    process.exit(1);
  }

  // ===== Step 9: 完成總結 =====
  displayProjectSummary(projectInfo, database, modules, monitoring, seedData, uiReference);
}

// 顯示項目總結
function displayProjectSummary(projectInfo, database, modules, monitoring, seedData, uiReference) {
  console.log(chalk.bold.green('\n✅ 項目創建成功！\n'));
  
  // 項目統計
  const stats = getProjectStats(projectInfo, modules.selected);
  console.log(chalk.bold('📊 項目統計:'));
  console.log(`  • 數據庫: ${chalk.cyan(database.type)}`);
  console.log(`  • 代碼行數: ${chalk.cyan(stats.totalLines)} 行`);
  console.log(`  • 功能模組: ${chalk.cyan(modules.selected.length)} 個`);
  console.log(`  • UI 組件: ${chalk.cyan(stats.componentCount)} 個`);
  console.log(`  • API 端點: ${chalk.cyan(stats.apiEndpoints)} 個`);
  console.log(`  • 測試數量: ${chalk.cyan(stats.testCount)} 個`);
  if (seedData.includeSeedData) {
    console.log(`  • 示例用戶: ${chalk.cyan('5')} 個`);
    console.log(`  • 示例數據: ${chalk.cyan('30')} 條記錄`);
  }
  console.log();
  
  // 項目結構
  console.log(chalk.bold('📁 項目結構:'));
  console.log(`  ${projectInfo.projectName}/`);
  console.log('    ├── app/          # Next.js 應用');
  console.log('    ├── components/   # React 組件');
  console.log('    ├── lib/          # 核心邏輯');
  if (monitoring.enableMonitoring) {
    console.log('    ├── monitoring/   # ⭐ 監控配置');
  }
  console.log('    ├── docs/         # 項目文檔');
  if (seedData.includeSeedData) {
    console.log('    ├── examples/     # 示例數據和範例');
  }
  if (uiReference.includeScreenshots) {
    console.log('    └── ui-reference/ # UI 截圖參考');
  }
  console.log();
  
  // 啟動指引
  console.log(chalk.bold('🚀 下一步:'));
  console.log(chalk.cyan(`  cd ${projectInfo.projectName}\n`));
  
  if (database.type !== 'sqlite') {
    console.log(chalk.yellow('  # 確保數據庫服務已啟動'));
    console.log(chalk.gray(`  # ${database.type}: ${database.host}:${database.port}\n`));
  }
  
  if (monitoring.installMonitoringStack) {
    console.log(chalk.yellow('  # 啟動監控堆疊'));
    console.log(chalk.cyan('  docker-compose -f docker-compose.monitoring.yml up -d\n'));
  }
  
  console.log(chalk.yellow('  # 啟動開發服務器'));
  console.log(chalk.cyan('  npm run dev\n'));
  
  // 訪問信息
  console.log(chalk.bold('🌐 訪問地址:'));
  console.log(`  應用: ${chalk.cyan('http://localhost:3000')}`);
  if (seedData.includeSeedData) {
    console.log(`\n  ${chalk.bold('測試帳號')}:`);
    console.log(`  • 管理員: ${chalk.cyan('admin@example.com')} / ${chalk.gray('admin123')}`);
    console.log(`  • 銷售經理: ${chalk.cyan('sales.manager@example.com')} / ${chalk.gray('manager123')}`);
    console.log(`  • 銷售代表: ${chalk.cyan('sales.rep@example.com')} / ${chalk.gray('rep123')}`);
  }
  console.log();
  
  // 監控儀表板
  if (monitoring.installMonitoringStack) {
    console.log(chalk.bold('📊 監控儀表板:'));
    console.log(`  Prometheus: ${chalk.cyan('http://localhost:9090')}`);
    console.log(`  Grafana:    ${chalk.cyan('http://localhost:3001')} (admin/admin)`);
    console.log(`  Jaeger:     ${chalk.cyan('http://localhost:16686')}`);
    console.log(`  Metrics:    ${chalk.cyan('http://localhost:9464/metrics')}\n`);
  }
  
  // 文檔鏈接
  console.log(chalk.bold('📖 文檔:'));
  console.log('  README:     ./README.md');
  console.log('  AI助手指南: ./AI-ASSISTANT-GUIDE.md');
  console.log('  項目索引:   ./PROJECT-INDEX.md');
  if (monitoring.enableMonitoring) {
    console.log('  監控手冊:   ./docs/monitoring-operations-manual.md');
  }
  if (seedData.includeSeedData) {
    console.log('  示例數據:   ./examples/seed-data/README.md');
  }
  if (uiReference.includeScreenshots) {
    console.log('  UI 參考:    ./examples/ui-screenshots/README.md');
  }
  console.log();
  
  // 下一步建議
  console.log(chalk.bold('💡 建議:'));
  console.log('  1. 閱讀 AI-ASSISTANT-GUIDE.md 了解開發流程');
  console.log('  2. 查看 PROJECT-INDEX.md 了解項目結構');
  if (uiReference.includeScreenshots) {
    console.log('  3. 參考 examples/ui-screenshots/ 確保 UI 一致性');
  }
  console.log();
  
  console.log(chalk.bold.green('🎉 項目已準備就緒！\n'));
}
```

---

## 📊 完整實施計劃（5週 - v5.0調整版）

### Week 1: 基礎設施與數據庫適配層

**Day 1-2: 數據庫適配器開發**
- [ ] 設計數據庫適配器接口
- [ ] 實現 PostgreSQL 適配器
- [ ] 實現 MySQL 適配器
- [ ] 實現 MongoDB 適配器
- [ ] 實現 SQLite 適配器
- [ ] **驗證**: 每種數據庫都能正常CRUD操作

**Day 3: 監控系統提取**
- [ ] 提取監控核心代碼（7,000+行）
- [ ] 提取 Docker 監控堆疊配置
- [ ] **驗證**: 監控系統能否正常工作

**Day 4-5: 基礎設施模板**
- [ ] 提取完整 package.json（4種數據庫變體）
- [ ] 提取配置文件
- [ ] 提取 Prisma Schema（4種變體）
- [ ] **驗證**: 每種數據庫配置都能啟動

### Week 2: P0核心模組（含數據庫適配）

**Day 6-7: 認證系統模組**
- [ ] 提取認證核心邏輯
- [ ] **修改**: 使用數據庫適配器替代直接Prisma調用
- [ ] 測試4種數據庫的認證流程
- [ ] **驗證**: 每種數據庫的認證都正常

**Day 8-9: API Gateway模組**
- [ ] 提取10個中間件
- [ ] 保持數據庫無關性
- [ ] **驗證**: API Gateway正常工作

**Day 10: 整合測試**
- [ ] 測試PostgreSQL配置
- [ ] 測試MySQL配置
- [ ] 測試MongoDB配置
- [ ] 測試SQLite配置
- [ ] **驗證**: 所有數據庫配置都能正常工作

### Week 3: P1模組與UI系統

**Day 11-13: 核心功能模組**
- [ ] 提取知識庫模組（使用適配器）
- [ ] 提取搜索引擎模組
- [ ] 提取AI整合模組
- [ ] 提取工作流程引擎
- [ ] **驗證**: 所有模組在不同數據庫上都能工作

**Day 14-15: UI設計系統完整提取**
- [ ] 提取完整色彩系統
- [ ] 提取完整動畫系統
- [ ] 提取所有UI組件（20+個）
- [ ] **截圖**: 記錄所有頁面的當前視覺效果
- [ ] **驗證**: UI效果100%一致

### Week 4: 輔助模組與示例數據

**Day 16-17: 通知、緩存等模組**
- [ ] 提取通知系統
- [ ] 提取緩存系統
- [ ] 提取其他P1和P2模組
- [ ] **驗證**: 所有模組正常工作

**Day 18-19: 示例數據和範例記錄**
- [ ] 創建種子數據（5個用戶+30條記錄）
- [ ] 創建範例日誌記錄（1-2個範例）
- [ ] 創建UI截圖參考
- [ ] **驗證**: 種子數據能正確載入

**Day 20: 測試框架**
- [ ] 提取120+測試
- [ ] 適配多數據庫測試
- [ ] **驗證**: 測試在所有數據庫上通過

### Week 5: 工具鏈與最終整合

**Day 21-22: 智能CLI工具開發**
- [ ] 實現數據庫選擇和配置
- [ ] 實現自動環境變數生成
- [ ] 實現模組安裝邏輯
- [ ] 實現範例數據載入
- [ ] **驗證**: CLI完整流程正常

**Day 23-24: 整合測試（4種數據庫 x 3種配置）**
- [ ] PostgreSQL - 最小配置
- [ ] PostgreSQL - 標準配置
- [ ] PostgreSQL - 完整配置
- [ ] MySQL - 標準配置
- [ ] MongoDB - 標準配置
- [ ] SQLite - 最小配置
- [ ] **驗證**: 所有組合都能正常工作

**Day 25: UI一致性驗證**
- [ ] 對比截圖，確保UI 100%一致
- [ ] 驗證所有動畫效果
- [ ] 驗證響應式佈局
- [ ] **驗證**: UI完全一致

**Day 26-27: 文檔與發布**
- [ ] 編寫完整README
- [ ] 編寫數據庫切換指南
- [ ] 編寫模組文檔
- [ ] 推送到GitHub
- [ ] 創建Release
- [ ] **驗證**: 其他人能成功使用

---

## 🎯 最終交付物檢查表（v5.0版）

### 代碼可運行性 ✅
- [ ] PostgreSQL配置能正常啟動
- [ ] MySQL配置能正常啟動
- [ ] MongoDB配置能正常啟動
- [ ] SQLite配置能正常啟動
- [ ] 所有模組在不同數據庫上都能工作
- [ ] 數據庫適配器正確抽象差異

### UI/UX完全一致性 ✅
- [ ] 色彩系統100%一致（已提取所有CSS變數）
- [ ] 20+組件樣式100%一致
- [ ] 所有動畫效果完全一致
- [ ] 過渡效果完全一致
- [ ] 響應式佈局完全一致
- [ ] 微交互完全一致
- [ ] **有UI截圖作為對比參考**

### 數據庫靈活性 ✅
- [ ] PostgreSQL完全支持（預設）
- [ ] MySQL完全支持
- [ ] MongoDB完全支持
- [ ] SQLite完全支持
- [ ] CLI能智能配置數據庫
- [ ] 數據庫適配器正確運作
- [ ] 所有模組對數據庫類型透明

### 示例數據 ✅
- [ ] 包含5個示例用戶
- [ ] 包含20個知識庫條目
- [ ] 包含10個提案範例
- [ ] 種子數據腳本正常工作
- [ ] CLI能自動載入種子數據

### 範例記錄 ✅
- [ ] 包含1-2個開發日誌範例
- [ ] 包含1-2個修復記錄範例
- [ ] 範例清楚展示記錄格式
- [ ] 文檔結構完整保留
- [ ] AI-ASSISTANT-GUIDE完整保留

### CLI工具智能化 ✅
- [ ] 能智能詢問數據庫配置
- [ ] 能自動生成環境變數
- [ ] 能自動配置數據庫連接
- [ ] 能選擇性載入示例數據
- [ ] 能選擇性包含範例記錄
- [ ] 能選擇性包含UI截圖參考

### 監控系統 ✅
- [ ] OpenTelemetry完整提取
- [ ] 46條告警規則完整
- [ ] 4個Grafana儀表板完整
- [ ] Docker監控堆疊正常

### 不包含BMad ✅
- [ ] 完全不包含`.bmad-core/`
- [ ] 完全不包含`web-bundles/`
- [ ] 模板完全獨立運行
- [ ] 不依賴任何BMad工具

---

## 📦 GitHub儲存庫結構（v5.0最終版）

```
ai-webapp-template/
├── 📁 00-monitoring/              # 監控系統（7,000+行）
├── 📁 01-base/                    # 基礎設施（支持4種數據庫）
│   ├── prisma/
│   │   ├── schema.prisma.template              # PostgreSQL
│   │   ├── schema-mysql.prisma.template        # MySQL
│   │   ├── schema-mongodb.prisma.template      # MongoDB
│   │   └── schema-sqlite.prisma.template       # SQLite
│   ├── lib/db/
│   │   ├── database-adapter.ts.template        # 🆕 適配器層
│   │   └── ... (4種實現)
│   ├── package.json.template
│   └── package-{db}.json (4種變體)
├── 📁 02-modules/                 # 14個功能模組（已完成部分）
│   └── ... (所有模組使用適配器)
├── 📁 03-toolchain/               # 開發工具鏈
├── 📁 04-ui-design-system/        # 🆕 完整UI設計系統
│   ├── colors/                    # 完整色彩系統
│   ├── typography/                # 完整排版系統
│   ├── spacing/                   # 間距系統
│   ├── animations/                # 🆕 完整動畫系統
│   └── components/                # 20+個UI組件
├── 📁 examples/                   # 🆕 示例和範例
│   ├── seed-data/                 # 種子數據
│   ├── sample-logs/               # 範例日誌記錄
│   └── ui-screenshots/            # 🆕 UI截圖參考
├── 📁 scripts/                    # 智能CLI工具（v5.0）
│   ├── init-project.js            # 主CLI（支持數據庫選擇）
│   ├── configure-database.js      # 🆕 數據庫配置
│   ├── install-module.js          # 模組安裝（適配器版）
│   └── ... (其他工具)
├── 📄 README.md                   # 完整使用說明
├── 📄 DATABASE-GUIDE.md           # 🆕 數據庫切換指南
├── 📄 UI-CONSISTENCY-GUIDE.md     # 🆕 UI一致性指南
└── 📄 package.json                # CLI依賴
```

---

## ✅ v5.0 相比 v4.0 的關鍵改進

| 改進項目 | v4.0 | v5.0 ⭐ |
|---------|------|---------|
| **數據庫支持** | 僅PostgreSQL | ✅ **4種數據庫（PostgreSQL/MySQL/MongoDB/SQLite）** |
| **數據庫適配層** | ❌ | ✅ **統一適配器接口** |
| **UI一致性驗證** | 描述 | ✅ **包含截圖參考對比** |
| **動畫系統** | 簡要提及 | ✅ **完整提取（3個CSS文件）** |
| **示例數據** | ❌ | ✅ **5用戶+30條記錄** |
| **範例日誌** | ❌ | ✅ **1-2個完整範例** |
| **BMad文件** | 不明確 | ✅ **明確排除** |
| **CLI智能化** | 基礎 | ✅ **自動數據庫配置** |
| **環境變數** | 模板 | ✅ **CLI自動生成** |
| **UI設計系統** | 分散 | ✅ **獨立目錄完整組織** |

---

## 🎉 總結

**v5.0 是基於你明確需求的最終版本**，確保：

1. ✅ **只包含已完成功能** - 排除開發中部分
2. ✅ **UI 100%一致** - 完整設計系統+截圖參考+所有動畫
3. ✅ **技術棧完全相同** - 鎖定依賴版本
4. ✅ **支持4種數據庫** - 通過適配器層實現
5. ✅ **CLI智能配置** - 自動詢問並配置環境
6. ✅ **包含示例數據** - 5用戶+30條記錄
7. ✅ **包含範例日誌** - 1-2個完整範例
8. ✅ **零BMad依賴** - 完全獨立
9. ✅ **文檔結構保留** - 清空內容但保留格式

---

**這是最終版本，請檢查確認後我會立即開始實施！** 🚀


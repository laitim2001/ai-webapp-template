# 項目結構說明

## 📁 目錄結構

```
{{PROJECT_NAME}}/
├── app/                          # Next.js 14 App Router
│   ├── layout.tsx               # 根佈局
│   ├── page.tsx                 # 首頁
│   ├── loading.tsx              # 全局加載狀態
│   ├── error.tsx                # 全局錯誤處理
│   ├── not-found.tsx            # 404 頁面
│   ├── globals.css              # 全局樣式
│   ├── api/                     # API 路由
│   │   └── [...endpoints]/      # API 端點
│   ├── dashboard/               # 儀表板頁面
│   └── (auth)/                  # 認證相關頁面
│       ├── login/
│       └── register/
│
├── components/                   # React 組件
│   ├── ui/                      # UI 基礎組件
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── layout/                  # 佈局組件
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   └── footer.tsx
│   └── [feature]/               # 功能組件
│       └── ...
│
├── lib/                         # 核心工具庫
│   ├── db/                      # 數據庫適配器
│   │   ├── database-adapter.ts
│   │   ├── postgresql-adapter.ts
│   │   ├── mysql-adapter.ts
│   │   ├── mongodb-adapter.ts
│   │   └── sqlite-adapter.ts
│   ├── utils.ts                 # 通用工具函數
│   ├── auth.ts                  # 認證工具
│   └── [feature]/               # 功能相關工具
│       └── ...
│
├── types/                       # TypeScript 類型定義
│   └── index.ts                 # 全局類型
│
├── hooks/                       # 自定義 React Hooks
│   ├── use-auth.ts
│   ├── use-toast.ts
│   └── ...
│
├── prisma/                      # Prisma ORM
│   ├── schema.prisma            # 數據庫架構
│   ├── migrations/              # 數據庫遷移
│   └── seed.ts                  # 種子數據
│
├── public/                      # 靜態資源
│   ├── favicon.ico
│   ├── images/
│   └── ...
│
├── docs/                        # 項目文檔
│   ├── api-specification.md
│   ├── architecture.md
│   └── ...
│
├── scripts/                     # 腳本文件
│   └── ...
│
├── .gitignore                   # Git 忽略文件
├── .eslintrc.json              # ESLint 配置
├── next.config.js              # Next.js 配置
├── tsconfig.json               # TypeScript 配置
├── tailwind.config.js          # Tailwind CSS 配置
├── postcss.config.js           # PostCSS 配置
├── package.json                # 項目依賴
└── README.md                   # 項目說明
```

## 📋 目錄說明

### `app/` - 應用程序目錄
Next.js 14 App Router 的主要目錄，包含所有頁面和 API 路由。

- **`layout.tsx`**: 根佈局，包含全局配置
- **`page.tsx`**: 首頁組件
- **`loading.tsx`**: 路由加載狀態
- **`error.tsx`**: 錯誤邊界
- **`not-found.tsx`**: 404 頁面
- **`api/`**: API 路由端點
- **`dashboard/`**: 儀表板相關頁面
- **`(auth)/`**: 路由組，不影響 URL 路徑

### `components/` - 組件目錄
所有可重用的 React 組件。

- **`ui/`**: 基礎 UI 組件（按鈕、輸入框、卡片等）
- **`layout/`**: 佈局組件（頁眉、側邊欄、頁腳）
- **`[feature]/`**: 功能特定組件

### `lib/` - 工具庫目錄
核心工具函數和業務邏輯。

- **`db/`**: 數據庫適配器（支持 4 種數據庫）
- **`utils.ts`**: 通用工具函數
- **`auth.ts`**: 認證相關工具
- **`[feature]/`**: 功能特定工具

### `types/` - 類型定義目錄
TypeScript 類型和接口定義。

- **`index.ts`**: 全局類型、接口、枚舉

### `hooks/` - 自定義 Hooks 目錄
可重用的 React Hooks。

- **`use-auth.ts`**: 認證相關 Hook
- **`use-toast.ts`**: Toast 通知 Hook

### `prisma/` - 數據庫目錄
Prisma ORM 相關文件。

- **`schema.prisma`**: 數據庫模型定義
- **`migrations/`**: 數據庫遷移歷史
- **`seed.ts`**: 種子數據腳本

### `public/` - 靜態資源目錄
公開訪問的靜態文件。

- 圖片、圖標、字體等

### `docs/` - 文檔目錄
項目文檔和說明。

- API 規範、架構文檔、開發指南等

## 🔧 配置文件

| 文件 | 用途 |
|------|------|
| `next.config.js` | Next.js 配置（性能、安全、Webpack） |
| `tsconfig.json` | TypeScript 編譯配置 |
| `tailwind.config.js` | Tailwind CSS 設計系統配置 |
| `postcss.config.js` | CSS 處理器配置 |
| `.eslintrc.json` | ESLint 代碼檢查配置 |
| `package.json` | 項目依賴和腳本 |

## 🎨 設計系統

### 顏色系統
- 使用 CSS 變數定義顏色
- 支持深色模式
- 9 種語義顏色（primary, secondary, destructive 等）

### 動畫系統
- 20+ 預設動畫
- 包含淡入淡出、滑動、縮放、旋轉等

### 響應式斷點
- xs: 475px（小手機）
- sm: 640px（手機）
- md: 768px（平板）
- lg: 1024px（小筆電）
- xl: 1280px（桌面）
- 2xl: 1536px（大螢幕）

## 📦 核心依賴

### 框架
- Next.js 14 (App Router)
- React 18
- TypeScript 5

### UI/樣式
- Tailwind CSS 3
- Radix UI
- Lucide React Icons

### 數據庫
- Prisma ORM
- 支持 PostgreSQL、MySQL、MongoDB、SQLite

### 工具
- clsx / tailwind-merge（類名合併）
- date-fns（日期處理）
- zod（數據驗證）

## 🚀 開發命令

```bash
# 安裝依賴
npm install

# 初始化項目（交互式配置）
npm run init

# 開發模式
npm run dev

# 構建生產版本
npm run build

# 啟動生產服務器
npm start

# 代碼檢查
npm run lint

# 類型檢查
npm run type-check

# Prisma 相關
npm run db:generate    # 生成 Prisma Client
npm run db:migrate     # 運行數據庫遷移
npm run db:seed        # 填充種子數據
```

## 📝 命名規範

### 文件命名
- 組件文件：PascalCase（`Button.tsx`）
- 工具文件：kebab-case（`format-date.ts`）
- 頁面文件：kebab-case（`user-profile.tsx`）
- 類型文件：kebab-case（`user-types.ts`）

### 變數命名
- 常量：UPPER_SNAKE_CASE
- 變數/函數：camelCase
- 類型/接口：PascalCase
- 私有變數：以 `_` 開頭

## 🔒 環境變數

參見 `.env.example` 文件了解所需的環境變數。

關鍵變數：
- `DATABASE_URL` - 數據庫連接字符串
- `NEXTAUTH_SECRET` - 認證密鑰
- `NEXT_PUBLIC_APP_URL` - 應用程序 URL

## 📚 相關文檔

- [Next.js 文檔](https://nextjs.org/docs)
- [Tailwind CSS 文檔](https://tailwindcss.com/docs)
- [Prisma 文檔](https://www.prisma.io/docs)
- [TypeScript 文檔](https://www.typescriptlang.org/docs)


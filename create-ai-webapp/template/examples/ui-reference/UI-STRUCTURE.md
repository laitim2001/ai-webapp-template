# UI 結構分析

本文檔提供 AI Web App Template 的 UI 組件樹結構分析，幫助開發者快速理解頁面佈局和組件層次關係。

## 📋 目錄

- [根佈局結構](#根佈局結構)
- [首頁結構](#首頁結構)
- [儀表板結構](#儀表板結構)
- [認證頁面結構](#認證頁面結構)
- [UI 組件清單](#ui-組件清單)

---

## 根佈局結構

### app/layout.tsx - 應用程式根佈局

這是整個應用程式的最外層佈局，定義了 HTML 文檔結構和全域狀態管理。

```
html (lang="zh-TW")
├── head/
│   └── [元數據、SEO、圖示等]
│
└── body (Inter 字體)
    └── AuthProvider [認證狀態管理]
        └── {children} [子頁面內容]
```

**關鍵元素**:
- **語言設定**: `lang="zh-TW"` 支援繁體中文
- **字體配置**: Google Fonts Inter 字體
- **認證 Provider**: 全域認證狀態管理
- **元數據配置**: SEO、Open Graph、Twitter Cards

**元數據結構**:
```typescript
{
  title: {
    template: '%s | 應用程式名稱',
    default: '應用程式名稱'
  },
  description: '應用程式描述',
  keywords: ['關鍵字1', '關鍵字2'],
  robots: { index: true, follow: true },
  openGraph: { type: 'website', locale: 'zh_TW' },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/favicon.ico' }
}
```

---

## 首頁結構

### app/page.tsx - 應用程式首頁

提供品牌展示和功能介紹的歡迎頁面。

```
main (flex min-h-screen flex-col items-center justify-center p-24)
├── 頁面標題區塊
│   └── div (z-10 max-w-5xl w-full)
│       └── h1.text-4xl.font-bold
│           └── "應用程式名稱"
│
├── 視覺效果區塊
│   └── div (relative flex place-items-center)
│       ├── before 偽元素: 漸層背景圓形 (白色 → 透明)
│       ├── after 偽元素: 漸層背景圓錐形 (天空藍 → 藍色)
│       └── div.text-6xl
│           └── "🚀" [火箭圖示]
│
└── 功能介紹網格
    └── div (grid lg:grid-cols-4)
        ├── 功能卡片 1: CRM 整合
        │   ├── h2.text-2xl.font-semibold: "CRM Integration"
        │   └── p.text-sm.opacity-50: "整合描述"
        │
        ├── 功能卡片 2: AI 搜索
        │   ├── h2: "AI Search"
        │   └── p: "搜索描述"
        │
        ├── 功能卡片 3: 智能功能
        │   ├── h2: "Smart Feature"
        │   └── p: "功能描述"
        │
        └── 功能卡片 4: 數據分析
            ├── h2: "Analytics"
            └── p: "分析描述"
```

**設計模式**:
- **居中對稱佈局**: 使用 flexbox 垂直和水平居中
- **視覺層次**: z-index 控制元素層疊順序
- **響應式網格**: `lg:grid-cols-4` 大螢幕 4 欄，小螢幕單欄
- **懸停效果**: `hover:` 修飾符提供互動反饋

**關鍵 CSS 類別**:
- `flex min-h-screen` - 最小全螢幕高度的 flex 容器
- `before:` / `after:` - 偽元素漸層背景效果
- `transition-colors` - 顏色過渡動畫
- `dark:` - 暗色模式樣式變體

---

## 儀表板結構

### app/dashboard/page.tsx - 主儀表板頁面

提供核心業務數據總覽和快速操作入口的中心頁面。

```
div (space-y-8) [主容器，垂直間距 8]
│
├── 頁面標題區
│   └── div
│       ├── h1.text-2xl.font-bold: "儀表板"
│       └── p.text-sm.text-gray-600: "歡迎信息"
│
├── 統計卡片組件
│   └── <DashboardStats />
│       └── [4個統計卡片的網格佈局]
│
└── 主要內容網格
    └── div (grid lg:grid-cols-3 gap-8)
        │
        ├── 左側欄位 (lg:col-span-2) [2/3 寬度]
        │   └── div (space-y-8)
        │       ├── <SalesChart />
        │       │   └── [銷售趨勢圖表]
        │       │
        │       └── <RecentActivity />
        │           └── [最近活動列表]
        │
        └── 右側欄位 (1/3 寬度)
            └── div (space-y-8)
                ├── <QuickActions />
                │   └── [快速操作按鈕組]
                │
                ├── <AIInsights />
                │   └── [AI 洞察卡片]
                │
                └── <TopCustomers />
                    └── [重要客戶列表]
```

**佈局模式**:
- **三欄網格**: `lg:grid-cols-3` 大螢幕分為三欄
- **非對稱欄寬**: 左側 2 欄（2/3 寬）+ 右側 1 欄（1/3 寬）
- **垂直間距**: `space-y-8` 統一垂直間距
- **響應式堆疊**: 小螢幕自動變為單欄垂直堆疊

**組件層次**:
```
DashboardPage
├── DashboardStats [統計卡片]
├── SalesChart [圖表組件]
├── RecentActivity [活動列表]
├── QuickActions [操作按鈕]
├── AIInsights [AI 洞察]
└── TopCustomers [客戶列表]
```

---

## 認證頁面結構

### app/(auth)/login/page.tsx - 登入頁面

典型的認證頁面佈局模式，可作為其他表單頁面的參考。

```
div (min-h-screen flex items-center justify-center)
├── div (max-w-md w-full space-y-8 p-8)
│   │
│   ├── 標題區
│   │   └── div (text-center)
│   │       ├── h1.text-3xl.font-bold: "登入"
│   │       └── p.text-sm.text-gray-600: "登入描述"
│   │
│   └── 表單區
│       └── <LoginForm />
│           └── form
│               ├── <Input /> [電子郵件]
│               ├── <Input type="password" /> [密碼]
│               ├── <Button type="submit" /> [登入按鈕]
│               └── <Link /> [忘記密碼連結]
```

**設計模式**:
- **垂直水平居中**: flex + items-center + justify-center
- **最大寬度限制**: max-w-md 控制表單寬度
- **卡片式佈局**: 白色背景 + 陰影 + 圓角
- **表單間距**: space-y-4 統一表單元素間距

---

## UI 組件清單

### 基礎 UI 組件 (components/ui/)

本項目包含 20+ 個基礎 UI 組件，基於 Radix UI 構建：

#### 1. 按鈕組件
- **button.tsx** - 基礎按鈕
  - 變體: default, destructive, outline, secondary, ghost, link
  - 尺寸: default, sm, lg, icon

#### 2. 輸入組件
- **input.tsx** - 文字輸入框
- **textarea.tsx** - 多行文字輸入
- **checkbox.tsx** - 核取方塊
- **switch.tsx** - 開關切換
- **slider.tsx** - 滑桿

#### 3. 選擇組件
- **select.tsx** - 下拉選單
- **dropdown-menu.tsx** - 下拉式選單
- **command.tsx** - 命令面板
- **popover.tsx** - 彈出視窗

#### 4. 顯示組件
- **card.tsx** - 卡片容器
- **badge.tsx** - 徽章標籤
- **alert.tsx** - 警告提示
- **alert-dialog.tsx** - 警告對話框
- **dialog.tsx** - 對話框
- **avatar.tsx** - 頭像

#### 5. 佈局組件
- **separator.tsx** - 分隔線
- **tabs.tsx** - 分頁標籤
- **label.tsx** - 表單標籤

#### 6. 反饋組件
- **progress.tsx** - 進度條
- **skeleton.tsx** - 骨架屏
- **error-display.tsx** - 錯誤顯示

### 組件使用模式

#### 卡片 + 標題模式
```tsx
<Card>
  <CardHeader>
    <CardTitle>標題</CardTitle>
    <CardDescription>描述</CardDescription>
  </CardHeader>
  <CardContent>
    {/* 內容 */}
  </CardContent>
  <CardFooter>
    {/* 頁腳 */}
  </CardFooter>
</Card>
```

#### 表單輸入模式
```tsx
<div className="space-y-2">
  <Label htmlFor="field">欄位名稱</Label>
  <Input id="field" type="text" placeholder="提示文字" />
  <p className="text-sm text-gray-500">輔助文字</p>
</div>
```

#### 按鈕組模式
```tsx
<div className="flex gap-4">
  <Button variant="default">主要</Button>
  <Button variant="outline">次要</Button>
  <Button variant="ghost">取消</Button>
</div>
```

---

## 響應式斷點

本項目使用 Tailwind CSS 的響應式斷點系統：

```
xs:  475px   - 小型手機
sm:  640px   - 手機
md:  768px   - 平板
lg:  1024px  - 小型筆電
xl:  1280px  - 桌面
2xl: 1536px  - 大螢幕
```

**常見響應式模式**:
```tsx
// 手機單欄，桌面多欄
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">

// 小螢幕隱藏，大螢幕顯示
<div className="hidden lg:block">

// 響應式文字大小
<h1 className="text-2xl md:text-3xl lg:text-4xl">

// 響應式間距
<div className="p-4 md:p-6 lg:p-8">
```

---

## 顏色系統

### 語義化顏色

模板使用 CSS 變數定義語義化顏色：

```css
:root {
  --primary: 222.2 47.4% 11.2%;      /* 主要色 */
  --secondary: 210 40% 96.1%;        /* 次要色 */
  --destructive: 0 84.2% 60.2%;      /* 警告色 */
  --muted: 210 40% 96.1%;            /* 靜音色 */
  --accent: 210 40% 96.1%;           /* 強調色 */
  --background: 0 0% 100%;           /* 背景色 */
  --foreground: 222.2 84% 4.9%;      /* 前景色 */
}

.dark {
  --primary: 210 40% 98%;
  --background: 222.2 84% 4.9%;
  /* ... 暗色模式變體 */
}
```

### 使用方式

```tsx
// 使用語義化顏色類別
<div className="bg-primary text-primary-foreground">
<Button className="bg-destructive hover:bg-destructive/90">
<Badge className="bg-secondary text-secondary-foreground">
```

---

## 動畫系統

### 內建動畫

模板包含 20+ 種動畫效果：

**淡入淡出**:
- `animate-fade-in` - 淡入效果
- `animate-fade-out` - 淡出效果
- `animate-fade-in-up` - 從下方淡入

**滑動效果**:
- `animate-slide-in-left` - 從左滑入
- `animate-slide-in-right` - 從右滑入
- `animate-slide-in-up` - 從下滑入
- `animate-slide-in-down` - 從上滑入

**縮放效果**:
- `animate-scale-in` - 放大進入
- `animate-scale-out` - 縮小退出

**其他效果**:
- `animate-bounce` - 彈跳效果
- `animate-pulse` - 脈衝效果
- `animate-spin` - 旋轉效果

### 過渡動畫

```tsx
// 顏色過渡
<div className="transition-colors duration-200">

// 所有屬性過渡
<div className="transition-all duration-300">

// 自定義過渡
<div className="transition-[background-color,transform] duration-500">
```

---

## 組件組合模式

### 儀表板卡片模式

```tsx
<Card>
  <CardHeader className="flex flex-row items-center justify-between">
    <CardTitle>標題</CardTitle>
    <Button variant="ghost" size="icon">
      <Icon />
    </Button>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      {/* 內容項目 */}
    </div>
  </CardContent>
</Card>
```

### 列表項目模式

```tsx
<div className="space-y-2">
  {items.map((item) => (
    <div key={item.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50">
      <div className="flex items-center gap-3">
        <Avatar />
        <div>
          <p className="font-medium">{item.title}</p>
          <p className="text-sm text-gray-500">{item.subtitle}</p>
        </div>
      </div>
      <Badge>{item.status}</Badge>
    </div>
  ))}
</div>
```

### 表單佈局模式

```tsx
<form className="space-y-6">
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
    <div className="space-y-2">
      <Label>欄位 1</Label>
      <Input />
    </div>
    <div className="space-y-2">
      <Label>欄位 2</Label>
      <Input />
    </div>
  </div>

  <div className="flex justify-end gap-4">
    <Button variant="outline">取消</Button>
    <Button type="submit">提交</Button>
  </div>
</form>
```

---

## 無障礙設計

### 語義化 HTML

使用正確的 HTML 語義標籤：
- `<main>` - 主要內容
- `<nav>` - 導航
- `<article>` - 文章內容
- `<section>` - 區塊
- `<header>` / `<footer>` - 頁首/頁尾

### ARIA 屬性

組件包含適當的 ARIA 屬性：
```tsx
<button
  aria-label="關閉對話框"
  aria-expanded={isOpen}
  aria-controls="menu-id"
>
```

### 鍵盤導航

所有互動元素支援鍵盤操作：
- Tab / Shift+Tab - 焦點移動
- Enter / Space - 啟動元素
- Escape - 關閉對話框/選單
- 方向鍵 - 選單導航

---

## 總結

本 UI 結構分析文檔提供了：

1. **頁面層次**: 從根佈局到具體頁面的完整組件樹
2. **組件清單**: 20+ 個基礎 UI 組件及其用途
3. **設計模式**: 常見的佈局和組件組合模式
4. **響應式設計**: 斷點系統和響應式使用模式
5. **樣式系統**: 顏色、動畫和主題配置
6. **無障礙支援**: 語義化 HTML 和 ARIA 屬性

開發者可以根據這些結構模式快速構建新頁面和組件，保持設計一致性和代碼可維護性。

---

**相關文檔**:
- [LAYOUT-PATTERNS.md](./LAYOUT-PATTERNS.md) - 詳細的佈局模式說明
- [COMPONENT-USAGE.md](./COMPONENT-USAGE.md) - 組件使用指南
- [README.md](./README.md) - UI 參考文檔總覽

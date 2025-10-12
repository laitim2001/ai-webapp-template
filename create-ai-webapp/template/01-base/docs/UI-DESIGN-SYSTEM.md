# UI 設計系統

本文檔定義了 {{PROJECT_NAME}} 的完整 UI 設計系統，確保整個應用程序的視覺一致性和用戶體驗。

## 📋 目錄

- [設計原則](#設計原則)
- [顏色系統](#顏色系統)
- [字體系統](#字體系統)
- [間距系統](#間距系統)
- [動畫系統](#動畫系統)
- [陰影系統](#陰影系統)
- [響應式設計](#響應式設計)
- [組件庫](#組件庫)
- [圖標系統](#圖標系統)
- [無障礙設計](#無障礙設計)

---

## 🎯 設計原則

### 1. 一致性（Consistency）
所有 UI 元素應遵循相同的設計語言，確保用戶體驗的連貫性。

### 2. 清晰度（Clarity）
界面應清晰易懂，避免不必要的裝飾，讓用戶專注於內容。

### 3. 可訪問性（Accessibility）
設計應考慮所有用戶，包括視覺、聽覺或運動障礙的用戶。

### 4. 響應性（Responsiveness）
界面應在所有設備和屏幕尺寸上都能良好運作。

### 5. 效率（Efficiency）
減少用戶完成任務所需的步驟和時間。

### 6. 美觀（Aesthetics）
在功能性的基礎上追求視覺美感。

---

## 🎨 顏色系統

### 主要顏色

我們使用 **HSL 色彩空間**，便於調整亮度和飽和度，更好地支持深色模式。

#### 語義顏色

| 顏色名稱 | 用途 | 淺色模式 | 深色模式 |
|---------|------|----------|----------|
| **Primary** | 主要操作、鏈接 | `hsl(222.2, 47.4%, 11.2%)` | `hsl(210, 40%, 98%)` |
| **Secondary** | 次要操作 | `hsl(210, 40%, 96.1%)` | `hsl(217.2, 32.6%, 17.5%)` |
| **Accent** | 強調元素 | `hsl(210, 40%, 96.1%)` | `hsl(217.2, 32.6%, 17.5%)` |
| **Destructive** | 刪除、警告操作 | `hsl(0, 84.2%, 60.2%)` | `hsl(0, 62.8%, 30.6%)` |
| **Muted** | 低對比度文本 | `hsl(210, 40%, 96.1%)` | `hsl(217.2, 32.6%, 17.5%)` |
| **Success** | 成功狀態 | `hsl(142, 76%, 36%)` | `hsl(142, 76%, 36%)` |
| **Warning** | 警告狀態 | `hsl(38, 92%, 50%)` | `hsl(38, 92%, 50%)` |
| **Info** | 信息提示 | `hsl(199, 89%, 48%)` | `hsl(199, 89%, 48%)` |

#### 背景與前景

| 元素 | 淺色模式 | 深色模式 |
|------|----------|----------|
| **Background** | `hsl(0, 0%, 100%)` | `hsl(222.2, 84%, 4.9%)` |
| **Foreground** | `hsl(222.2, 84%, 4.9%)` | `hsl(210, 40%, 98%)` |
| **Card** | `hsl(0, 0%, 100%)` | `hsl(222.2, 84%, 4.9%)` |
| **Popover** | `hsl(0, 0%, 100%)` | `hsl(222.2, 84%, 4.9%)` |
| **Border** | `hsl(214.3, 31.8%, 91.4%)` | `hsl(217.2, 32.6%, 17.5%)` |

### 顏色使用規範

#### ✅ 正確使用

```tsx
// 使用語義化的顏色類名
<button className="bg-primary text-primary-foreground">
  主要按鈕
</button>

<div className="bg-destructive text-destructive-foreground">
  錯誤消息
</div>
```

#### ❌ 錯誤使用

```tsx
// 避免使用硬編碼的顏色值
<button className="bg-[#1a1a1a] text-white">
  按鈕
</button>

// 避免使用非語義化的顏色
<div className="bg-red-500">
  這不是正確的方式
</div>
```

### 顏色對比度

所有文本與背景的對比度必須符合 **WCAG 2.1 AA 標準**：

- **正常文本**: 至少 4.5:1
- **大文本（18pt+）**: 至少 3:1
- **圖形元素**: 至少 3:1

---

## ✍️ 字體系統

### 字體家族

```css
--font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 
             'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
             
--font-mono: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, 
             Monaco, Consolas, monospace;
```

### 字體大小層級

| 類名 | 大小 | 行高 | 用途 |
|------|------|------|------|
| `text-xs` | 0.75rem (12px) | 1rem | 輔助文本、標籤 |
| `text-sm` | 0.875rem (14px) | 1.25rem | 小文本、次要信息 |
| `text-base` | 1rem (16px) | 1.5rem | 正文、默認文本 |
| `text-lg` | 1.125rem (18px) | 1.75rem | 強調文本 |
| `text-xl` | 1.25rem (20px) | 1.75rem | 小標題 |
| `text-2xl` | 1.5rem (24px) | 2rem | 副標題 |
| `text-3xl` | 1.875rem (30px) | 2.25rem | 標題 |
| `text-4xl` | 2.25rem (36px) | 2.5rem | 大標題 |
| `text-5xl` | 3rem (48px) | 1 | 超大標題 |

### 字重（Font Weight）

| 類名 | 數值 | 用途 |
|------|------|------|
| `font-normal` | 400 | 正文 |
| `font-medium` | 500 | 強調文本 |
| `font-semibold` | 600 | 次要標題 |
| `font-bold` | 700 | 主要標題 |

### 字體使用規範

```tsx
// ✅ 標題層級
<h1 className="text-4xl font-bold">主標題</h1>
<h2 className="text-3xl font-semibold">副標題</h2>
<h3 className="text-2xl font-semibold">三級標題</h3>

// ✅ 正文
<p className="text-base font-normal">正文內容</p>

// ✅ 代碼
<code className="font-mono text-sm">const code = true;</code>
```

---

## 📏 間距系統

### 間距比例

基於 **4px 基準單位**，使用 Tailwind 的間距系統：

| 類名 | 大小 | 用途 |
|------|------|------|
| `space-0.5` | 2px | 極小間距 |
| `space-1` | 4px | 最小間距 |
| `space-2` | 8px | 小間距 |
| `space-3` | 12px | 小-中間距 |
| `space-4` | 16px | 中間距（默認） |
| `space-6` | 24px | 中-大間距 |
| `space-8` | 32px | 大間距 |
| `space-12` | 48px | 超大間距 |
| `space-16` | 64px | 區塊間距 |

### 間距使用原則

#### 組件內部間距
- **Padding**: 通常使用 `p-4`（16px）或 `p-6`（24px）
- **元素間距**: 使用 `space-y-*` 或 `gap-*`

#### 組件外部間距
- **區塊間距**: `mb-8`（32px）或 `mb-12`（48px）
- **元素間距**: `mb-4`（16px）或 `mb-6`（24px）

```tsx
// ✅ 卡片內部間距
<div className="p-6 space-y-4">
  <h3>標題</h3>
  <p>內容</p>
</div>

// ✅ 組件間距
<div className="space-y-8">
  <Card />
  <Card />
</div>
```

---

## 🎬 動畫系統

### 動畫原則

1. **目的性**: 動畫應有明確目的（反饋、引導、過渡）
2. **自然**: 動畫應模擬真實世界的物理運動
3. **快速**: 動畫時長應短（100-400ms）
4. **可選**: 尊重 `prefers-reduced-motion` 設置

### 動畫庫

#### 淡入淡出

```css
/* 淡入 */
animate-fade-in      /* 200ms */

/* 淡出 */
animate-fade-out     /* 200ms */
```

#### 滑動

```css
animate-slide-in-from-top     /* 從上滑入 300ms */
animate-slide-in-from-bottom  /* 從下滑入 300ms */
animate-slide-in-from-left    /* 從左滑入 300ms */
animate-slide-in-from-right   /* 從右滑入 300ms */
```

#### 縮放

```css
animate-scale-in     /* 放大進入 200ms */
animate-scale-out    /* 縮小退出 200ms */
```

#### 旋轉與效果

```css
animate-spin-slow        /* 慢速旋轉 3s */
animate-pulse-slow       /* 慢速脈衝 3s */
animate-bounce-subtle    /* 輕微彈跳 1s */
animate-shake           /* 搖晃 500ms */
```

#### 加載與進度

```css
animate-progress    /* 進度條 1s */
animate-shimmer     /* 骨架屏閃爍 2s */
```

#### Accordion

```css
animate-accordion-down   /* 手風琴展開 200ms */
animate-accordion-up     /* 手風琴收起 200ms */
```

### 緩動函數（Easing）

| 用途 | 緩動函數 | Tailwind 類名 |
|------|----------|---------------|
| 標準過渡 | cubic-bezier(0.4, 0, 0.2, 1) | `ease-in-out` |
| 進入 | cubic-bezier(0, 0, 0.2, 1) | `ease-out` |
| 退出 | cubic-bezier(0.4, 0, 1, 1) | `ease-in` |

### 動畫使用範例

```tsx
// ✅ 按鈕懸停
<button className="transition-all duration-200 hover:scale-105">
  懸停放大
</button>

// ✅ 模態框出現
<Dialog className="animate-scale-in">
  對話框內容
</Dialog>

// ✅ 加載骨架屏
<div className="h-4 bg-muted rounded animate-shimmer">
  加載中...
</div>

// ✅ 錯誤提示搖晃
<div className="animate-shake bg-destructive">
  輸入錯誤！
</div>
```

---

## 🌓 陰影系統

### 陰影層級

| 類名 | 用途 | 效果 |
|------|------|------|
| `shadow-sm` | 輕微提升 | 輸入框、按鈕 |
| `shadow` | 基礎陰影 | 卡片、下拉菜單 |
| `shadow-md` | 中等提升 | 懸浮卡片 |
| `shadow-lg` | 顯著提升 | 模態框、彈出層 |
| `shadow-xl` | 強烈提升 | 對話框 |
| `shadow-2xl` | 極強提升 | 全屏覆蓋 |
| `shadow-inner` | 內陰影 | 輸入框（聚焦） |
| `shadow-glow` | 發光效果 | 強調元素 |

### 陰影使用範例

```tsx
// ✅ 卡片
<div className="shadow-md hover:shadow-lg transition-shadow">
  卡片內容
</div>

// ✅ 輸入框聚焦
<input className="focus:shadow-inner focus:ring-2" />

// ✅ 強調元素
<div className="shadow-glow">
  重要通知
</div>
```

---

## 📱 響應式設計

### 斷點系統

| 斷點 | 最小寬度 | 目標設備 |
|------|----------|----------|
| `xs` | 475px | 小手機 |
| `sm` | 640px | 手機 |
| `md` | 768px | 平板 |
| `lg` | 1024px | 小筆電 |
| `xl` | 1280px | 桌面 |
| `2xl` | 1536px | 大屏幕 |

### 移動優先策略

設計應從最小屏幕開始，然後逐步增強：

```tsx
// ✅ 移動優先
<div className="
  flex flex-col       {/* 默認：垂直排列 */}
  md:flex-row         {/* 平板：水平排列 */}
  lg:gap-8            {/* 桌面：增加間距 */}
">
  <div className="w-full md:w-1/2">左側</div>
  <div className="w-full md:w-1/2">右側</div>
</div>

// ✅ 響應式文字大小
<h1 className="text-2xl md:text-4xl lg:text-5xl">
  響應式標題
</h1>

// ✅ 響應式間距
<div className="p-4 md:p-6 lg:p-8">
  內容區域
</div>
```

### 常見響應式模式

#### 1. 導航欄
```tsx
// 移動端：漢堡菜單
// 桌面端：水平導航
<nav className="
  flex flex-col lg:flex-row 
  items-start lg:items-center
  gap-4 lg:gap-8
">
```

#### 2. 網格佈局
```tsx
// 1 列 → 2 列 → 3 列 → 4 列
<div className="
  grid 
  grid-cols-1 
  sm:grid-cols-2 
  lg:grid-cols-3 
  xl:grid-cols-4 
  gap-4
">
```

#### 3. 側邊欄
```tsx
// 移動端：全寬
// 桌面端：固定寬度側邊欄
<div className="flex flex-col lg:flex-row">
  <aside className="w-full lg:w-64">側邊欄</aside>
  <main className="flex-1">主內容</main>
</div>
```

---

## 🧩 組件庫

詳細的組件規範請參見：

- [按鈕組件](./components/button.md)
- [輸入框組件](./components/input.md)
- [卡片組件](./components/card.md)
- [對話框組件](./components/dialog.md)
- [下拉菜單組件](./components/dropdown.md)
- [Toast 通知](./components/toast.md)
- [表格組件](./components/table.md)

### 組件命名規範

- 使用 PascalCase（如 `UserProfile`）
- 名稱應清晰描述功能
- 避免縮寫（除非廣泛認可）

---

## 🎯 圖標系統

### 圖標庫

使用 **Lucide React** 作為主要圖標庫：

```tsx
import { Home, User, Settings } from 'lucide-react';

<Home className="h-5 w-5" />
<User className="h-5 w-5" />
<Settings className="h-5 w-5" />
```

### 圖標大小

| 用途 | 大小 | Tailwind 類名 |
|------|------|---------------|
| 小圖標 | 16px | `h-4 w-4` |
| 標準圖標 | 20px | `h-5 w-5` |
| 大圖標 | 24px | `h-6 w-6` |
| 超大圖標 | 32px | `h-8 w-8` |

### 圖標使用規範

```tsx
// ✅ 與文字對齊
<button className="flex items-center gap-2">
  <Plus className="h-4 w-4" />
  <span>添加項目</span>
</button>

// ✅ 使用語義化的顏色
<Check className="h-5 w-5 text-success" />
<X className="h-5 w-5 text-destructive" />
<Info className="h-5 w-5 text-info" />
```

---

## ♿ 無障礙設計

### ARIA 屬性

所有交互元素都應包含適當的 ARIA 屬性：

```tsx
// ✅ 按鈕
<button 
  aria-label="關閉對話框"
  aria-pressed={isActive}
>
  <X />
</button>

// ✅ 輸入框
<input
  aria-label="搜索"
  aria-describedby="search-help"
  aria-invalid={hasError}
/>

// ✅ 對話框
<div 
  role="dialog" 
  aria-modal="true"
  aria-labelledby="dialog-title"
>
```

### 鍵盤導航

所有交互元素都應支持鍵盤操作：

- **Tab**: 焦點移動
- **Enter/Space**: 激活
- **Escape**: 關閉/取消
- **Arrow Keys**: 列表導航

### 焦點指示器

所有可聚焦元素都應有清晰的焦點指示：

```tsx
// ✅ 自定義焦點環
<button className="
  focus:outline-none 
  focus:ring-2 
  focus:ring-primary 
  focus:ring-offset-2
">
  按鈕
</button>
```

### 顏色對比度

- 確保文本與背景對比度 ≥ 4.5:1
- 大文本對比度 ≥ 3:1
- 使用工具驗證（如 Lighthouse）

### 跳過導航

提供跳過重複內容的功能：

```tsx
<a 
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute"
>
  跳至主要內容
</a>
```

---

## 📊 設計令牌（Design Tokens）

所有設計值都應使用 CSS 變數定義，便於主題切換：

```css
:root {
  /* 顏色 */
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  
  /* 間距 */
  --space-unit: 4px;
  
  /* 圓角 */
  --radius: 0.5rem;
  
  /* 字體 */
  --font-sans: 'Inter', sans-serif;
}
```

---

## 🔍 設計審查清單

在實施新 UI 時，請檢查以下項目：

- [ ] 遵循設計系統的顏色規範
- [ ] 使用正確的字體大小和字重
- [ ] 間距符合 4px 基準單位
- [ ] 動畫時長適當（100-400ms）
- [ ] 響應式設計在所有斷點正常工作
- [ ] 顏色對比度符合 WCAG AA 標準
- [ ] 所有交互元素可通過鍵盤訪問
- [ ] 包含適當的 ARIA 屬性
- [ ] 支持深色模式
- [ ] 尊重 `prefers-reduced-motion` 設置

---

## 📚 參考資源

- [Tailwind CSS 文檔](https://tailwindcss.com/docs)
- [Radix UI Primitives](https://www.radix-ui.com/primitives/docs/overview/introduction)
- [WCAG 2.1 指南](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design Guidelines](https://material.io/design)

---

**版本**: 1.0.0  
**最後更新**: 2025-01-10  
**維護者**: {{AUTHOR}}


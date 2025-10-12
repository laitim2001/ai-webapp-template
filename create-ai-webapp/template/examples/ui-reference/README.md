# UI 參考文檔

本目錄提供 AI Web App Template 的完整 UI 設計參考，幫助開發者快速理解和使用模板的 UI 系統。

## 📚 文檔說明

### 為什麼使用文字描述而不是截圖？

我們選擇文字描述和組件樹分析而非 UI 截圖的原因：

1. **易於維護**: 文字描述可以隨代碼更新，截圖需要頻繁重新製作
2. **版本控制友好**: 文字可以使用 Git 進行版本控制，截圖會增加倉庫大小
3. **更好的參考價值**: 組件結構比視覺外觀更有助於理解和實現
4. **通用性**: 不同項目的 UI 外觀會有差異，但結構模式是通用的
5. **可搜索**: 文字內容可以被搜索引擎和編輯器索引

## 📄 文檔列表

### [UI-STRUCTURE.md](./UI-STRUCTURE.md) - UI 結構分析

**內容概要**:
- 根佈局結構分析
- 首頁組件樹
- 儀表板頁面結構
- 認證頁面佈局
- 完整 UI 組件清單（20+ 個組件）
- 響應式斷點系統
- 顏色和動畫系統

**適用場景**:
- ✅ 了解頁面整體結構
- ✅ 查看組件層次關係
- ✅ 理解響應式設計策略
- ✅ 學習樣式系統配置

**文檔亮點**:
- 📊 視覺化組件樹結構
- 🎨 完整的顏色系統說明
- ✨ 20+ 種動畫效果清單
- 📱 響應式斷點詳解

---

### [LAYOUT-PATTERNS.md](./LAYOUT-PATTERNS.md) - 佈局模式說明

**內容概要**:
- 核心佈局原則（移動優先、內容優先）
- 5 種頁面級佈局模式
- 4 種組件級佈局模式
- 響應式佈局策略
- 間距與對齊系統
- 3 個完整實戰案例

**適用場景**:
- ✅ 構建新頁面時選擇佈局
- ✅ 實現響應式設計
- ✅ 保持間距一致性
- ✅ 學習佈局最佳實踐

**文檔亮點**:
- 📐 8px 網格系統詳解
- 🎯 5 種常用頁面佈局
- 🔄 響應式斷點應用
- 📝 完整代碼示例

---

### [COMPONENT-USAGE.md](./COMPONENT-USAGE.md) - 組件使用指南

**內容概要**:
- 所有 UI 組件的詳細 API 文檔
- Props 參數說明
- 使用範例和代碼示例
- 變體樣式說明
- 組合模式和最佳實踐

**適用場景**:
- ✅ 查找組件使用方法
- ✅ 了解組件 API
- ✅ 複製代碼示例
- ✅ 學習組件組合模式

**文檔亮點**:
- 📋 完整的 Props API 表格
- 💻 即用代碼範例
- 🎨 樣式變體說明
- 🔧 組合模式示例

---

## 🚀 快速開始

### 1. 理解項目 UI 架構

**第一步：閱讀 UI-STRUCTURE.md**
- 了解根佈局和頁面結構
- 查看可用的 UI 組件清單
- 理解響應式斷點系統

**第二步：閱讀 LAYOUT-PATTERNS.md**
- 選擇適合的頁面佈局模式
- 學習間距和對齊系統
- 參考實戰案例

**第三步：閱讀 COMPONENT-USAGE.md**
- 查找需要的組件
- 複製代碼示例
- 根據需求調整參數

---

### 2. 常見任務指南

#### 建立新頁面

1. **選擇佈局模式** (參考 LAYOUT-PATTERNS.md)
   - 儀表板頁面 → 使用「儀表板網格佈局」
   - 表單頁面 → 使用「全螢幕居中佈局」
   - 列表頁面 → 使用「上方導航佈局」

2. **查看頁面結構** (參考 UI-STRUCTURE.md)
   - 找到相似的頁面示例
   - 理解組件層次關係

3. **使用組件** (參考 COMPONENT-USAGE.md)
   - 查找所需組件的使用方法
   - 複製代碼示例並調整

#### 實現響應式設計

1. **了解斷點系統** (UI-STRUCTURE.md)
   ```
   xs:  475px   - 小型手機
   sm:  640px   - 手機
   md:  768px   - 平板
   lg:  1024px  - 小型筆電
   xl:  1280px  - 桌面
   2xl: 1536px  - 大螢幕
   ```

2. **應用響應式模式** (LAYOUT-PATTERNS.md)
   ```tsx
   // 移動優先
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">

   // 條件顯示
   <div className="block lg:hidden"> // 移動端顯示
   <div className="hidden lg:block"> // 桌面端顯示
   ```

3. **測試不同斷點**
   - 使用瀏覽器開發者工具
   - 測試所有主要斷點
   - 確保內容不溢出

#### 使用特定組件

1. **查找組件** (COMPONENT-USAGE.md 目錄)
   - 按鈕組件 → Button
   - 表單輸入 → Input, Textarea, Select
   - 對話框 → Dialog, AlertDialog
   - 卡片 → Card

2. **查看 Props API**
   - 了解可用的參數
   - 查看預設值
   - 選擇合適的變體

3. **複製代碼示例**
   - 找到最接近需求的範例
   - 複製到項目中
   - 根據需求調整

---

## 📊 UI 組件清單

### 基礎組件 (8 個)

| 組件 | 用途 | 文檔位置 |
|------|------|----------|
| Button | 按鈕操作 | COMPONENT-USAGE.md#按鈕組件 |
| Input | 文字輸入 | COMPONENT-USAGE.md#輸入組件 |
| Textarea | 多行輸入 | COMPONENT-USAGE.md#輸入組件 |
| Label | 表單標籤 | COMPONENT-USAGE.md#表單組件 |
| Checkbox | 核取方塊 | COMPONENT-USAGE.md#輸入組件 |
| Switch | 開關切換 | COMPONENT-USAGE.md#輸入組件 |
| Slider | 滑桿選擇 | UI-STRUCTURE.md#ui-組件清單 |
| Select | 下拉選單 | COMPONENT-USAGE.md#下拉選單組件 |

### 容器組件 (6 個)

| 組件 | 用途 | 文檔位置 |
|------|------|----------|
| Card | 卡片容器 | COMPONENT-USAGE.md#卡片組件 |
| Dialog | 對話框 | COMPONENT-USAGE.md#對話框組件 |
| AlertDialog | 警告對話框 | COMPONENT-USAGE.md#對話框組件 |
| Tabs | 分頁標籤 | COMPONENT-USAGE.md#導航組件 |
| Popover | 彈出視窗 | UI-STRUCTURE.md#ui-組件清單 |
| Command | 命令面板 | UI-STRUCTURE.md#ui-組件清單 |

### 顯示組件 (6 個)

| 組件 | 用途 | 文檔位置 |
|------|------|----------|
| Badge | 徽章標籤 | COMPONENT-USAGE.md#反饋組件 |
| Alert | 警告提示 | COMPONENT-USAGE.md#反饋組件 |
| Avatar | 頭像顯示 | COMPONENT-USAGE.md#導航組件 |
| Progress | 進度條 | COMPONENT-USAGE.md#反饋組件 |
| Skeleton | 骨架屏 | COMPONENT-USAGE.md#反饋組件 |
| Separator | 分隔線 | UI-STRUCTURE.md#ui-組件清單 |

### 選單組件 (2 個)

| 組件 | 用途 | 文檔位置 |
|------|------|----------|
| DropdownMenu | 下拉式選單 | COMPONENT-USAGE.md#下拉選單組件 |
| Select | 選擇器 | COMPONENT-USAGE.md#下拉選單組件 |

---

## 🎨 設計系統核心

### 顏色系統

使用 CSS 變數定義語義化顏色：

```css
--primary      主要色（品牌色）
--secondary    次要色
--destructive  危險色（刪除、錯誤）
--muted        靜音色（次要信息）
--accent       強調色
--background   背景色
--foreground   前景色（文字）
```

**使用方式**:
```tsx
<div className="bg-primary text-primary-foreground">
<Button className="bg-destructive hover:bg-destructive/90">
```

**參考文檔**: UI-STRUCTURE.md#顏色系統

---

### 間距系統

基於 8px 網格系統：

```
0.5 → 2px    1  → 4px    2  → 8px    3  → 12px
4   → 16px   6  → 24px   8  → 32px   12 → 48px
```

**使用方式**:
```tsx
<div className="p-4">      // padding: 16px
<div className="gap-6">    // gap: 24px
<div className="space-y-8"> // vertical space: 32px
```

**參考文檔**: LAYOUT-PATTERNS.md#間距與對齊系統

---

### 響應式斷點

Tailwind CSS 斷點系統：

```tsx
// 移動優先
<div className="text-sm md:text-base lg:text-lg">

// 條件顯示
<div className="block lg:hidden">  // 移動端顯示
<div className="hidden lg:block">  // 桌面端顯示

// 網格佈局
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
```

**參考文檔**: UI-STRUCTURE.md#響應式斷點

---

### 動畫效果

20+ 種預定義動畫：

```tsx
// 淡入效果
<div className="animate-fade-in">

// 滑入效果
<div className="animate-slide-in-up">

// 縮放效果
<div className="animate-scale-in">

// 過渡動畫
<div className="transition-colors duration-200">
```

**參考文檔**: UI-STRUCTURE.md#動畫系統

---

## 🏗️ 佈局模式速查

### 頁面級佈局

| 模式 | 適用場景 | 範例代碼位置 |
|------|----------|--------------|
| 全螢幕居中 | 首頁、登入頁 | LAYOUT-PATTERNS.md#全螢幕居中佈局 |
| 儀表板網格 | 數據儀表板 | LAYOUT-PATTERNS.md#儀表板網格佈局 |
| 左側邊欄 | 管理系統 | LAYOUT-PATTERNS.md#左側邊欄佈局 |
| 上方導航 | 官網、部落格 | LAYOUT-PATTERNS.md#上方導航佈局 |

### 組件級佈局

| 模式 | 適用場景 | 範例代碼位置 |
|------|----------|--------------|
| 卡片容器 | 內容區塊 | LAYOUT-PATTERNS.md#卡片容器模式 |
| 表單佈局 | 輸入表單 | LAYOUT-PATTERNS.md#表單佈局模式 |
| 列表佈局 | 數據列表 | LAYOUT-PATTERNS.md#列表佈局模式 |
| 圖文混排 | 內容展示 | LAYOUT-PATTERNS.md#圖文混排模式 |

---

## 💡 最佳實踐

### 組件使用原則

1. **保持一致性**
   - 使用相同的組件和樣式
   - 遵循設計系統規範
   - 統一的間距和顏色

2. **重用組件**
   - 優先使用現有組件
   - 避免重複實現
   - 抽象通用模式

3. **語義化使用**
   - Button 用於操作
   - Link 用於導航
   - 正確的 HTML 標籤

4. **可訪問性**
   - 使用 Label 配對 Input
   - 提供 aria 屬性
   - 支援鍵盤導航

### 響應式設計原則

1. **移動優先**
   - 從小螢幕開始設計
   - 逐步增強到大螢幕
   - 確保核心功能在所有裝置可用

2. **測試所有斷點**
   - xs (475px), sm (640px), md (768px)
   - lg (1024px), xl (1280px), 2xl (1536px)
   - 檢查內容不溢出

3. **適當的佈局切換**
   - 小螢幕垂直堆疊
   - 大螢幕水平排列
   - 使用 Grid/Flexbox

### 性能優化

1. **減少重新渲染**
   - 使用 React.memo
   - 合理使用 useMemo/useCallback
   - 避免內聯函數

2. **懶載入組件**
   - 對話框延遲載入
   - 大型組件按需載入
   - 使用 React.lazy

3. **優化圖片**
   - 使用 next/image
   - 設定適當尺寸
   - 啟用懶載入

---

## 🔍 快速查找

### 想要實現...

**居中頁面內容**
→ LAYOUT-PATTERNS.md#全螢幕居中佈局

**建立儀表板**
→ LAYOUT-PATTERNS.md#儀表板網格佈局
→ LAYOUT-PATTERNS.md#案例-3-數據儀表板

**製作表單**
→ LAYOUT-PATTERNS.md#表單佈局模式
→ COMPONENT-USAGE.md#完整表單範例

**顯示數據列表**
→ LAYOUT-PATTERNS.md#列表佈局模式
→ LAYOUT-PATTERNS.md#案例-2-產品列表頁

**添加按鈕**
→ COMPONENT-USAGE.md#按鈕組件

**製作對話框**
→ COMPONENT-USAGE.md#對話框組件

**顯示用戶頭像**
→ COMPONENT-USAGE.md#avatar-頭像

**實現分頁切換**
→ COMPONENT-USAGE.md#tabs-分頁標籤

**顯示載入狀態**
→ COMPONENT-USAGE.md#skeleton-骨架屏
→ COMPONENT-USAGE.md#progress-進度條

**響應式網格佈局**
→ LAYOUT-PATTERNS.md#響應式佈局策略

---

## 📚 學習路徑

### 初學者路徑

**第 1 天：理解基礎**
1. 閱讀 UI-STRUCTURE.md 的「根佈局結構」和「首頁結構」
2. 了解基本的組件清單
3. 學習響應式斷點系統

**第 2 天：學習佈局**
1. 閱讀 LAYOUT-PATTERNS.md 的「核心佈局原則」
2. 學習 3 種頁面級佈局模式
3. 實踐：建立一個簡單頁面

**第 3 天：掌握組件**
1. 閱讀 COMPONENT-USAGE.md 的基礎組件部分
2. 學習 Button, Input, Card 的使用
3. 實踐：製作一個簡單表單

**第 4-5 天：綜合應用**
1. 參考 LAYOUT-PATTERNS.md 的實戰案例
2. 建立一個完整的功能頁面
3. 應用響應式設計和最佳實踐

### 進階路徑

**掌握佈局系統**
1. 深入學習所有佈局模式
2. 理解間距和對齊系統
3. 能夠根據需求選擇合適的佈局

**精通組件庫**
1. 熟悉所有組件的 API
2. 掌握組件組合模式
3. 能夠創建自訂組件變體

**優化與性能**
1. 學習性能優化技巧
2. 實踐無障礙設計
3. 掌握主題定制

---

## 🛠️ 開發工具推薦

### VS Code 擴展

- **Tailwind CSS IntelliSense** - Tailwind 自動完成
- **ES7+ React/Redux/React-Native snippets** - React 代碼片段
- **Auto Rename Tag** - 自動重命名標籤
- **Prettier** - 代碼格式化

### 瀏覽器工具

- **React Developer Tools** - React 組件調試
- **Tailwind CSS DevTools** - Tailwind 類別檢查
- **Responsive Viewer** - 響應式測試

---

## 📞 獲取幫助

### 文檔內問題

- 先搜索關鍵字
- 查看目錄定位章節
- 參考快速查找部分

### 實現問題

- 查看相關的代碼示例
- 參考實戰案例
- 檢查最佳實踐建議

### 找不到答案

- 查看項目主文檔 `../../README.md`
- 查看 AI 助手指南 `../../AI-ASSISTANT-GUIDE.md`
- 提交 GitHub Issue

---

## 📝 文檔更新

本文檔基於 AI Web App Template v5.0 創建。

**最後更新**: 2025-10-05
**文檔版本**: 1.0

---

**祝您開發愉快！** 🚀

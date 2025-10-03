# 動畫使用指南

本文檔提供完整的動畫系統使用指南，幫助開發者創建流暢、自然的用戶界面動效。

## 🎯 動畫設計原則

### 1. 目的性（Purpose）
每個動畫都應該有明確的目的：
- **反饋**: 確認用戶操作
- **引導**: 引導用戶注意力
- **過渡**: 平滑的狀態變化
- **增強**: 提升用戶體驗

### 2. 自然性（Natural）
動畫應模擬真實世界的物理運動：
- 物體有重量和慣性
- 使用適當的緩動函數
- 避免機械式的線性動畫

### 3. 快速性（Speed）
動畫應該快速完成：
- **短暫**: 100-400ms 最佳
- **不阻礙**: 不應拖慢用戶操作
- **可跳過**: 可以被新操作打斷

### 4. 一致性（Consistency）
相似的操作應使用相似的動畫：
- 統一的時長和緩動
- 統一的方向和距離
- 統一的視覺語言

### 5. 尊重用戶偏好
始終尊重系統設置：
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 📚 動畫庫

### 1. 淡入淡出（Fade）

#### `animate-fade-in`
**用途**: 元素進入視圖  
**時長**: 200ms  
**緩動**: ease-out

```tsx
// ✅ 頁面內容加載
<div className="animate-fade-in">
  <h1>歡迎回來！</h1>
</div>

// ✅ Toast 通知出現
<Toast className="animate-fade-in">
  操作成功！
</Toast>
```

#### `animate-fade-out`
**用途**: 元素退出視圖  
**時長**: 200ms  
**緩動**: ease-in

```tsx
// ✅ 關閉通知
<Alert 
  className={isClosing ? 'animate-fade-out' : ''}
  onAnimationEnd={handleRemove}
>
  提示信息
</Alert>
```

---

### 2. 滑動（Slide）

#### `animate-slide-in-from-top`
**用途**: 從上方滑入  
**時長**: 300ms  
**緩動**: cubic-bezier(0.16, 1, 0.3, 1)

```tsx
// ✅ 下拉通知
<Notification className="animate-slide-in-from-top">
  新消息！
</Notification>

// ✅ 頂部橫幅
<Banner className="animate-slide-in-from-top">
  系統維護通知
</Banner>
```

#### `animate-slide-in-from-bottom`
**用途**: 從下方滑入  
**時長**: 300ms

```tsx
// ✅ 底部導航欄
<BottomNav className="animate-slide-in-from-bottom">
  導航內容
</BottomNav>

// ✅ 底部抽屜
<Drawer className="animate-slide-in-from-bottom">
  抽屜內容
</Drawer>
```

#### `animate-slide-in-from-left` / `animate-slide-in-from-right`
**用途**: 從左/右滑入  
**時長**: 300ms

```tsx
// ✅ 側邊欄
<Sidebar className="animate-slide-in-from-left">
  菜單內容
</Sidebar>

// ✅ 消息面板
<MessagePanel className="animate-slide-in-from-right">
  聊天內容
</MessagePanel>
```

---

### 3. 縮放（Scale）

#### `animate-scale-in`
**用途**: 放大進入  
**時長**: 200ms  
**緩動**: ease-out

```tsx
// ✅ 模態框出現
<Modal className="animate-scale-in">
  對話框內容
</Modal>

// ✅ 下拉菜單展開
<DropdownMenu className="animate-scale-in">
  菜單項
</DropdownMenu>

// ✅ 工具提示
<Tooltip className="animate-scale-in">
  提示內容
</Tooltip>
```

#### `animate-scale-out`
**用途**: 縮小退出  
**時長**: 200ms  
**緩動**: ease-in

```tsx
// ✅ 關閉模態框
<Modal 
  className={isClosing ? 'animate-scale-out' : 'animate-scale-in'}
>
  對話框內容
</Modal>
```

---

### 4. 彈跳與搖晃（Bounce & Shake）

#### `animate-bounce-subtle`
**用途**: 輕微彈跳吸引注意  
**時長**: 1s  
**次數**: 3 次

```tsx
// ✅ 新功能提示
<Badge className="animate-bounce-subtle">
  NEW
</Badge>

// ✅ 未讀消息提示
<NotificationBadge className="animate-bounce-subtle">
  5
</NotificationBadge>
```

#### `animate-shake`
**用途**: 搖晃表示錯誤  
**時長**: 500ms  
**距離**: ±10px

```tsx
// ✅ 表單驗證錯誤
<Input 
  className={hasError ? 'animate-shake border-destructive' : ''}
  onAnimationEnd={() => setHasError(false)}
/>

// ✅ 錯誤提示
<Alert className="animate-shake" variant="destructive">
  密碼錯誤！
</Alert>
```

---

### 5. 旋轉與脈衝（Spin & Pulse）

#### `animate-spin` / `animate-spin-slow`
**用途**: 加載指示  
**時長**: 1s / 3s  
**循環**: 無限

```tsx
// ✅ 標準加載
<Loader className="animate-spin h-5 w-5" />

// ✅ 慢速旋轉（裝飾）
<Icon className="animate-spin-slow text-muted" />
```

#### `animate-pulse` / `animate-pulse-slow`
**用途**: 脈衝效果  
**時長**: 2s / 3s  
**循環**: 無限

```tsx
// ✅ 骨架屏
<div className="animate-pulse bg-muted rounded h-4 w-full" />

// ✅ 通知指示器
<div className="animate-pulse-slow bg-primary rounded-full h-3 w-3" />
```

---

### 6. 手風琴（Accordion）

#### `animate-accordion-down` / `animate-accordion-up`
**用途**: 展開/收起內容  
**時長**: 200ms  
**緩動**: ease-in-out

```tsx
// ✅ 手風琴組件
<AccordionContent 
  className={isOpen ? 'animate-accordion-down' : 'animate-accordion-up'}
>
  展開內容
</AccordionContent>

// ✅ 可折疊區域
<Collapsible>
  <CollapsibleContent className="animate-accordion-down">
    折疊內容
  </CollapsibleContent>
</Collapsible>
```

---

### 7. 進度與加載（Progress & Loading）

#### `animate-progress`
**用途**: 進度條填充  
**時長**: 1s  
**緩動**: ease-in-out

```tsx
// ✅ 進度條
<div className="w-full bg-secondary rounded-full h-2">
  <div 
    className="animate-progress bg-primary h-2 rounded-full"
    style={{ width: `${progress}%` }}
  />
</div>
```

#### `animate-shimmer`
**用途**: 骨架屏閃爍效果  
**時長**: 2s  
**循環**: 無限

```tsx
// ✅ 加載骨架
<div className="animate-shimmer bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded h-4" />

// ✅ 加載卡片
<Card className="animate-shimmer">
  <div className="space-y-3">
    <div className="h-4 bg-muted rounded" />
    <div className="h-4 bg-muted rounded w-5/6" />
  </div>
</Card>
```

---

## 🎨 組合動畫

多個動畫可以組合使用：

```tsx
// ✅ 淡入 + 從下滑入
<Modal className="animate-fade-in animate-slide-in-from-bottom">
  模態框內容
</Modal>

// ✅ 縮放 + 旋轉
<Icon className="animate-scale-in animate-spin" />

// ✅ 懸停放大
<Card className="
  transition-all duration-200 
  hover:scale-105 hover:shadow-lg
">
  卡片內容
</Card>
```

---

## ⚙️ 自定義動畫

### 使用 Tailwind 類名

```tsx
// ✅ 自定義過渡
<button className="
  transition-all duration-300 
  hover:bg-primary hover:scale-110
">
  按鈕
</button>

// ✅ 延遲動畫
<div className="
  animate-fade-in 
  animation-delay-100
">
  延遲 100ms
</div>
```

### 使用 CSS

```css
/* 自定義關鍵幀 */
@keyframes custom-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.custom-bounce {
  animation: custom-bounce 1s ease-in-out infinite;
}
```

---

## 📱 響應式動畫

在移動設備上可能需要調整動畫：

```tsx
// ✅ 桌面端有動畫，移動端無動畫
<div className="
  md:animate-slide-in-from-left
  md:hover:scale-105
">
  響應式內容
</div>

// ✅ 根據屏幕尺寸調整時長
<div className="
  transition-all 
  duration-200 
  md:duration-300
">
  響應式動畫
</div>
```

---

## ♿ 無障礙考慮

### 尊重 prefers-reduced-motion

```tsx
// ✅ 條件性應用動畫
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

<div className={!prefersReducedMotion ? 'animate-fade-in' : ''}>
  內容
</div>
```

### 提供跳過選項

```tsx
// ✅ 允許用戶跳過動畫
<button 
  onClick={handleSkipAnimation}
  className="sr-only focus:not-sr-only"
>
  跳過動畫
</button>
```

---

## ⚠️ 常見錯誤

### ❌ 動畫過長

```tsx
// ❌ 不好：動畫太慢
<Modal className="transition-all duration-1000">
  對話框
</Modal>

// ✅ 好：快速流暢
<Modal className="transition-all duration-200">
  對話框
</Modal>
```

### ❌ 過度使用動畫

```tsx
// ❌ 不好：到處都有動畫
<div className="animate-bounce">
  <h1 className="animate-pulse">
    <span className="animate-spin">標題</span>
  </h1>
</div>

// ✅ 好：適度使用
<div>
  <h1>標題</h1>
</div>
```

### ❌ 阻礙用戶操作

```tsx
// ❌ 不好：強制等待動畫完成
<Modal 
  isOpen={isOpen}
  onClose={handleClose}
  className="animate-scale-in pointer-events-none"
>
  對話框
</Modal>

// ✅ 好：動畫期間仍可交互
<Modal 
  isOpen={isOpen}
  onClose={handleClose}
  className="animate-scale-in"
>
  對話框
</Modal>
```

---

## 🧪 測試動畫

### 視覺測試

```tsx
// 創建動畫展示頁面
<div className="space-y-4">
  <div className="animate-fade-in">淡入</div>
  <div className="animate-slide-in-from-top">從上滑入</div>
  <div className="animate-scale-in">縮放進入</div>
</div>
```

### 性能測試

```tsx
// 使用 React DevTools Profiler
<Profiler id="animation" onRender={onRenderCallback}>
  <AnimatedComponent />
</Profiler>
```

---

## 📚 參考資源

- [MDN: CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)
- [Material Design Motion](https://material.io/design/motion)
- [Framer Motion](https://www.framer.com/motion/)
- [GSAP](https://greensock.com/gsap/)

---

## 🎯 快速參考表

| 用途 | 動畫類名 | 時長 |
|------|----------|------|
| 內容進入 | `animate-fade-in` | 200ms |
| 模態框 | `animate-scale-in` | 200ms |
| 側邊欄 | `animate-slide-in-from-left` | 300ms |
| 錯誤提示 | `animate-shake` | 500ms |
| 加載指示 | `animate-spin` | 1s |
| 骨架屏 | `animate-shimmer` | 2s |
| 新功能徽章 | `animate-bounce-subtle` | 1s |
| 展開內容 | `animate-accordion-down` | 200ms |

---

**版本**: 1.0.0  
**最後更新**: 2025-01-10


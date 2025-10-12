# 響應式設計指南

本文檔提供完整的響應式設計實踐指南，確保應用程序在所有設備上都能提供最佳體驗。

## 📱 移動優先策略

### 為什麼移動優先？

1. **性能優先**: 移動設備通常性能較弱，優先考慮可確保基本可用性
2. **漸進增強**: 從簡單到複雜，逐步添加功能
3. **用戶優先**: 移動用戶數量持續增長
4. **強制簡化**: 迫使我們專注於核心功能

### 設計流程

```
1. 設計移動端（320px-640px）
   ↓
2. 測試基本功能
   ↓
3. 擴展至平板（768px-1024px）
   ↓
4. 優化桌面體驗（1280px+）
```

---

## 📏 斷點系統

### 標準斷點

| 斷點 | 最小寬度 | Tailwind 前綴 | 目標設備 |
|------|----------|---------------|----------|
| **xs** | 475px | `xs:` | 小手機（iPhone SE） |
| **sm** | 640px | `sm:` | 手機（iPhone 12/13） |
| **md** | 768px | `md:` | 平板（iPad Mini） |
| **lg** | 1024px | `lg:` | 小筆電 |
| **xl** | 1280px | `xl:` | 桌面 |
| **2xl** | 1536px | `2xl:` | 大屏幕 |

### 使用範例

```tsx
// 移動優先：從小到大
<div className="
  text-sm        {/* 默認: 小手機 */}
  sm:text-base   {/* 640px+: 手機 */}
  md:text-lg     {/* 768px+: 平板 */}
  lg:text-xl     {/* 1024px+: 筆電 */}
  xl:text-2xl    {/* 1280px+: 桌面 */}
">
  響應式文字
</div>
```

---

## 🎨 常見響應式模式

### 1. 佈局模式

#### 單列 → 多列網格

```tsx
// 1 列 → 2 列 → 3 列 → 4 列
<div className="
  grid 
  grid-cols-1 
  sm:grid-cols-2 
  lg:grid-cols-3 
  xl:grid-cols-4 
  gap-4 sm:gap-6 lg:gap-8
">
  {items.map(item => (
    <Card key={item.id}>{item.content}</Card>
  ))}
</div>
```

#### 垂直堆疊 → 水平佈局

```tsx
// 移動端垂直，桌面端水平
<div className="
  flex 
  flex-col 
  lg:flex-row 
  gap-4 lg:gap-8
">
  <aside className="w-full lg:w-64">
    側邊欄
  </aside>
  <main className="flex-1">
    主內容
  </main>
</div>
```

#### 固定側邊欄

```tsx
// 移動端隱藏，桌面端固定
<div className="flex">
  {/* 側邊欄：移動端抽屜，桌面端固定 */}
  <aside className="
    hidden 
    lg:block 
    lg:w-64 
    lg:fixed 
    lg:h-screen 
    lg:overflow-y-auto
  ">
    導航菜單
  </aside>
  
  {/* 主內容：桌面端留出側邊欄空間 */}
  <main className="
    w-full 
    lg:ml-64
  ">
    頁面內容
  </main>
</div>
```

---

### 2. 導航模式

#### 漢堡菜單 → 水平導航

```tsx
<nav className="flex items-center justify-between p-4">
  {/* Logo */}
  <div className="flex items-center">
    <Logo />
  </div>
  
  {/* 移動端：漢堡按鈕 */}
  <button 
    className="lg:hidden"
    onClick={() => setMenuOpen(!menuOpen)}
  >
    <Menu className="h-6 w-6" />
  </button>
  
  {/* 桌面端：水平菜單 */}
  <div className="hidden lg:flex lg:items-center lg:gap-8">
    <NavLink href="/dashboard">儀表板</NavLink>
    <NavLink href="/projects">項目</NavLink>
    <NavLink href="/settings">設置</NavLink>
  </div>
</nav>

{/* 移動端菜單 */}
<div className={cn(
  "lg:hidden",
  menuOpen ? "block" : "hidden"
)}>
  <MobileMenu />
</div>
```

#### 底部導航（移動端）

```tsx
// 移動端顯示底部導航，桌面端隱藏
<nav className="
  fixed bottom-0 left-0 right-0 
  lg:hidden 
  bg-background border-t 
  z-50
">
  <div className="flex justify-around p-2">
    <NavButton icon={Home} label="首頁" />
    <NavButton icon={Search} label="搜索" />
    <NavButton icon={User} label="我的" />
  </div>
</nav>
```

---

### 3. 內容適配

#### 響應式文字大小

```tsx
// 標題
<h1 className="
  text-2xl sm:text-3xl md:text-4xl lg:text-5xl 
  font-bold
">
  響應式標題
</h1>

// 正文
<p className="
  text-sm sm:text-base lg:text-lg
  leading-relaxed
">
  響應式段落內容
</p>
```

#### 響應式間距

```tsx
<section className="
  p-4 sm:p-6 md:p-8 lg:p-12
  space-y-4 sm:space-y-6 lg:space-y-8
">
  <div className="
    mb-4 sm:mb-6 lg:mb-8
  ">
    內容區塊
  </div>
</section>
```

#### 響應式容器

```tsx
// 固定最大寬度 + 居中
<div className="
  container 
  mx-auto 
  px-4 sm:px-6 lg:px-8
  max-w-7xl
">
  內容
</div>
```

---

### 4. 圖片與媒體

#### 響應式圖片

```tsx
import Image from 'next/image';

// Next.js 圖片優化
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  className="
    w-full 
    h-auto 
    object-cover
    rounded-lg
  "
  sizes="
    (max-width: 640px) 100vw,
    (max-width: 1024px) 80vw,
    1200px
  "
/>
```

#### 不同尺寸不同圖片

```tsx
<picture>
  <source
    media="(min-width: 1024px)"
    srcSet="/hero-desktop.jpg"
  />
  <source
    media="(min-width: 640px)"
    srcSet="/hero-tablet.jpg"
  />
  <img
    src="/hero-mobile.jpg"
    alt="Hero"
    className="w-full h-auto"
  />
</picture>
```

#### 響應式視頻

```tsx
// 16:9 寬高比容器
<div className="relative aspect-video">
  <iframe
    className="absolute inset-0 w-full h-full"
    src="https://youtube.com/embed/..."
    allowFullScreen
  />
</div>
```

---

### 5. 表格處理

#### 水平滾動（移動端）

```tsx
<div className="
  overflow-x-auto 
  -mx-4 sm:mx-0
">
  <table className="min-w-full">
    <thead>
      <tr>
        <th>欄位 1</th>
        <th>欄位 2</th>
        <th>欄位 3</th>
      </tr>
    </thead>
    <tbody>
      {/* 表格內容 */}
    </tbody>
  </table>
</div>
```

#### 卡片佈局（移動端）

```tsx
// 桌面端顯示表格，移動端顯示卡片
<div className="hidden lg:block">
  <Table data={data} />
</div>

<div className="lg:hidden space-y-4">
  {data.map(item => (
    <Card key={item.id}>
      <CardHeader>{item.title}</CardHeader>
      <CardContent>{item.content}</CardContent>
    </Card>
  ))}
</div>
```

---

### 6. 表單適配

#### 響應式表單佈局

```tsx
<form className="space-y-6">
  {/* 移動端全寬，桌面端兩列 */}
  <div className="
    grid 
    grid-cols-1 
    lg:grid-cols-2 
    gap-4 lg:gap-6
  ">
    <FormField label="名字">
      <Input />
    </FormField>
    <FormField label="姓氏">
      <Input />
    </FormField>
  </div>
  
  {/* 全寬字段 */}
  <FormField label="電子郵件">
    <Input type="email" />
  </FormField>
  
  {/* 按鈕：移動端全寬，桌面端自適應 */}
  <Button className="w-full lg:w-auto">
    提交
  </Button>
</form>
```

---

## 🖼️ 顯示/隱藏元素

### 條件顯示

```tsx
// 只在移動端顯示
<div className="block lg:hidden">
  移動端內容
</div>

// 只在桌面端顯示
<div className="hidden lg:block">
  桌面端內容
</div>

// 在平板及以上顯示
<div className="hidden md:block">
  平板和桌面內容
</div>
```

### 響應式組件替換

```tsx
// 根據屏幕尺寸顯示不同組件
function ResponsiveComponent() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile ? <MobileView /> : <DesktopView />;
}
```

---

## 🎯 性能優化

### 1. 延遲加載

```tsx
import dynamic from 'next/dynamic';

// 桌面端組件延遲加載
const DesktopChart = dynamic(
  () => import('@/components/DesktopChart'),
  { ssr: false }
);

// 條件加載
{isDesktop && <DesktopChart />}
```

### 2. 圖片優化

```tsx
// 使用 Next.js Image 組件
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority={isMobile ? false : true}
  loading={isMobile ? 'lazy' : 'eager'}
/>
```

### 3. 字體加載

```tsx
// 根據設備加載不同字重
const inter = Inter({
  subsets: ['latin'],
  weight: isMobile ? ['400', '600'] : ['400', '500', '600', '700'],
});
```

---

## 📐 容器查詢（Container Queries）

### 使用 Tailwind 容器查詢

```tsx
<div className="@container">
  <div className="
    @sm:text-base 
    @md:text-lg 
    @lg:text-xl
  ">
    容器查詢文字
  </div>
</div>
```

---

## 🧪 測試響應式設計

### 開發工具

1. **Chrome DevTools**
   - 設備工具欄（Ctrl/Cmd + Shift + M）
   - 自定義設備
   - 網絡限制模擬

2. **Firefox 響應式設計模式**
   - Ctrl/Cmd + Shift + M
   - 設備像素比測試

### 測試清單

- [ ] 所有斷點測試（xs, sm, md, lg, xl, 2xl）
- [ ] 橫屏和豎屏測試
- [ ] 觸摸交互測試
- [ ] 字體大小縮放測試（150%, 200%）
- [ ] 實際設備測試
- [ ] 緩慢網絡測試

---

## ⚠️ 常見錯誤

### ❌ 固定寬度

```tsx
// ❌ 不好：固定寬度在小屏幕溢出
<div style={{ width: '1200px' }}>
  內容
</div>

// ✅ 好：使用最大寬度和響應式
<div className="w-full max-w-7xl mx-auto px-4">
  內容
</div>
```

### ❌ 忽略觸摸目標大小

```tsx
// ❌ 不好：按鈕太小
<button className="p-1 text-xs">
  按鈕
</button>

// ✅ 好：至少 44x44px
<button className="p-3 min-h-[44px] min-w-[44px]">
  按鈕
</button>
```

### ❌ 過度使用 `hidden`

```tsx
// ❌ 不好：內容仍然加載
<div className="hidden lg:block">
  <HeavyComponent />
</div>

// ✅ 好：條件渲染
{isDesktop && <HeavyComponent />}
```

---

## 📚 最佳實踐

### 1. 觸摸友好

```tsx
// 增大可點擊區域
<button className="
  p-3 
  min-h-[44px] 
  -m-2         {/* 擴展點擊區域 */}
  active:scale-95
">
  按鈕
</button>
```

### 2. 可讀性

```tsx
// 限制文字行寬
<p className="
  max-w-prose        {/* 約 65 字符 */}
  text-base 
  leading-relaxed    {/* 行高 1.625 */}
">
  長文本內容
</p>
```

### 3. 性能

```tsx
// 減少移動端渲染內容
<div className="
  grid 
  grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
">
  {items.slice(0, isMobile ? 6 : 12).map(item => (
    <Card key={item.id}>{item.content}</Card>
  ))}
</div>
```

---

## 🔧 工具與資源

### 開發工具
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [Responsively App](https://responsively.app/)
- [BrowserStack](https://www.browserstack.com/)

### 測試設備
- iPhone SE (375px)
- iPhone 12/13 (390px)
- iPad Mini (768px)
- iPad Pro (1024px)
- Desktop (1920px)

### 參考資源
- [MDN Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Google Web Fundamentals](https://developers.google.com/web/fundamentals/design-and-ux/responsive)

---

## 📊 快速參考表

| 場景 | 移動端 | 平板 | 桌面 |
|------|--------|------|------|
| **佈局** | 單列 | 2 列 | 3-4 列 |
| **導航** | 漢堡菜單 | 展開菜單 | 水平菜單 |
| **間距** | 16px | 24px | 32px |
| **文字** | 14-16px | 16-18px | 16-20px |
| **圖片** | 全寬 | 80% 寬 | 固定寬 |
| **表格** | 卡片 | 滾動 | 完整 |

---

**版本**: 1.0.0  
**最後更新**: 2025-01-10


# 佈局模式說明

本文檔詳細說明 AI Web App Template 中使用的核心佈局模式和設計原則，幫助開發者快速應用這些模式構建一致的用戶界面。

## 📋 目錄

- [核心佈局原則](#核心佈局原則)
- [頁面級佈局模式](#頁面級佈局模式)
- [組件級佈局模式](#組件級佈局模式)
- [響應式佈局策略](#響應式佈局策略)
- [間距與對齊系統](#間距與對齊系統)
- [實戰案例](#實戰案例)

---

## 核心佈局原則

### 設計哲學

1. **移動優先 (Mobile First)**
   - 從小螢幕開始設計，逐步增強到大螢幕
   - 確保核心功能在所有裝置上可用

2. **內容優先 (Content First)**
   - 佈局服務於內容，而非限制內容
   - 使用語義化的間距和層次

3. **漸進式增強 (Progressive Enhancement)**
   - 基礎功能在所有瀏覽器可用
   - 高級特性在支援的環境中啟用

4. **一致性 (Consistency)**
   - 統一的間距、字體、顏色系統
   - 可預測的交互行為

### 8px 網格系統

所有間距基於 8px 基準單位：

```
空間單位:
2px   → 0.5 (極小間距)
4px   → 1   (最小間距)
8px   → 2   (小間距)
12px  → 3   (中小間距)
16px  → 4   (標準間距)
24px  → 6   (中間距)
32px  → 8   (大間距)
48px  → 12  (極大間距)
64px  → 16  (超大間距)
```

**使用範例**:
```tsx
// Tailwind CSS 類別對應
<div className="p-4">     // padding: 16px
<div className="gap-6">   // gap: 24px
<div className="space-y-8"> // vertical space: 32px
```

---

## 頁面級佈局模式

### 1. 全螢幕居中佈局

**用途**: 首頁、登入頁、錯誤頁等需要視覺焦點的頁面

**結構**:
```tsx
<main className="flex min-h-screen flex-col items-center justify-center p-24">
  <div className="max-w-5xl w-full">
    {/* 內容 */}
  </div>
</main>
```

**關鍵要素**:
- `min-h-screen` - 確保最小全螢幕高度
- `flex` + `items-center` + `justify-center` - 垂直水平居中
- `max-w-5xl` - 限制最大寬度，保持可讀性
- `p-24` - 外邊距防止內容貼邊

**適用場景**:
- ✅ 首頁歡迎頁面
- ✅ 登入/註冊表單
- ✅ 404/500 錯誤頁面
- ✅ 載入/等待頁面

---

### 2. 儀表板網格佈局

**用途**: 數據儀表板、管理後台等信息密集型頁面

**結構**:
```tsx
<div className="space-y-8">
  {/* 標題區 */}
  <div>
    <h1 className="text-2xl font-bold">標題</h1>
    <p className="text-sm text-gray-600">描述</p>
  </div>

  {/* 統計卡片 */}
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
    {/* 4個統計卡片 */}
  </div>

  {/* 主要內容 */}
  <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
    {/* 左側 2/3 */}
    <div className="lg:col-span-2">
      {/* 圖表、列表等 */}
    </div>

    {/* 右側 1/3 */}
    <div>
      {/* 側邊欄內容 */}
    </div>
  </div>
</div>
```

**關鍵要素**:
- `space-y-8` - 區塊間統一垂直間距
- `grid` - 使用 CSS Grid 進行佈局
- `lg:col-span-2` - 響應式欄位跨越
- `gap-4` / `gap-8` - 網格間距

**響應式行為**:
```
小螢幕 (<1024px): 單欄堆疊佈局
大螢幕 (≥1024px): 3欄網格，左側佔2欄，右側佔1欄
```

**適用場景**:
- ✅ 數據儀表板
- ✅ 分析頁面
- ✅ 管理後台首頁

---

### 3. 左側邊欄佈局

**用途**: 管理系統、文檔網站等需要持久導航的應用

**結構**:
```tsx
<div className="flex min-h-screen">
  {/* 側邊欄 */}
  <aside className="w-64 bg-gray-50 border-r">
    <nav className="p-4 space-y-2">
      {/* 導航項目 */}
    </nav>
  </aside>

  {/* 主要內容 */}
  <main className="flex-1 p-8">
    {/* 頁面內容 */}
  </main>
</div>
```

**關鍵要素**:
- `flex` - Flexbox 水平佈局
- `w-64` - 固定側邊欄寬度 (256px)
- `flex-1` - 主內容區佔據剩餘空間
- `border-r` - 視覺分隔線

**響應式變體**:
```tsx
{/* 移動端：隱藏側邊欄，使用漢堡選單 */}
<aside className="hidden lg:block w-64 ...">

{/* 移動端側邊欄（抽屜式） */}
<Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost" size="icon" className="lg:hidden">
      <Menu />
    </Button>
  </SheetTrigger>
  <SheetContent side="left">
    <nav>{/* 導航內容 */}</nav>
  </SheetContent>
</Sheet>
```

**適用場景**:
- ✅ 後台管理系統
- ✅ 文檔網站
- ✅ 設置頁面

---

### 4. 上方導航佈局

**用途**: 官網、營銷頁面等公開內容網站

**結構**:
```tsx
<div className="min-h-screen flex flex-col">
  {/* 頂部導航 */}
  <header className="sticky top-0 z-50 bg-white border-b">
    <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
      <Logo />
      <Navigation />
      <UserMenu />
    </nav>
  </header>

  {/* 主要內容 */}
  <main className="flex-1">
    {children}
  </main>

  {/* 頁腳 */}
  <footer className="bg-gray-50 border-t">
    {/* 頁腳內容 */}
  </footer>
</div>
```

**關鍵要素**:
- `sticky top-0` - 導航列黏在頂部
- `z-50` - 確保導航在其他元素之上
- `container mx-auto` - 內容居中，最大寬度限制
- `flex-1` - 主內容佔據剩餘高度

**適用場景**:
- ✅ 官方網站
- ✅ 產品落地頁
- ✅ 部落格

---

## 組件級佈局模式

### 1. 卡片容器模式

**標準卡片結構**:
```tsx
<Card>
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle>標題</CardTitle>
      <Button variant="ghost" size="icon">
        <MoreVertical className="h-4 w-4" />
      </Button>
    </div>
    <CardDescription>描述文字</CardDescription>
  </CardHeader>

  <CardContent>
    {/* 主要內容 */}
  </CardContent>

  <CardFooter className="flex justify-between">
    <Button variant="outline">取消</Button>
    <Button>確認</Button>
  </CardFooter>
</Card>
```

**變體模式**:

**統計卡片**:
```tsx
<Card>
  <CardHeader className="flex flex-row items-center justify-between pb-2">
    <CardTitle className="text-sm font-medium">總收益</CardTitle>
    <DollarSign className="h-4 w-4 text-gray-500" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">$45,231.89</div>
    <p className="text-xs text-gray-500">+20.1% 比上月</p>
  </CardContent>
</Card>
```

**列表卡片**:
```tsx
<Card>
  <CardHeader>
    <CardTitle>最近活動</CardTitle>
  </CardHeader>
  <CardContent className="p-0">
    <div className="divide-y">
      {items.map(item => (
        <div key={item.id} className="p-4">
          {/* 列表項目 */}
        </div>
      ))}
    </div>
  </CardContent>
</Card>
```

---

### 2. 表單佈局模式

**垂直表單（預設）**:
```tsx
<form className="space-y-6">
  <div className="space-y-2">
    <Label htmlFor="name">姓名</Label>
    <Input id="name" />
    <p className="text-sm text-gray-500">輔助說明</p>
  </div>

  <div className="space-y-2">
    <Label htmlFor="email">電子郵件</Label>
    <Input id="email" type="email" />
  </div>

  <Button type="submit" className="w-full">提交</Button>
</form>
```

**水平表單（網格）**:
```tsx
<form className="space-y-6">
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
    <div className="space-y-2">
      <Label>名字</Label>
      <Input />
    </div>
    <div className="space-y-2">
      <Label>姓氏</Label>
      <Input />
    </div>
  </div>

  <div className="space-y-2">
    <Label>地址（佔滿行）</Label>
    <Input />
  </div>

  <div className="flex justify-end gap-4">
    <Button variant="outline">取消</Button>
    <Button type="submit">提交</Button>
  </div>
</form>
```

**行內表單**:
```tsx
<form className="flex gap-4">
  <Input placeholder="搜尋..." className="flex-1" />
  <Button type="submit">搜尋</Button>
</form>
```

---

### 3. 列表佈局模式

**簡單列表**:
```tsx
<div className="space-y-2">
  {items.map(item => (
    <div
      key={item.id}
      className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50"
    >
      <div className="flex items-center gap-3">
        <Avatar src={item.avatar} />
        <div>
          <p className="font-medium">{item.name}</p>
          <p className="text-sm text-gray-500">{item.email}</p>
        </div>
      </div>
      <Button variant="ghost" size="sm">操作</Button>
    </div>
  ))}
</div>
```

**網格列表**:
```tsx
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  {items.map(item => (
    <Card key={item.id}>
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {item.description}
      </CardContent>
    </Card>
  ))}
</div>
```

**帶分隔線的列表**:
```tsx
<div className="divide-y">
  {items.map(item => (
    <div key={item.id} className="py-4 first:pt-0 last:pb-0">
      {/* 列表項目內容 */}
    </div>
  ))}
</div>
```

---

### 4. 圖文混排模式

**左圖右文**:
```tsx
<div className="flex gap-6">
  <div className="w-32 h-32 flex-shrink-0">
    <img src={image} className="rounded-lg" />
  </div>
  <div className="flex-1">
    <h3 className="font-semibold">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
</div>
```

**上圖下文（卡片）**:
```tsx
<Card>
  <div className="aspect-video relative">
    <img src={image} className="object-cover" />
  </div>
  <CardHeader>
    <CardTitle>{title}</CardTitle>
    <CardDescription>{description}</CardDescription>
  </CardHeader>
  <CardFooter>
    <Button>查看更多</Button>
  </CardFooter>
</Card>
```

**交錯佈局**:
```tsx
{items.map((item, index) => (
  <div
    key={item.id}
    className={cn(
      "grid md:grid-cols-2 gap-8 items-center",
      index % 2 === 1 && "md:flex-row-reverse"
    )}
  >
    <div>
      <img src={item.image} />
    </div>
    <div>
      <h2>{item.title}</h2>
      <p>{item.description}</p>
    </div>
  </div>
))}
```

---

## 響應式佈局策略

### Breakpoint 應用模式

**移動優先方法**:
```tsx
{/* 預設樣式適用於移動端 */}
<div className="p-4 md:p-6 lg:p-8">
  {/* padding: 16px → 24px → 32px */}
</div>

{/* 從小到大逐步增強 */}
<div className="text-sm md:text-base lg:text-lg">
  {/* 14px → 16px → 18px */}
</div>
```

**條件顯示**:
```tsx
{/* 移動端顯示，桌面端隱藏 */}
<div className="block lg:hidden">
  <MobileMenu />
</div>

{/* 移動端隱藏，桌面端顯示 */}
<div className="hidden lg:block">
  <DesktopSidebar />
</div>
```

**佈局切換**:
```tsx
{/* 移動端垂直堆疊，桌面端水平排列 */}
<div className="flex flex-col lg:flex-row gap-4">
  <aside className="lg:w-64">側邊欄</aside>
  <main className="flex-1">內容</main>
</div>

{/* 移動端單欄，平板雙欄，桌面四欄 */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* 網格項目 */}
</div>
```

---

## 間距與對齊系統

### 垂直間距模式

**統一垂直間距（推薦）**:
```tsx
{/* 使用 space-y-* 為子元素添加間距 */}
<div className="space-y-4">
  <div>項目 1</div>
  <div>項目 2</div>
  <div>項目 3</div>
</div>
```

**層次化間距**:
```tsx
<div className="space-y-8">  {/* 大區塊間距 */}
  <section>
    <h2 className="mb-4">標題</h2>  {/* 標題與內容間距 */}
    <div className="space-y-2">     {/* 內容項目間距 */}
      <p>段落 1</p>
      <p>段落 2</p>
    </div>
  </section>
</div>
```

### 水平間距模式

**Flexbox 間距**:
```tsx
{/* 使用 gap 屬性（推薦） */}
<div className="flex gap-4">
  <Button>按鈕 1</Button>
  <Button>按鈕 2</Button>
</div>

{/* 使用 space-x-* */}
<div className="flex space-x-4">
  <Button>按鈕 1</Button>
  <Button>按鈕 2</Button>
</div>
```

**Grid 間距**:
```tsx
<div className="grid grid-cols-3 gap-4">
  {/* gap 同時處理行列間距 */}
</div>

<div className="grid grid-cols-3 gap-x-4 gap-y-8">
  {/* 分別設定水平和垂直間距 */}
</div>
```

### 對齊方式

**Flexbox 對齊**:
```tsx
{/* 水平居中 */}
<div className="flex justify-center">

{/* 垂直居中 */}
<div className="flex items-center">

{/* 垂直水平都居中 */}
<div className="flex items-center justify-center">

{/* 兩端對齊 */}
<div className="flex justify-between">

{/* 底部對齊 */}
<div className="flex items-end">
```

**Grid 對齊**:
```tsx
{/* 內容居中 */}
<div className="grid place-items-center">

{/* 內容對齊到開始 */}
<div className="grid place-items-start">

{/* 單個項目對齊 */}
<div className="grid">
  <div className="justify-self-end">靠右</div>
</div>
```

**文字對齊**:
```tsx
<p className="text-left">     {/* 左對齊 */}
<p className="text-center">   {/* 居中 */}
<p className="text-right">    {/* 右對齊 */}
<p className="text-justify">  {/* 兩端對齊 */}
```

---

## 實戰案例

### 案例 1: 用戶設定頁面

```tsx
<div className="min-h-screen bg-gray-50">
  {/* 頁面標題區 */}
  <div className="bg-white border-b">
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold">帳戶設定</h1>
    </div>
  </div>

  {/* 主要內容 */}
  <div className="container mx-auto px-4 py-8">
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">

      {/* 側邊欄導航 */}
      <aside className="lg:col-span-1">
        <Card>
          <CardContent className="p-0">
            <nav className="space-y-1">
              <a className="block px-4 py-2 hover:bg-gray-50">
                個人資料
              </a>
              <a className="block px-4 py-2 hover:bg-gray-50">
                安全設定
              </a>
              <a className="block px-4 py-2 hover:bg-gray-50">
                通知偏好
              </a>
            </nav>
          </CardContent>
        </Card>
      </aside>

      {/* 主要內容區 */}
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>個人資料</CardTitle>
            <CardDescription>更新您的個人信息</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>名字</Label>
                  <Input />
                </div>
                <div className="space-y-2">
                  <Label>姓氏</Label>
                  <Input />
                </div>
              </div>

              <div className="space-y-2">
                <Label>電子郵件</Label>
                <Input type="email" />
              </div>

              <div className="space-y-2">
                <Label>個人簡介</Label>
                <Textarea rows={4} />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Button variant="outline">取消</Button>
            <Button>儲存變更</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  </div>
</div>
```

**佈局要點**:
- ✅ 使用 container 限制內容寬度
- ✅ 4欄網格：側邊欄1欄，內容3欄
- ✅ 卡片包裝內容區塊
- ✅ 表單使用網格佈局（2欄）
- ✅ 響應式：小螢幕單欄堆疊

---

### 案例 2: 產品列表頁

```tsx
<div className="container mx-auto px-4 py-8">
  {/* 頁面標題與篩選 */}
  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
    <div>
      <h1 className="text-3xl font-bold">產品列表</h1>
      <p className="text-gray-600">瀏覽我們的全部產品</p>
    </div>

    <div className="flex gap-4">
      <Select>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="排序方式" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">最新</SelectItem>
          <SelectItem value="price-low">價格低到高</SelectItem>
          <SelectItem value="price-high">價格高到低</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline">
        <Filter className="mr-2 h-4 w-4" />
        篩選
      </Button>
    </div>
  </div>

  {/* 產品網格 */}
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {products.map(product => (
      <Card key={product.id} className="overflow-hidden">
        <div className="aspect-square relative">
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-full"
          />
        </div>
        <CardHeader>
          <CardTitle className="line-clamp-1">{product.name}</CardTitle>
          <CardDescription className="line-clamp-2">
            {product.description}
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-between items-center">
          <span className="text-2xl font-bold">
            ${product.price}
          </span>
          <Button size="sm">加入購物車</Button>
        </CardFooter>
      </Card>
    ))}
  </div>

  {/* 分頁 */}
  <div className="mt-12 flex justify-center">
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  </div>
</div>
```

**佈局要點**:
- ✅ Flexbox 標題與篩選器排列
- ✅ 響應式網格：1→2→3→4欄
- ✅ aspect-square 保持圖片正方形
- ✅ line-clamp 限制文字行數
- ✅ 分頁置中對齊

---

### 案例 3: 數據儀表板

```tsx
<div className="space-y-8">
  {/* KPI 卡片 */}
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
    {kpis.map(kpi => (
      <Card key={kpi.id}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            {kpi.title}
          </CardTitle>
          {kpi.icon}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpi.value}</div>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            {kpi.trend > 0 ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            {kpi.change} 比上期
          </p>
        </CardContent>
      </Card>
    ))}
  </div>

  {/* 圖表與列表 */}
  <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>銷售趨勢</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            {/* 圖表配置 */}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>重要事項</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {notifications.map(item => (
            <div key={item.id} className="p-4">
              <div className="flex gap-3">
                <div className={cn(
                  "w-2 h-2 rounded-full mt-2",
                  item.priority === 'high' && "bg-red-500",
                  item.priority === 'medium' && "bg-yellow-500",
                  item.priority === 'low' && "bg-blue-500"
                )} />
                <div className="flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
</div>
```

**佈局要點**:
- ✅ KPI卡片：1→2→4欄響應式網格
- ✅ 圖表佔2欄，列表佔1欄
- ✅ 圖表使用 ResponsiveContainer
- ✅ 列表使用 divide-y 分隔線
- ✅ 優先級用顏色區分

---

## 佈局檢查清單

在實現新佈局時，請檢查以下項目：

### 響應式檢查
- [ ] 在所有斷點測試佈局
- [ ] 確保小螢幕可用性
- [ ] 檢查內容不會溢出
- [ ] 驗證圖片響應式行為

### 間距檢查
- [ ] 使用 8px 網格系統
- [ ] 保持間距一致性
- [ ] 適當的內外邊距
- [ ] 區塊間有明確分隔

### 對齊檢查
- [ ] 垂直對齊正確
- [ ] 水平對齊一致
- [ ] 文字基線對齊
- [ ] 圖示與文字對齊

### 可訪問性檢查
- [ ] 語義化 HTML 標籤
- [ ] 鍵盤導航可用
- [ ] 足夠的點擊區域
- [ ] 顏色對比度達標

---

## 總結

本佈局模式文檔提供了：

1. **核心原則**: 移動優先、內容優先、漸進式增強
2. **頁面佈局**: 5種常用頁面級佈局模式
3. **組件佈局**: 常見組件的佈局結構
4. **響應式策略**: 斷點應用和佈局切換
5. **間距系統**: 8px網格和對齊方式
6. **實戰案例**: 3個完整的頁面實現

使用這些模式可以快速構建一致、美觀、響應式的用戶界面。

---

**相關文檔**:
- [UI-STRUCTURE.md](./UI-STRUCTURE.md) - UI 結構分析
- [COMPONENT-USAGE.md](./COMPONENT-USAGE.md) - 組件使用指南
- [README.md](./README.md) - UI 參考文檔總覽

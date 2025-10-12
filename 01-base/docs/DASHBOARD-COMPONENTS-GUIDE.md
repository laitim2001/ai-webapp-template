# Dashboard Components Guide
# Dashboard 組件使用指南

> 專業級儀表板組件系統 - 從真實企業項目提取並優化

## 概覽

本模板提供了一套完整的 Dashboard 組件系統，包含：

- **DashboardSidebar** - 側邊欄導航組件
- **DashboardHeader** - 頂部導航欄組件
- **DashboardLayout** - 佈局容器組件
- **SalesChart** - 銷售趨勢圖表組件

這些組件源自真實企業級應用（AI Sales Enablement Platform），經過優化和模板化處理。

---

## 快速開始

### 1. 基本使用

創建一個完整的 Dashboard 頁面只需要：

```typescript
import { DashboardLayout } from '@/components/layout/dashboard-layout'

export default function MyDashboardPage() {
  return (
    <DashboardLayout>
      {/* 您的頁面內容 */}
      <h1>我的儀表板</h1>
    </DashboardLayout>
  )
}
```

### 2. 添加圖表

```typescript
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { SalesChart } from '@/components/dashboard/sales-chart'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">業績儀表板</h1>
      <SalesChart />
    </DashboardLayout>
  )
}
```

---

## 組件詳解

### DashboardSidebar

固定側邊欄導航組件，提供完整的導航結構。

#### 功能特性

- ✅ **用戶信息卡片** - 顯示用戶頭像、姓名、角色、在線狀態
- ✅ **分組導航菜單** - 支持多層級分組（概覽、客戶管理、AI工具、知識管理）
- ✅ **活躍鏈接高亮** - 自動檢測當前路由並高亮
- ✅ **Badge 提示** - 支持數字徽章和 "NEW" 標籤
- ✅ **底部菜單** - 獨立的設定和幫助中心區域
- ✅ **深色模式支持** - 完整的 dark mode 樣式

#### 導航結構

```typescript
const navigation: NavigationSection[] = [
  {
    title: '概覽',
    items: [
      { name: '儀表板', href: '/dashboard', icon: BarChart3 },
      { name: '我的任務', href: '/dashboard/tasks', icon: Target, badge: 5 },
      { name: '銷售活動', href: '/dashboard/activities', icon: Calendar }
    ]
  },
  {
    title: '客戶管理',
    items: [
      { name: '客戶列表', href: '/dashboard/customers', icon: Users },
      { name: '銷售機會', href: '/dashboard/opportunities', icon: TrendingUp, badge: 12 }
    ]
  }
  // ... 更多分組
]
```

#### 自定義導航

編輯 `dashboard-sidebar.tsx` 中的 `navigation` 數組：

```typescript
// 添加新的導航項目
{
  title: '您的分組',
  items: [
    {
      name: '新頁面',
      href: '/dashboard/new-page',
      icon: YourIcon,
      badge: 10, // 可選：數字徽章
      badge: 'NEW', // 可選：NEW 標籤
      description: '頁面說明（hover 提示）'
    }
  ]
}
```

#### 用戶信息整合

目前使用 mock 數據，實際項目中應整合您的認證系統：

```typescript
// 當前（模板）
const mockUser = {
  first_name: 'Admin',
  last_name: 'User',
  role: 'ADMIN',
  email: 'admin@example.com'
}

// 實際項目
import { useAuth } from '@/hooks/useAuth' // 您的認證 hook
const { user } = useAuth()
```

---

### DashboardHeader

固定頂部導航欄組件，提供全局操作和用戶控制。

#### 功能特性

- ✅ **全局搜索** - 搜索欄支持客戶、文檔、知識搜索
- ✅ **AI 助手快速入口** - 一鍵打開 AI 助手對話
- ✅ **多語言切換** - 支持繁體中文、简体中文、English、日本語
- ✅ **主題切換** - 亮色/暗色模式切換
- ✅ **通知中心** - 顯示通知列表，支持未讀數量徽章
- ✅ **用戶菜單** - 個人資料、帳戶設定、登出

#### 組件結構

```
DashboardHeader
├── 左側：全局搜索欄
└── 右側工具欄
    ├── AI 助手按鈕
    ├── 語言選擇器 (Dropdown)
    ├── 主題切換按鈕
    ├── 通知中心 (Dropdown + Badge)
    └── 用戶菜單 (Dropdown)
```

#### 自定義通知

編輯 `dashboard-header.tsx` 中的 `notifications` 數組：

```typescript
const notifications = [
  {
    id: 1,
    type: 'success', // success | info | warning | error
    title: '通知標題',
    message: '通知內容',
    time: '時間顯示',
    unread: true // 是否未讀
  }
]
```

#### 主題切換實現

當前使用簡單的 DOM 操作，建議實際項目整合 `next-themes`：

```typescript
// 當前（簡單實現）
const toggleDarkMode = () => {
  setIsDarkMode(!isDarkMode)
  document.documentElement.classList.toggle('dark')
}

// 建議（使用 next-themes）
import { useTheme } from 'next-themes'

const { theme, setTheme } = useTheme()
const toggleDarkMode = () => {
  setTheme(theme === 'dark' ? 'light' : 'dark')
}
```

#### 語言切換整合

當前僅前端狀態切換，建議整合 i18n 系統：

```typescript
// 當前
const [currentLanguage, setCurrentLanguage] = useState('zh-TW')

// 建議（使用 next-intl 或 i18next）
import { useLocale, useTranslations } from 'next-intl'
const locale = useLocale()
const t = useTranslations()
```

---

### DashboardLayout

包裝容器組件，整合 Sidebar 和 Header。

#### 功能特性

- ✅ **固定佈局** - Sidebar 和 Header 固定，主內容區域滾動
- ✅ **響應式設計** - 支持桌面和移動端（移動端可擴展）
- ✅ **自動間距** - 自動處理 Sidebar 寬度和內容區域間距

#### 佈局結構

```
┌─────────────────────────────────────────┐
│         DashboardHeader (固定)           │
├──────────┬──────────────────────────────┤
│          │                              │
│ Dashboard│                              │
│ Sidebar  │      主內容區域（滾動）         │
│ (固定)   │                              │
│          │                              │
└──────────┴──────────────────────────────┘
```

#### CSS 佈局原理

```typescript
<div className="min-h-screen">
  {/* Sidebar - 固定左側，寬度 16rem (64 = 256px) */}
  <aside className="fixed inset-y-0 left-0 z-50 w-64 overflow-y-auto">
    <DashboardSidebar />
  </aside>

  {/* 主內容 - 左側留出 Sidebar 空間 */}
  <div className="pl-64">
    {/* Header - 固定頂部 */}
    <DashboardHeader />

    {/* 頁面內容 - 滾動區域 */}
    <main className="p-6">
      {children}
    </main>
  </div>
</div>
```

#### 響應式設計擴展

當前為桌面優先，移動端可擴展：

```typescript
// 添加移動端支持
const [sidebarOpen, setSidebarOpen] = useState(false)

<aside className={cn(
  "fixed inset-y-0 left-0 z-50 w-64 overflow-y-auto",
  "lg:block", // 桌面顯示
  sidebarOpen ? "block" : "hidden" // 移動端切換
)}>
  <DashboardSidebar />
</aside>

<div className="pl-0 lg:pl-64"> {/* 移動端無左邊距 */}
  <DashboardHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
  <main className="p-6">{children}</main>
</div>
```

---

### SalesChart

純 CSS 實現的銷售趨勢圖表組件（無需外部圖表庫）。

#### 功能特性

- ✅ **雙柱狀圖** - 實際銷售額 vs 目標銷售額對比
- ✅ **成交筆數指示器** - 綠色圓形徽章顯示每月成交數
- ✅ **互動式提示** - hover 顯示詳細數值
- ✅ **時間範圍選擇** - 3/6/12 個月切換
- ✅ **統計摘要** - 本月銷售額、目標達成率、總成交筆數
- ✅ **深色模式** - 完整的 dark mode 樣式

#### 數據結構

```typescript
const chartData = [
  {
    month: '1月',      // 月份標籤
    sales: 285000,    // 實際銷售額
    target: 300000,   // 目標銷售額
    deals: 18         // 成交筆數
  }
  // ... 更多月份
]
```

#### 自定義數據

替換 `chartData` 為您的真實數據：

```typescript
// 從 API 獲取數據
const [chartData, setChartData] = useState([])

useEffect(() => {
  async function fetchSalesData() {
    const response = await fetch('/api/sales/trend')
    const data = await response.json()
    setChartData(data)
  }
  fetchSalesData()
}, [])
```

#### 自定義樣式

修改顏色和尺寸：

```typescript
// 實際銷售額柱（藍色）
className="w-8 bg-gradient-to-t from-blue-500 to-blue-400"

// 目標銷售額柱（灰色）
className="w-8 bg-gradient-to-t from-gray-300 to-gray-200"

// 成交筆數指示器（綠色）
className="w-6 h-6 bg-green-500 rounded-full"
```

#### 高度計算原理

```typescript
const maxValue = Math.max(...chartData.map(d => Math.max(d.sales, d.target)))
const minValue = Math.min(...chartData.map(d => Math.min(d.sales, d.target)))

// 計算柱狀圖高度百分比
const salesHeight = ((data.sales - minValue) / (maxValue - minValue)) * 100
```

#### 添加更多圖表類型

目前為柱狀圖，可擴展為折線圖或混合圖：

```typescript
// 添加折線圖
<svg className="absolute inset-0" viewBox="0 0 100 100">
  <polyline
    points={chartData.map((d, i) =>
      `${i * spacing},${100 - (d.sales / maxValue * 100)}`
    ).join(' ')}
    stroke="blue"
    fill="none"
  />
</svg>
```

---

## 完整示例

### 基礎 Dashboard 頁面

```typescript
// app/dashboard/page.tsx
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { SalesChart } from '@/components/dashboard/sales-chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">業績儀表板</h1>

      {/* 統計卡片 */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>總銷售額</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$2,485,000</p>
          </CardContent>
        </Card>
        {/* 更多統計卡片 */}
      </div>

      {/* 銷售趨勢圖表 */}
      <SalesChart />
    </DashboardLayout>
  )
}
```

### 自定義導航的 Dashboard

```typescript
// 修改 components/layout/dashboard-sidebar.tsx
const navigation: NavigationSection[] = [
  {
    title: '您的業務',
    items: [
      { name: '業務總覽', href: '/business', icon: BarChart3 },
      { name: '訂單管理', href: '/orders', icon: ShoppingCart, badge: 8 },
      { name: '庫存管理', href: '/inventory', icon: Package }
    ]
  },
  {
    title: '數據分析',
    items: [
      { name: '銷售分析', href: '/analytics/sales', icon: TrendingUp },
      { name: '用戶分析', href: '/analytics/users', icon: Users },
      { name: '報表中心', href: '/reports', icon: FileText, badge: 'NEW' }
    ]
  }
]
```

### 整合真實數據

```typescript
// app/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

export default function DashboardPage() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    async function loadDashboardData() {
      const response = await fetch('/api/dashboard/stats')
      const data = await response.json()
      setStats(data)
    }
    loadDashboardData()
  }, [])

  if (!stats) return <div>載入中...</div>

  return (
    <DashboardLayout>
      {/* 使用真實數據渲染 */}
      <h1>{stats.title}</h1>
      {/* ... */}
    </DashboardLayout>
  )
}
```

---

## 樣式定制

### 修改 Sidebar 寬度

```typescript
// 修改 dashboard-layout.tsx
<aside className="fixed inset-y-0 left-0 z-50 w-80"> {/* 從 w-64 改為 w-80 */}
  <DashboardSidebar />
</aside>

<div className="pl-80"> {/* 從 pl-64 改為 pl-80 */}
  {/* ... */}
</div>
```

### 修改主題顏色

```typescript
// 修改 tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6', // 主色調
          dark: '#2563EB'
        }
      }
    }
  }
}

// 在組件中使用
className="bg-primary text-white"
```

### 自定義 Header 高度

```typescript
// 修改 dashboard-header.tsx
<header className="h-20"> {/* 從 h-16 改為 h-20 */}
  {/* ... */}
</header>
```

---

## 最佳實踐

### 1. 路由組織

建議使用 Next.js App Router 的路由組織：

```
app/
├── (dashboard)/          # 路由組 (不影響 URL)
│   ├── layout.tsx       # 使用 DashboardLayout
│   ├── dashboard/
│   │   └── page.tsx     # /dashboard
│   ├── customers/
│   │   └── page.tsx     # /customers
│   └── analytics/
│       └── page.tsx     # /analytics
└── (auth)/
    ├── login/
    └── register/
```

### 2. 權限控制

在 Sidebar 導航中添加權限檢查：

```typescript
const navigation = [
  {
    title: '管理員功能',
    items: [
      {
        name: '用戶管理',
        href: '/admin/users',
        icon: Users,
        permission: 'ADMIN' // 添加權限字段
      }
    ]
  }
]

// 渲染時檢查權限
{section.items
  .filter(item => !item.permission || hasPermission(item.permission))
  .map(item => (
    <Link key={item.name} href={item.href}>
      {item.name}
    </Link>
  ))
}
```

### 3. 載入狀態

為異步數據添加 loading 狀態：

```typescript
export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return <DashboardLayout>{/* 內容 */}</DashboardLayout>
}
```

### 4. 錯誤處理

添加錯誤邊界處理：

```typescript
// app/error.tsx
'use client'

export default function Error({ error, reset }: {
  error: Error
  reset: () => void
}) {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4">出現錯誤</h2>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <button onClick={reset} className="px-4 py-2 bg-blue-600 text-white rounded">
          重試
        </button>
      </div>
    </DashboardLayout>
  )
}
```

---

## 進階技巧

### 1. 動態導航生成

從 API 或配置文件動態生成導航：

```typescript
// lib/navigation-config.ts
export async function getNavigationForUser(userId: string) {
  const user = await getUserPermissions(userId)

  return [
    {
      title: '概覽',
      items: [
        { name: '儀表板', href: '/dashboard', icon: BarChart3 },
        ...(user.canAccessTasks ? [
          { name: '我的任務', href: '/tasks', icon: Target, badge: await getTaskCount(userId) }
        ] : [])
      ]
    }
  ]
}
```

### 2. 實時通知

使用 WebSocket 或 Server-Sent Events 實現實時通知：

```typescript
// hooks/useNotifications.ts
import { useEffect, useState } from 'react'

export function useNotifications() {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const ws = new WebSocket('ws://your-api.com/notifications')

    ws.onmessage = (event) => {
      const newNotification = JSON.parse(event.data)
      setNotifications(prev => [newNotification, ...prev])
    }

    return () => ws.close()
  }, [])

  return notifications
}

// 在 DashboardHeader 中使用
const notifications = useNotifications()
```

### 3. 分析追蹤

添加用戶行為追蹤：

```typescript
// 在導航項目點擊時追蹤
<Link
  href={item.href}
  onClick={() => {
    // 追蹤導航點擊
    analytics.track('navigation_click', {
      page: item.name,
      href: item.href
    })
  }}
>
  {item.name}
</Link>
```

### 4. 性能優化

使用 React.memo 和 useMemo 優化渲染：

```typescript
// 優化 Sidebar 導航項目渲染
const NavigationItem = React.memo(({ item, isActive }: {
  item: NavigationItem
  isActive: boolean
}) => {
  return (
    <Link href={item.href} className={cn(isActive && 'bg-blue-50')}>
      <item.icon className="h-5 w-5" />
      <span>{item.name}</span>
    </Link>
  )
})

// 優化圖表數據計算
const chartStats = useMemo(() => ({
  maxValue: Math.max(...chartData.map(d => d.sales)),
  totalSales: chartData.reduce((sum, d) => sum + d.sales, 0)
}), [chartData])
```

---

## 常見問題

### Q1: 如何添加移動端響應式支持？

當前組件是桌面優先設計，移動端需要添加漢堡菜單和側邊欄切換：

```typescript
// 修改 DashboardLayout
const [sidebarOpen, setSidebarOpen] = useState(false)

<aside className={cn(
  "fixed inset-y-0 left-0 z-50 w-64",
  "lg:block", // 桌面總是顯示
  sidebarOpen ? "block" : "hidden" // 移動端切換
)}>
  <DashboardSidebar onClose={() => setSidebarOpen(false)} />
</aside>

// 在 Header 添加漢堡菜單按鈕
<button
  className="lg:hidden"
  onClick={() => setSidebarOpen(true)}
>
  <Menu className="h-6 w-6" />
</button>
```

### Q2: 如何整合 next-themes 進行主題管理？

```bash
npm install next-themes
```

```typescript
// app/providers.tsx
'use client'
import { ThemeProvider } from 'next-themes'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      {children}
    </ThemeProvider>
  )
}

// 修改 dashboard-header.tsx
import { useTheme } from 'next-themes'

const { theme, setTheme } = useTheme()

<Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
  {theme === 'dark' ? <Sun /> : <Moon />}
</Button>
```

### Q3: 如何添加面包屑導航？

在 DashboardHeader 添加面包屑：

```typescript
// components/layout/breadcrumb.tsx
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export function Breadcrumb({ items }: { items: Array<{ label: string; href?: string }> }) {
  return (
    <nav className="flex items-center space-x-2 text-sm">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />}
          {item.href ? (
            <Link href={item.href} className="text-gray-600 hover:text-gray-900">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
```

### Q4: 圖表數據量大時如何優化性能？

使用虛擬化或數據採樣：

```typescript
// 數據採樣
const sampleData = useMemo(() => {
  if (rawData.length <= 50) return rawData

  const step = Math.ceil(rawData.length / 50)
  return rawData.filter((_, index) => index % step === 0)
}, [rawData])

// 或使用 react-window 進行虛擬化
import { FixedSizeList } from 'react-window'
```

### Q5: 如何實現多層級導航（子菜單）？

修改 Sidebar 支持嵌套結構：

```typescript
interface NavigationItem {
  name: string
  href?: string
  icon: React.ComponentType
  children?: NavigationItem[] // 添加子項目
}

// 渲染邏輯
{item.children ? (
  <details>
    <summary>{item.name}</summary>
    <ul className="pl-4">
      {item.children.map(child => (
        <li key={child.name}>
          <Link href={child.href}>{child.name}</Link>
        </li>
      ))}
    </ul>
  </details>
) : (
  <Link href={item.href}>{item.name}</Link>
)}
```

---

## 技術細節

### 依賴項

所有組件依賴已包含在模板的 `package.json` 中：

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "lucide-react": "^0.312.0",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-badge": "^1.0.4",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  }
}
```

### 瀏覽器兼容性

- Chrome/Edge: ✅ 完全支持
- Firefox: ✅ 完全支持
- Safari: ✅ 完全支持（iOS 12+）
- IE11: ❌ 不支持（需要 polyfills）

### 無障礙性 (Accessibility)

所有組件遵循 WCAG 2.1 AA 標準：

- ✅ 鍵盤導航支持
- ✅ ARIA 標籤完整
- ✅ 焦點管理
- ✅ 語義化 HTML
- ✅ 屏幕閱讀器友好

---

## 更新日誌

### v1.0.0 (2025-10-13)
- ✨ 初始發布
- ✨ 從 AI Sales Enablement Platform 提取並優化
- ✨ 完整的 Dashboard 組件系統
- ✨ 深色模式支持
- ✨ 純 CSS 圖表實現
- ✨ 完整的 TypeScript 類型定義

---

## 支持

如有問題或建議，請：

1. 查看本指南的常見問題部分
2. 參考模板項目的示範實現 (`app/dashboard/page.tsx`)
3. 查看原始源項目（AI Sales Enablement Platform）的完整實現

---

## 授權

這些組件源自真實企業級應用，按照 MIT 授權提供。

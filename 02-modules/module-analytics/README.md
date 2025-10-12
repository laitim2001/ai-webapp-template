# Analytics Module (module-analytics)

完整的用戶行為追蹤與數據分析系統，支援事件追蹤、會話管理、漏斗分析、同期群分析和實時數據可視化。

## 📋 功能特色

### 1. 事件追蹤系統
- **自動追蹤**: 頁面瀏覽、用戶操作自動記錄
- **自定義事件**: 支援自定義事件類型和屬性
- **會話管理**: 自動生成和管理用戶會話
- **批次處理**: 高效的批次事件儲存機制
- **設備檢測**: 自動識別設備類型、瀏覽器、作業系統
- **隱私合規**: 符合 GDPR/CCPA 隱私規範的追蹤方式

### 2. 數據分析與報表
- **核心指標**: 總用戶數、會話數、跳出率、平均停留時間
- **時間序列**: 支援按小時、日、週、月分組的趨勢分析
- **漏斗分析**: 多步驟轉化漏斗追蹤與分析
- **同期群分析**: 用戶留存率和生命週期分析
- **熱門內容**: 最常訪問頁面、最頻繁事件統計
- **用戶分佈**: 設備、瀏覽器、作業系統分佈統計

### 3. 實時儀表板
- **即時數據**: 實時更新的分析數據展示
- **多種圖表**: 折線圖、柱狀圖、圓餅圖等多種可視化方式
- **日期範圍**: 靈活的時間範圍選擇（今天、昨天、最近7天等）
- **數據導出**: 支援 CSV 和 JSON 格式數據導出
- **響應式設計**: 完美適配各種螢幕尺寸
- **性能優化**: 使用 recharts 實現高性能圖表渲染

## 📁 模組結構

```
02-modules/module-analytics/
├── lib/
│   └── analytics/
│       ├── tracker.ts.template          # 事件追蹤器 (~470 行)
│       ├── reporter.ts.template         # 數據報表生成器 (~390 行)
│       └── __tests__/
│           ├── tracker.test.ts.template  # 追蹤器測試 (~200 行)
│           └── reporter.test.ts.template # 報表器測試 (~240 行)
│
├── types/
│   └── analytics.d.ts.template          # TypeScript 類型定義 (~320 行)
│
├── components/
│   └── AnalyticsDashboard.tsx.template  # 分析儀表板組件 (~380 行)
│
└── README.md                             # 本文件 (~300 行)
```

**總計**:
- 原始碼: ~1,240 行
- 測試: ~440 行
- 類型定義: ~320 行
- 文檔: ~300 行
- **總行數: ~2,300 行**

## 🔧 安裝步驟

### 步驟 1: 複製模組文件

在項目初始化時，CLI 會將此模組複製到您的項目根目錄。

### 步驟 2: 環境變數配置

添加到 `.env.local`:

```bash
# Analytics Configuration
ANALYTICS_PROJECT_ID=your-project-id
ANALYTICS_AUTO_TRACKING=true
ANALYTICS_BATCH_SIZE=10
ANALYTICS_FLUSH_INTERVAL=5000
ANALYTICS_DEBUG=false
```

### 步驟 3: 資料庫架構

需要以下資料表:

#### AnalyticsEvent 表
```prisma
model AnalyticsEvent {
  id          String    @id @default(cuid())
  projectId   String
  eventType   String
  eventName   String
  userId      String?
  sessionId   String?
  timestamp   DateTime  @default(now())
  properties  Json?
  pageUrl     String?
  referrer    String?
  userAgent   String?
  ipAddress   String?
  deviceType  String?
  browser     String?
  os          String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([projectId, timestamp])
  @@index([userId])
  @@index([sessionId])
  @@index([eventType])
}
```

#### AnalyticsSession 表
```prisma
model AnalyticsSession {
  id               String    @id @default(cuid())
  sessionId        String    @unique
  projectId        String
  userId           String?
  startTime        DateTime  @default(now())
  endTime          DateTime?
  lastActivityTime DateTime  @default(now())
  pageViews        Int       @default(0)
  events           Int       @default(0)
  deviceType       String?
  browser          String?
  os               String?
  ipAddress        String?
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt

  @@index([projectId, startTime])
  @@index([userId])
  @@index([sessionId])
}
```

### 步驟 4: 安裝依賴

```bash
npm install recharts       # 圖表庫
npm install date-fns       # 日期處理
```

## 📖 使用方法

### 初始化追蹤器

```typescript
import { initTracker } from '@/lib/analytics/tracker';

// 在應用啟動時初始化
initTracker({
  projectId: process.env.ANALYTICS_PROJECT_ID!,
  userId: currentUser?.id,
  enableAutoTracking: true,
  batchSize: 10,
  flushInterval: 5000,
  debug: process.env.NODE_ENV === 'development',
});
```

### 追蹤頁面瀏覽

```typescript
import { trackPageView } from '@/lib/analytics/tracker';

// 自動追蹤（enableAutoTracking: true 時自動執行）
// 或手動追蹤
trackPageView({
  url: window.location.href,
  title: document.title,
  referrer: document.referrer,
  properties: {
    category: 'product',
    productId: '123',
  },
});
```

### 追蹤自定義事件

```typescript
import { track } from '@/lib/analytics/tracker';

// 追蹤按鈕點擊
track({
  eventType: 'click',
  eventName: 'Purchase Button Click',
  properties: {
    buttonId: 'buy-now',
    productId: '123',
    price: 99.99,
  },
});

// 追蹤表單提交
track({
  eventType: 'form_submit',
  eventName: 'Contact Form Submit',
  properties: {
    formId: 'contact-form',
    fields: ['name', 'email', 'message'],
  },
});

// 追蹤購買事件
track({
  eventType: 'purchase',
  eventName: 'Product Purchase',
  properties: {
    productId: '123',
    amount: 99.99,
    currency: 'USD',
    quantity: 1,
  },
});
```

### 使用分析儀表板

```typescript
import AnalyticsDashboard from '@/components/AnalyticsDashboard';

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto py-8">
      <AnalyticsDashboard projectId={process.env.ANALYTICS_PROJECT_ID!} />
    </div>
  );
}
```

### 生成分析報表

```typescript
import { reporter } from '@/lib/analytics/reporter';

// 獲取核心指標
const metrics = await reporter.getMetrics({
  projectId: 'your-project-id',
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-01-31'),
});

console.log('總用戶數:', metrics.totalUsers);
console.log('總會話數:', metrics.totalSessions);
console.log('跳出率:', metrics.bounceRate);
console.log('平均會話時長:', metrics.avgSessionDuration);

// 獲取時間序列數據
const timeSeries = await reporter.getTimeSeries({
  projectId: 'your-project-id',
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-01-31'),
  groupBy: 'day',
});

// 漏斗分析
const funnel = await reporter.analyzeFunnel(
  'your-project-id',
  [
    { name: '查看產品', eventName: 'Product View' },
    { name: '加入購物車', eventName: 'Add to Cart' },
    { name: '開始結帳', eventName: 'Checkout Start' },
    { name: '完成購買', eventName: 'Purchase Complete' },
  ],
  new Date('2024-01-01'),
  new Date('2024-01-31')
);

console.log('總用戶數:', funnel.totalUsers);
console.log('整體轉化率:', funnel.overallConversionRate);

// 同期群分析
const cohorts = await reporter.analyzeCohorts(
  'your-project-id',
  new Date('2024-01-01'),
  new Date('2024-12-31'),
  12 // 12 個月
);

// 導出數據
const exportData = await reporter.exportData(
  {
    projectId: 'your-project-id',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-31'),
  },
  'csv'
);
```

### API 路由範例

```typescript
// app/api/analytics/metrics/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { reporter } from '@/lib/analytics/reporter';

export async function POST(request: NextRequest) {
  const { projectId, startDate, endDate } = await request.json();

  const metrics = await reporter.getMetrics({
    projectId,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
  });

  return NextResponse.json(metrics);
}
```

```typescript
// app/api/analytics/time-series/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { reporter } from '@/lib/analytics/reporter';

export async function POST(request: NextRequest) {
  const { projectId, startDate, endDate, groupBy } = await request.json();

  const timeSeries = await reporter.getTimeSeries({
    projectId,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    groupBy,
  });

  return NextResponse.json(timeSeries);
}
```

```typescript
// app/api/analytics/export/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { reporter } from '@/lib/analytics/reporter';

export async function POST(request: NextRequest) {
  const { projectId, startDate, endDate, format } = await request.json();

  const exportData = await reporter.exportData(
    {
      projectId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    },
    format
  );

  if (format === 'csv') {
    const csv = reporter.convertToCSV(exportData.data);
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="analytics-export.csv"`,
      },
    });
  }

  return NextResponse.json(exportData.data);
}
```

## 📊 API 參考

### Tracker API

#### `initTracker(config: TrackerConfig): AnalyticsTracker`
初始化全局追蹤器實例。

**參數**:
- `projectId` - 項目 ID（必填）
- `userId` - 用戶 ID（可選）
- `sessionId` - 會話 ID（可選，自動生成）
- `enableAutoTracking` - 啟用自動頁面追蹤（預設: true）
- `batchSize` - 批次大小（預設: 10）
- `flushInterval` - 刷新間隔毫秒數（預設: 5000）
- `debug` - 調試模式（預設: false）

#### `track(event: CustomEvent): void`
追蹤自定義事件。

**參數**:
- `eventType` - 事件類型
- `eventName` - 事件名稱
- `properties` - 事件屬性（可選）

#### `trackPageView(event: PageViewEvent): void`
追蹤頁面瀏覽。

**參數**:
- `url` - 頁面 URL
- `title` - 頁面標題
- `referrer` - 來源 URL（可選）
- `properties` - 自定義屬性（可選）

### Reporter API

#### `getMetrics(options: ReportOptions): Promise<AnalyticsMetrics>`
獲取分析指標。

**返回**: 包含總用戶數、總會話數、跳出率等核心指標的對象。

#### `getTimeSeries(options: ReportOptions): Promise<TimeSeriesData[]>`
獲取時間序列數據。

**參數**:
- `groupBy` - 分組方式: 'hour' | 'day' | 'week' | 'month'

**返回**: 時間序列數據數組。

#### `analyzeFunnel(projectId, steps, startDate, endDate): Promise<FunnelAnalysis>`
分析轉化漏斗。

**參數**:
- `steps` - 漏斗步驟數組
- 每個步驟包含 `name` 和 `eventName`

**返回**: 漏斗分析結果，包含各步驟用戶數和轉化率。

#### `analyzeCohorts(projectId, startDate, endDate, periods): Promise<CohortData[]>`
分析用戶同期群留存。

**參數**:
- `periods` - 分析週期數（預設: 12）

**返回**: 同期群數據數組。

#### `exportData(options, format): Promise<ExportFormat>`
導出分析數據。

**參數**:
- `format` - 'csv' | 'json'

**返回**: 導出數據對象。

## 🔐 隱私與安全

### GDPR/CCPA 合規
1. **用戶同意**: 實施追蹤前獲取用戶同意
2. **數據匿名化**: 支援匿名追蹤模式
3. **IP 地址**: 可配置是否記錄 IP 地址
4. **數據保留**: 實施數據保留策略
5. **用戶權利**: 支援數據訪問和刪除請求

### 安全最佳實踐
1. **輸入驗證**: 驗證所有事件屬性
2. **速率限制**: 防止追蹤濫用
3. **數據加密**: 傳輸和存儲時加密敏感數據
4. **訪問控制**: 限制分析數據訪問權限

## 🎯 性能優化

### 批次處理
- 事件自動批次儲存，減少資料庫寫入次數
- 可配置批次大小和刷新間隔

### 索引優化
- 為常用查詢字段建立資料庫索引
- 時間範圍查詢優化

### 緩存策略
- 報表數據可緩存以提高響應速度
- 使用 Redis 緩存熱門查詢結果

## 📝 測試

模組包含 30+ 單元測試，覆蓋率 >85%:

```bash
# 運行測試
npm test -- module-analytics

# 運行測試覆蓋率報告
npm test -- --coverage module-analytics
```

## 📈 使用場景

### 1. 電子商務
- 追蹤產品瀏覽、加入購物車、購買轉化
- 分析購買漏斗，優化轉化率
- 追蹤用戶留存和復購率

### 2. SaaS 應用
- 追蹤功能使用情況
- 分析用戶參與度
- 監控用戶流失和留存

### 3. 內容網站
- 追蹤文章閱讀量
- 分析用戶閱讀行為
- 優化內容推薦

### 4. 移動應用
- 追蹤應用使用情況
- 分析用戶路徑
- 優化用戶體驗

## ⚠️ 資料庫適配器轉換

**狀態**: ✅ 已完成 - 使用資料庫適配器層

此模組已經使用資料庫適配器抽象層，支援多種資料庫：
- PostgreSQL
- MySQL
- MongoDB
- SQLite

## 🔄 版本歷史

- **v5.0** (2025-10-10): 初始提取
  - 完整的事件追蹤系統（470 行）
  - 數據分析報表生成（390 行）
  - 實時分析儀表板（380 行）
  - TypeScript 類型定義（320 行）
  - 30+ 單元測試（440 行）
  - 漏斗分析功能
  - 同期群分析功能
  - 數據導出功能

## 📄 授權

AI Web App Template v5.0 的一部分

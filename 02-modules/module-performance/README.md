# 性能監控模組 (Performance Module)

**版本**: 5.0
**狀態**: 生產就緒
**創建日期**: 2025-10-10

## 📋 概述

性能監控模組為您的 Next.js 應用提供全面的性能監控、查詢優化和響應緩存功能。從 AI 銷售賦能平台提取，經過生產環境驗證。

## 🎯 功能特性

### 1. 性能監控 (`lib/performance/monitor.ts`)
- **API 性能追蹤**: 記錄所有 API 請求的響應時間、狀態碼和資源使用情況
- **數據庫持久化**: 批次寫入指標到 PostgreSQL 進行長期存儲
- **實時警報**: 檢測慢查詢、大響應和服務器錯誤
- **性能報告**: 基於 SQL 的詳細性能分析報告，含百分位數
- **中間件整合**: 易用的 `withPerformanceTracking` 中間件
- **Core Web Vitals**: 追蹤前端性能指標，整合 Google Analytics
- **資源監控**: 監控 Node.js 內存和 CPU 使用量
- **自動清理**: 自動清理過期的性能數據

### 2. 查詢優化 (`lib/performance/query-optimizer.ts`)
- **N+1 查詢檢測**: 識別並防止 N+1 查詢問題
- **DataLoader 整合**: 批次加載並自動去重
- **批量查詢優化**: 並行執行多個查詢
- **查詢分析**: 追蹤查詢性能並識別瓶頸
- **智能緩存**: 內建查詢結果緩存
- **性能建議**: 自動生成優化建議

### 3. 響應緩存 (`lib/performance/response-cache.ts`)
- **HTTP 響應緩存**: 智能 API 響應緩存
- **ETag 支持**: 支持條件請求（304 響應）
- **標籤失效**: 按標籤批量失效緩存
- **緩存統計**: 詳細的命中率和內存使用追蹤
- **靈活配置**: TTL、緩存鍵、變化因子
- **自動清理**: 定期清理過期的緩存條目

## 📦 安裝配置

### 1. 模組整合

複製模組到您的項目：
```bash
cp -r 02-modules/module-performance/lib/performance lib/
```

### 2. Prisma Schema

性能監控使用 PostgreSQL 表格。添加到您的 `prisma/schema.prisma`（如果使用數據庫持久化）：

```prisma
model PerformanceMetric {
  id            Int      @id @default(autoincrement())
  endpoint      String
  method        String
  duration      Int
  response_size Int?
  status_code   Int
  user_id       Int?
  timestamp     DateTime @default(now())
  memory_usage  BigInt?
  cpu_usage     Float?
  cache_hit     Boolean  @default(false)
  error_message String?
  created_at    DateTime @default(now())

  @@index([endpoint, timestamp])
  @@index([duration])
  @@map("performance_metrics")
}
```

然後執行：
```bash
npx prisma migrate dev --name add-performance-metrics
npx prisma generate
```

### 3. 環境變量

添加到您的 `.env.local`：
```bash
# 性能模組配置（可選）
ENABLE_PERFORMANCE_MONITORING=true
PERFORMANCE_BATCH_SIZE=100
PERFORMANCE_FLUSH_INTERVAL=30000
PERFORMANCE_RETENTION_DAYS=30
```

## 🚀 使用方法

### 性能監控

#### 基本 API 追蹤

```typescript
// app/api/users/route.ts
import { withPerformanceTracking } from '@/lib/performance/monitor';

export const GET = withPerformanceTracking(async (request: NextRequest) => {
  const users = await db.users.findMany();
  return NextResponse.json(users);
});
```

#### 手動指標追蹤

```typescript
import { PerformanceMonitor } from '@/lib/performance/monitor';

const monitor = PerformanceMonitor.getInstance();

await monitor.trackMetric({
  endpoint: '/api/custom',
  method: 'POST',
  duration: 150,
  response_size: 1024,
  status_code: 200,
  user_id: 123,
  cache_hit: false
});
```

#### 性能報告

```typescript
// 獲取最近 24 小時的性能報告
const report = await monitor.getPerformanceReport('24h');

// 獲取實時指標（最近 5 分鐘）
const realtime = await monitor.getRealTimeMetrics();

// 清理舊數據（30 天前）
await monitor.cleanup(30);
```

#### Core Web Vitals 追蹤

```typescript
// app/layout.tsx 或組件中
import { CoreWebVitalsTracker } from '@/lib/performance/monitor';

// 追蹤 LCP（最大內容繪製）
CoreWebVitalsTracker.trackMetric('LCP', 2500, 'unique-id');

// 追蹤 FID（首次輸入延遲）
CoreWebVitalsTracker.trackMetric('FID', 100, 'unique-id');

// 追蹤 CLS（累積佈局偏移）
CoreWebVitalsTracker.trackMetric('CLS', 0.1, 'unique-id');
```

### 查詢優化

#### 使用 DataLoader 防止 N+1 查詢

```typescript
import { createDataLoader } from '@/lib/performance/query-optimizer';

// 為用戶創建 DataLoader
const userLoader = createDataLoader('users', async (ids) => {
  return await db.users.findMany({
    where: { id: { in: ids } }
  });
});

// 高效加載多個用戶（批次處理）
const users = await Promise.all(
  userIds.map(id => userLoader.load(id))
);
```

#### 批量查詢執行

```typescript
import { batchQuery } from '@/lib/performance/query-optimizer';

const results = await batchQuery([
  { type: 'users', ids: [1, 2, 3] },
  { type: 'posts', ids: [10, 20, 30] },
  { type: 'comments', ids: [100, 200] }
]);
```

#### 查詢性能追蹤

```typescript
import { trackQuery } from '@/lib/performance/query-optimizer';

const result = await trackQuery('getUserProfile', async () => {
  return await db.users.findUnique({
    where: { id },
    include: { posts: true, comments: true }
  });
});
```

#### 性能分析

```typescript
import { QueryOptimizer } from '@/lib/performance/query-optimizer';

// 獲取查詢統計
const stats = QueryOptimizer.getQueryStats();

// 檢測 N+1 查詢問題
const nPlusOneIssues = QueryOptimizer.detectNPlusOne();

// 查找慢查詢
const slowQueries = QueryOptimizer.getSlowQueries(1000); // > 1 秒

// 生成優化報告
const report = QueryOptimizer.generateOptimizationReport();
```

### 響應緩存

#### API 路由緩存

```typescript
// app/api/products/route.ts
import { withCache } from '@/lib/performance/response-cache';

export const GET = withCache(
  async (request) => {
    const products = await db.products.findMany();
    return NextResponse.json(products);
  },
  {
    ttl: 300,  // 5 分鐘
    tags: ['products'],
    varyBy: ['userId']
  }
);
```

#### 數據緩存函數

```typescript
import { cacheResponse } from '@/lib/performance/response-cache';

const cachedData = await cacheResponse(
  'products-list',
  async () => {
    return await expensiveOperation();
  },
  { ttl: 600, tags: ['products'] }
);
```

#### 緩存管理

```typescript
import {
  invalidateCache,
  invalidateCacheByTag,
  clearCache,
  getCacheStats
} from '@/lib/performance/response-cache';

// 失效特定緩存鍵
invalidateCache('products-list');

// 按標籤失效所有緩存
invalidateCacheByTag('products');

// 清空所有緩存
clearCache();

// 獲取緩存統計
const stats = getCacheStats();
console.log(`命中率: ${stats.hitRate * 100}%`);
console.log(`內存使用: ${stats.memoryUsage} 字節`);
```

## 📊 監控與儀表板

### 性能指標儀表板

創建管理儀表板來可視化性能數據：

```typescript
// app/admin/performance/page.tsx
import { PerformanceMonitor } from '@/lib/performance/monitor';

export default async function PerformanceDashboard() {
  const monitor = PerformanceMonitor.getInstance();
  const report = await monitor.getPerformanceReport('24h');
  const realtime = await monitor.getRealTimeMetrics();

  return (
    <div>
      <h1>性能監控儀表板</h1>

      <div className="realtime-metrics">
        <div>平均響應時間: {realtime.avg_response_time}ms</div>
        <div>總請求數: {realtime.total_requests}</div>
        <div>緩存命中率: {realtime.cache_hit_rate}%</div>
        <div>錯誤率: {realtime.error_rate}%</div>
      </div>

      <table>
        <thead>
          <tr>
            <th>端點</th>
            <th>請求數</th>
            <th>平均耗時</th>
            <th>P95 耗時</th>
            <th>錯誤率</th>
          </tr>
        </thead>
        <tbody>
          {report.map(row => (
            <tr key={row.endpoint}>
              <td>{row.endpoint}</td>
              <td>{row.request_count}</td>
              <td>{row.avg_duration.toFixed(2)}ms</td>
              <td>{row.p95_duration.toFixed(2)}ms</td>
              <td>{row.error_rate.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

## 🧪 測試

模組包含 120+ 測試的完整測試套件：

```bash
# 運行所有性能模組測試
npm test -- lib/performance

# 運行特定測試文件
npm test -- lib/performance/__tests__/monitor.test.ts

# 運行測試覆蓋率
npm test -- --coverage lib/performance
```

測試覆蓋包括：
- ✅ 單例模式驗證
- ✅ 性能指標追蹤
- ✅ 批次寫入機制
- ✅ 警報系統
- ✅ 報告生成
- ✅ 中間件整合
- ✅ DataLoader 功能
- ✅ 查詢優化
- ✅ 響應緩存
- ✅ 緩存失效
- ✅ 錯誤處理

## ⚙️ 配置選項

### 性能監控選項

```typescript
// 自定義批次大小和刷新間隔
const monitor = PerformanceMonitor.getInstance();
// 訪問私有屬性進行配置（如需要）
// 注意：這是內部 API，建議使用環境變量
```

### 查詢優化器選項

```typescript
import { QueryOptimizer } from '@/lib/performance/query-optimizer';

QueryOptimizer.configure({
  enableCache: true,
  enableTracking: true,
  maxBatchSize: 100,
  batchDelay: 10,
  cacheMaxSize: 1000,
  cacheTTL: 300000  // 5 分鐘
});
```

### 響應緩存選項

```typescript
import { ResponseCache } from '@/lib/performance/response-cache';

// 全局啟用/禁用緩存
ResponseCache.enable();
ResponseCache.disable();

// 檢查緩存是否啟用
const isEnabled = ResponseCache.isEnabled();

// 手動清理過期緩存
const removedCount = ResponseCache.cleanup();
```

## 🔧 高級用法

### 自定義性能警報

```typescript
import { PerformanceMonitor, PerformanceMetric } from '@/lib/performance/monitor';

class CustomMonitor extends PerformanceMonitor {
  protected checkPerformanceAlerts(metric: PerformanceMetric) {
    super.checkPerformanceAlerts(metric);

    // 自定義警報邏輯
    if (metric.duration > 5000) {
      // 發送警報到 Slack、PagerDuty 等
      sendAlert(`嚴重: ${metric.endpoint} 耗時 ${metric.duration}ms`);
    }
  }
}
```

### 多數據庫查詢優化

```typescript
import { QueryOptimizer } from '@/lib/performance/query-optimizer';

// 為不同數據庫適配器配置
const postgresLoader = QueryOptimizer.createLoader('postgres-users', async (ids) => {
  return await postgresDb.users.findMany({ where: { id: { in: ids } } });
});

const mongoLoader = QueryOptimizer.createLoader('mongo-logs', async (ids) => {
  return await mongoDb.collection('logs').find({ _id: { $in: ids } }).toArray();
});
```

### 條件緩存

```typescript
import { withCache } from '@/lib/performance/response-cache';

export const GET = withCache(
  async (request) => {
    // 您的 API 邏輯
  },
  {
    ttl: 300,
    condition: (request) => {
      // 只為非管理員用戶緩存
      const userRole = request.headers.get('x-user-role');
      return userRole !== 'admin';
    }
  }
);
```

## 📈 性能優化技巧

### 1. 防止 N+1 查詢
**錯誤示例**:
```typescript
// N+1 查詢問題
const posts = await db.posts.findMany();
for (const post of posts) {
  const author = await db.users.findUnique({ where: { id: post.authorId } });
  // ...
}
```

**正確示例**:
```typescript
// 使用 DataLoader
const userLoader = createDataLoader('users', async (ids) => {
  return await db.users.findMany({ where: { id: { in: ids } } });
});

const posts = await db.posts.findMany();
const authors = await Promise.all(
  posts.map(post => userLoader.load(post.authorId))
);
```

### 2. 響應緩存策略
- 穩定數據（產品目錄、配置）使用長 TTL（小時/天）
- 頻繁訪問數據（用戶資料）使用適中 TTL（分鐘）
- 個性化或敏感數據不緩存，或使用適當的 vary-by 因子
- 使用標籤將需要一起失效的相關緩存分組

### 3. 查詢追蹤
- 始終追蹤慢查詢（>1 秒）以進行優化
- 監控緩存命中率以驗證緩存效果
- 對相關數據獲取使用批量查詢
- 定期查看查詢統計和優化報告

## 🔗 與其他模組整合

### 與 API Gateway 模組整合
```typescript
// 結合速率限制和認證
import { withPerformanceTracking } from '@/lib/performance/monitor';
import { withRateLimit } from '@/lib/api/rate-limiter';
import { withAuth } from '@/lib/auth/middleware';

export const GET = withPerformanceTracking(
  withRateLimit(
    withAuth(async (request) => {
      // 您的 API 邏輯
    })
  )
);
```

### 與緩存模組整合
```typescript
// 使用 Redis 進行分佈式緩存
import { cacheResponse } from '@/lib/performance/response-cache';
import { redisCache } from '@/lib/cache/redis-adapter';

const data = await cacheResponse(
  'expensive-query',
  async () => {
    return await expensiveOperation();
  },
  { ttl: 600 }
);
```

## 📚 API 參考

### PerformanceMonitor

- `getInstance()`: 獲取單例實例
- `trackMetric(metric)`: 記錄性能指標
- `getPerformanceReport(timeRange)`: 生成性能報告
- `getRealTimeMetrics()`: 獲取實時指標
- `cleanup(retentionDays)`: 清理舊指標

### QueryOptimizer

- `createLoader(name, batchLoadFn, config)`: 創建 DataLoader
- `batchQuery(requests)`: 執行批量查詢
- `trackQuery(name, queryFn)`: 追蹤查詢性能
- `detectNPlusOne(threshold)`: 檢測 N+1 問題
- `getSlowQueries(thresholdMs)`: 查找慢查詢
- `generateOptimizationReport()`: 生成優化報告

### ResponseCache

- `cache(key, getData, config)`: 緩存數據
- `wrap(handler, config)`: 包裝 API 處理器並緩存
- `invalidate(key)`: 失效特定緩存
- `invalidateByTag(tag)`: 按標籤失效
- `clear()`: 清空所有緩存
- `getStats()`: 獲取緩存統計

## 🐛 故障排除

### 性能指標未被保存
- 確保 Prisma schema 包含 `performance_metrics` 表
- 檢查數據庫連接和權限
- 驗證批次大小和刷新間隔設置
- 檢查控制台錯誤消息

### DataLoader 未批處理查詢
- 確保 DataLoader 在請求間重用（不是每次都重新創建）
- 檢查 load() 調用在同一事件循環內進行
- 驗證 batchLoadFn 返回的數組長度與鍵匹配

### 緩存未工作
- 檢查緩存是否啟用: `ResponseCache.isEnabled()`
- 驗證緩存鍵一致
- 檢查 TTL 值是否合適
- 查看緩存統計的命中/未命中率

### 高內存使用
- 減少緩存 TTL 和最大大小
- 調整監控的批次大小
- 啟用自動清理
- 查看 DataLoader 緩存映射

## 📄 授權

MIT 授權 - 查看根目錄 LICENSE 文件

## 🤝 貢獻

此模組從 AI 銷售賦能平台提取。如有問題或改進建議，請提交到主倉庫。

## 📞 支持

如有問題、疑問或貢獻：
- GitHub Issues: https://github.com/laitim2001/ai-webapp-template/issues
- 文檔：查看主項目的 `/docs` 目錄

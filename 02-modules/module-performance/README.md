# Performance Module

**Version**: 5.0
**Status**: Production Ready
**Created**: 2025-10-10

## 📋 Overview

The Performance Module provides comprehensive performance monitoring, query optimization, and response caching capabilities for your Next.js application. Extracted from the AI Sales Enablement Platform with proven production usage.

## 🎯 Features

### 1. Performance Monitoring (`lib/performance/monitor.ts`)
- **API Performance Tracking**: Record response time, status codes, and resource usage for all API requests
- **Database Persistence**: Batch write metrics to PostgreSQL for long-term storage
- **Real-time Alerts**: Detect slow queries, large responses, and server errors
- **Performance Reports**: SQL-based detailed performance analysis with percentiles
- **Middleware Integration**: Easy-to-use `withPerformanceTracking` middleware
- **Core Web Vitals**: Track frontend performance metrics with Google Analytics integration
- **Resource Monitoring**: Monitor Node.js memory and CPU usage
- **Auto Cleanup**: Automatic cleanup of expired performance data

### 2. Query Optimization (`lib/performance/query-optimizer.ts`)
- **N+1 Query Detection**: Identify and prevent N+1 query problems
- **DataLoader Integration**: Batch loading with automatic deduplication
- **Batch Query Optimization**: Execute multiple queries in parallel
- **Query Analysis**: Track query performance and identify bottlenecks
- **Smart Caching**: Built-in query result caching
- **Performance Recommendations**: Automatic optimization suggestions

### 3. Response Caching (`lib/performance/response-cache.ts`)
- **HTTP Response Caching**: Intelligent API response caching
- **ETag Support**: HTTP ETag for conditional requests (304 responses)
- **Tag-based Invalidation**: Batch invalidate caches by tags
- **Cache Statistics**: Detailed hit rate and memory usage tracking
- **Flexible Configuration**: TTL, cache keys, vary-by factors
- **Automatic Cleanup**: Periodic removal of expired cache entries

## 📦 Installation

### 1. Module Integration

Copy the module to your project:
```bash
cp -r 02-modules/module-performance/lib/performance lib/
```

### 2. Prisma Schema

The performance monitoring uses a PostgreSQL table. Add this to your `prisma/schema.prisma` (optional if using database persistence):

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

Then run:
```bash
npx prisma migrate dev --name add-performance-metrics
npx prisma generate
```

### 3. Environment Variables

Add to your `.env.local`:
```bash
# Performance Module Configuration (Optional)
ENABLE_PERFORMANCE_MONITORING=true
PERFORMANCE_BATCH_SIZE=100
PERFORMANCE_FLUSH_INTERVAL=30000
PERFORMANCE_RETENTION_DAYS=30
```

## 🚀 Usage

### Performance Monitoring

#### Basic API Tracking

```typescript
// app/api/users/route.ts
import { withPerformanceTracking } from '@/lib/performance/monitor';

export const GET = withPerformanceTracking(async (request: NextRequest) => {
  const users = await db.users.findMany();
  return NextResponse.json(users);
});
```

#### Manual Metric Tracking

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

#### Performance Reports

```typescript
// Get performance report for last 24 hours
const report = await monitor.getPerformanceReport('24h');

// Get real-time metrics (last 5 minutes)
const realtime = await monitor.getRealTimeMetrics();

// Cleanup old data (older than 30 days)
await monitor.cleanup(30);
```

#### Core Web Vitals Tracking

```typescript
// app/layout.tsx or components
import { CoreWebVitalsTracker } from '@/lib/performance/monitor';

// Track LCP (Largest Contentful Paint)
CoreWebVitalsTracker.trackMetric('LCP', 2500, 'unique-id');

// Track FID (First Input Delay)
CoreWebVitalsTracker.trackMetric('FID', 100, 'unique-id');

// Track CLS (Cumulative Layout Shift)
CoreWebVitalsTracker.trackMetric('CLS', 0.1, 'unique-id');
```

### Query Optimization

#### DataLoader for N+1 Prevention

```typescript
import { createDataLoader } from '@/lib/performance/query-optimizer';

// Create a DataLoader for users
const userLoader = createDataLoader('users', async (ids) => {
  return await db.users.findMany({
    where: { id: { in: ids } }
  });
});

// Load multiple users efficiently (batched)
const users = await Promise.all(
  userIds.map(id => userLoader.load(id))
);
```

#### Batch Query Execution

```typescript
import { batchQuery } from '@/lib/performance/query-optimizer';

const results = await batchQuery([
  { type: 'users', ids: [1, 2, 3] },
  { type: 'posts', ids: [10, 20, 30] },
  { type: 'comments', ids: [100, 200] }
]);
```

#### Query Performance Tracking

```typescript
import { trackQuery } from '@/lib/performance/query-optimizer';

const result = await trackQuery('getUserProfile', async () => {
  return await db.users.findUnique({
    where: { id },
    include: { posts: true, comments: true }
  });
});
```

#### Performance Analysis

```typescript
import { QueryOptimizer } from '@/lib/performance/query-optimizer';

// Get query statistics
const stats = QueryOptimizer.getQueryStats();

// Detect N+1 query problems
const nPlusOneIssues = QueryOptimizer.detectNPlusOne();

// Find slow queries
const slowQueries = QueryOptimizer.getSlowQueries(1000); // > 1 second

// Generate optimization report
const report = QueryOptimizer.generateOptimizationReport();
```

### Response Caching

#### API Route Caching

```typescript
// app/api/products/route.ts
import { withCache } from '@/lib/performance/response-cache';

export const GET = withCache(
  async (request) => {
    const products = await db.products.findMany();
    return NextResponse.json(products);
  },
  {
    ttl: 300,  // 5 minutes
    tags: ['products'],
    varyBy: ['userId']
  }
);
```

#### Data Caching Function

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

#### Cache Management

```typescript
import {
  invalidateCache,
  invalidateCacheByTag,
  clearCache,
  getCacheStats
} from '@/lib/performance/response-cache';

// Invalidate specific cache key
invalidateCache('products-list');

// Invalidate all caches with tag
invalidateCacheByTag('products');

// Clear all caches
clearCache();

// Get cache statistics
const stats = getCacheStats();
console.log(`Hit Rate: ${stats.hitRate * 100}%`);
console.log(`Memory Usage: ${stats.memoryUsage} bytes`);
```

## 📊 Monitoring & Dashboards

### Performance Metrics Dashboard

Create an admin dashboard to visualize performance data:

```typescript
// app/admin/performance/page.tsx
import { PerformanceMonitor } from '@/lib/performance/monitor';

export default async function PerformanceDashboard() {
  const monitor = PerformanceMonitor.getInstance();
  const report = await monitor.getPerformanceReport('24h');
  const realtime = await monitor.getRealTimeMetrics();

  return (
    <div>
      <h1>Performance Monitoring</h1>

      <div className="realtime-metrics">
        <div>Avg Response Time: {realtime.avg_response_time}ms</div>
        <div>Total Requests: {realtime.total_requests}</div>
        <div>Cache Hit Rate: {realtime.cache_hit_rate}%</div>
        <div>Error Rate: {realtime.error_rate}%</div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Endpoint</th>
            <th>Requests</th>
            <th>Avg Duration</th>
            <th>P95 Duration</th>
            <th>Error Rate</th>
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

## 🧪 Testing

The module includes comprehensive test suites with 120+ tests:

```bash
# Run all performance module tests
npm test -- lib/performance

# Run specific test file
npm test -- lib/performance/__tests__/monitor.test.ts

# Run with coverage
npm test -- --coverage lib/performance
```

Test coverage includes:
- ✅ Singleton pattern validation
- ✅ Performance metric tracking
- ✅ Batch write mechanisms
- ✅ Alert system
- ✅ Report generation
- ✅ Middleware integration
- ✅ DataLoader functionality
- ✅ Query optimization
- ✅ Response caching
- ✅ Cache invalidation
- ✅ Error handling

## ⚙️ Configuration

### Performance Monitor Options

```typescript
// Customize batch size and flush interval
const monitor = PerformanceMonitor.getInstance();
// Access private properties for configuration (if needed)
// Note: This is internal API, prefer environment variables
```

### Query Optimizer Options

```typescript
import { QueryOptimizer } from '@/lib/performance/query-optimizer';

QueryOptimizer.configure({
  enableCache: true,
  enableTracking: true,
  maxBatchSize: 100,
  batchDelay: 10,
  cacheMaxSize: 1000,
  cacheTTL: 300000  // 5 minutes
});
```

### Response Cache Options

```typescript
import { ResponseCache } from '@/lib/performance/response-cache';

// Enable/disable caching globally
ResponseCache.enable();
ResponseCache.disable();

// Check if caching is enabled
const isEnabled = ResponseCache.isEnabled();

// Cleanup expired caches manually
const removedCount = ResponseCache.cleanup();
```

## 🔧 Advanced Usage

### Custom Performance Alerts

```typescript
import { PerformanceMonitor, PerformanceMetric } from '@/lib/performance/monitor';

class CustomMonitor extends PerformanceMonitor {
  protected checkPerformanceAlerts(metric: PerformanceMetric) {
    super.checkPerformanceAlerts(metric);

    // Custom alert logic
    if (metric.duration > 5000) {
      // Send alert to Slack, PagerDuty, etc.
      sendAlert(`Critical: ${metric.endpoint} took ${metric.duration}ms`);
    }
  }
}
```

### Multi-Database Query Optimization

```typescript
import { QueryOptimizer } from '@/lib/performance/query-optimizer';

// Configure for different database adapters
const postgresLoader = QueryOptimizer.createLoader('postgres-users', async (ids) => {
  return await postgresDb.users.findMany({ where: { id: { in: ids } } });
});

const mongoLoader = QueryOptimizer.createLoader('mongo-logs', async (ids) => {
  return await mongoDb.collection('logs').find({ _id: { $in: ids } }).toArray();
});
```

### Conditional Caching

```typescript
import { withCache } from '@/lib/performance/response-cache';

export const GET = withCache(
  async (request) => {
    // Your API logic
  },
  {
    ttl: 300,
    condition: (request) => {
      // Only cache for non-admin users
      const userRole = request.headers.get('x-user-role');
      return userRole !== 'admin';
    }
  }
);
```

## 📈 Performance Optimization Tips

### 1. N+1 Query Prevention
**Bad**:
```typescript
// N+1 query problem
const posts = await db.posts.findMany();
for (const post of posts) {
  const author = await db.users.findUnique({ where: { id: post.authorId } });
  // ...
}
```

**Good**:
```typescript
// Use DataLoader
const userLoader = createDataLoader('users', async (ids) => {
  return await db.users.findMany({ where: { id: { in: ids } } });
});

const posts = await db.posts.findMany();
const authors = await Promise.all(
  posts.map(post => userLoader.load(post.authorId))
);
```

### 2. Response Caching Strategy
- Cache stable data (product catalogs, configurations) with long TTL (hours/days)
- Cache frequently accessed data (user profiles) with moderate TTL (minutes)
- Don't cache personalized or sensitive data without proper vary-by factors
- Use tags for related cache entries that need to be invalidated together

### 3. Query Tracking
- Always track slow queries (>1 second) for optimization
- Monitor cache hit rates to validate caching effectiveness
- Use batch queries for related data fetching
- Regularly review query statistics and optimization reports

## 🔗 Integration with Other Modules

### With API Gateway Module
```typescript
// Combine with rate limiting and authentication
import { withPerformanceTracking } from '@/lib/performance/monitor';
import { withRateLimit } from '@/lib/api/rate-limiter';
import { withAuth } from '@/lib/auth/middleware';

export const GET = withPerformanceTracking(
  withRateLimit(
    withAuth(async (request) => {
      // Your API logic
    })
  )
);
```

### With Caching Module
```typescript
// Use Redis for distributed caching
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

## 📚 API Reference

### PerformanceMonitor

- `getInstance()`: Get singleton instance
- `trackMetric(metric)`: Record performance metric
- `getPerformanceReport(timeRange)`: Generate performance report
- `getRealTimeMetrics()`: Get real-time metrics
- `cleanup(retentionDays)`: Clean up old metrics

### QueryOptimizer

- `createLoader(name, batchLoadFn, config)`: Create DataLoader
- `batchQuery(requests)`: Execute batch queries
- `trackQuery(name, queryFn)`: Track query performance
- `detectNPlusOne(threshold)`: Detect N+1 problems
- `getSlowQueries(thresholdMs)`: Find slow queries
- `generateOptimizationReport()`: Generate optimization report

### ResponseCache

- `cache(key, getData, config)`: Cache data
- `wrap(handler, config)`: Wrap API handler with caching
- `invalidate(key)`: Invalidate specific cache
- `invalidateByTag(tag)`: Invalidate by tag
- `clear()`: Clear all caches
- `getStats()`: Get cache statistics

## 🐛 Troubleshooting

### Performance Metrics Not Being Saved
- Ensure Prisma schema includes `performance_metrics` table
- Check database connection and permissions
- Verify batch size and flush interval settings
- Check console for error messages

### DataLoader Not Batching Queries
- Ensure DataLoader is reused across requests (not recreated each time)
- Check that load() calls are made within the same event loop tick
- Verify batchLoadFn returns array matching keys length

### Cache Not Working
- Check if caching is enabled: `ResponseCache.isEnabled()`
- Verify cache keys are consistent
- Check TTL values are appropriate
- Review cache statistics for hit/miss rates

### High Memory Usage
- Reduce cache TTL and max size
- Adjust batch sizes for monitoring
- Enable automatic cleanup
- Review DataLoader cache maps

## 📄 License

MIT License - See root LICENSE file

## 🤝 Contributing

This module was extracted from the AI Sales Enablement Platform. For issues or improvements, please submit to the main repository.

## 📞 Support

For issues, questions, or contributions:
- GitHub Issues: https://github.com/laitim2001/ai-webapp-template/issues
- Documentation: See `/docs` directory in main project

# Cache Module (module-cache)

High-performance dual-layer caching system with Redis distributed cache and in-memory cache.

## 📋 Features

### 1. Dual-Layer Cache Architecture
- **L1 Memory Cache**: In-memory LRU cache for ultra-fast access
- **L2 Redis Cache**: Distributed Redis cache for persistence and scalability
- **Automatic Backfill**: L2 hits automatically populate L1 cache
- **TTL Management**: Configurable time-to-live for both cache layers
- **LRU Eviction**: Automatic cleanup when memory cache reaches size limit
- **Cache Warmup**: Preload frequently accessed data into cache

### 2. Redis Client Service
- **Connection Management**: Automatic reconnection and error handling
- **Multiple Data Structures**: String, List, Set, Hash support
- **Pipeline Operations**: Batch command execution for better performance
- **Key Namespace**: Structured cache key management system
- **Cache Decorators**: Method-level automatic caching and invalidation
- **Health Monitoring**: Connection status tracking and statistics

### 3. Vector Embedding Cache
- **AI Vector Storage**: Specialized cache for text embeddings (1536 dimensions)
- **Compression**: Automatic gzip compression for large vectors (>1KB)
- **Batch Operations**: Efficient bulk read/write for vector data
- **Performance Metrics**: Hit rate, response time, compression savings
- **Model Support**: text-embedding-ada-002 and other AI models
- **Metadata Management**: Store text, timestamp, quality scores with vectors

## 📁 Module Structure

```
02-modules/module-cache/
├── lib/
│   └── cache/
│       ├── redis-client.ts.template       # Redis client wrapper (~450 lines)
│       └── vector-cache.ts.template        # Vector embedding cache (~642 lines)
│
└── README.md                               # This file
```

## 🔧 Installation

### Step 1: Copy Module Files

During project initialization, the CLI will copy this module to your project root.

### Step 2: Environment Variables

Add to `.env.local`:

```bash
# Redis Configuration (Required)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
REDIS_DB=0

# Cache Performance Tuning (Optional)
REDIS_MAX_RETRIES=3
REDIS_RETRY_DELAY=100
CACHE_TTL_DEFAULT=300  # 5 minutes
CACHE_MEMORY_SIZE=1000  # Max items in memory cache
```

### Step 3: Install Dependencies

```bash
npm install ioredis  # Redis client
npm install -D @types/ioredis
```

### Step 4: Redis Server

Ensure Redis is running:

```bash
# Using Docker
docker run -d -p 6379:6379 redis:alpine

# Or install locally
# macOS: brew install redis && redis-server
# Linux: sudo apt install redis-server && redis-server
# Windows: Use WSL or Docker
```

## 📖 Usage

### Basic Redis Caching

```typescript
import { cacheService, CacheKeyGenerator } from '@/lib/cache/redis-client';

// Set cache with TTL
await cacheService.set('user:123', { name: 'John' }, 3600); // 1 hour

// Get cache
const user = await cacheService.get<User>('user:123');

// Delete cache
await cacheService.del('user:123');

// Pattern-based deletion
await cacheService.delPattern('user:*');

// Check existence
const exists = await cacheService.exists('user:123');
```

### Cache Key Generation

```typescript
import { CacheKeyGenerator } from '@/lib/cache/redis-client';

// Knowledge base list with filters
const key = CacheKeyGenerator.knowledgeBaseList({
  category: 'sales',
  status: 'active'
});
// → kb:list:eyJjYXRlZ29yeSI6InNhbGVzIiwic3RhdHVzIjoiYWN0aXZlIn0=

// User profile
const key = CacheKeyGenerator.userProfile(123);
// → user:profile:123

// Search results
const key = CacheKeyGenerator.searchResults('AI tools', 'semantic');
// → search:semantic:QUkgdG9vbHM=

// API response
const key = CacheKeyGenerator.apiResponse('/api/products', { page: 1 });
// → api:/api/products:eyJwYWdlIjoxfQ==
```

### Cache Decorators

```typescript
import { cached, invalidateCache } from '@/lib/cache/redis-client';

class UserService {
  // Automatically cache method results
  @cached(3600, (userId: number) => `user:${userId}`)
  async getUserById(userId: number) {
    // This will be cached for 1 hour
    return await db.user.findUnique({ where: { id: userId } });
  }

  // Automatically invalidate related caches
  @invalidateCache(['user:*', 'api:/api/users:*'])
  async updateUser(userId: number, data: UpdateUserData) {
    // This will clear all user:* and api:/api/users:* caches
    return await db.user.update({ where: { id: userId }, data });
  }
}
```

### Vector Embedding Cache

```typescript
import { getVectorCache } from '@/lib/cache/vector-cache';

const vectorCache = getVectorCache();

// Store vector embedding
await vectorCache.set(
  'What is AI?',
  [0.023, -0.015, 0.042, ...], // 1536-dimension vector
  {
    quality_score: 0.95,
    cost: 0.0001
  },
  { ttl: 86400 } // 24 hours
);

// Retrieve vector embedding
const cached = await vectorCache.get('What is AI?');
if (cached) {
  console.log(cached.vector); // [0.023, -0.015, ...]
  console.log(cached.metadata.timestamp);
  console.log(cached.metadata.model); // text-embedding-ada-002
}

// Batch operations
const result = await vectorCache.batchSet([
  { text: 'AI definition', vector: [...], metadata: { quality_score: 0.9 } },
  { text: 'ML overview', vector: [...], metadata: { quality_score: 0.85 } }
]);

console.log(result.stats); // { processed: 2, succeeded: 2, failed: 0 }
```

### Advanced Redis Operations

```typescript
import { cacheService } from '@/lib/cache/redis-client';

// Atomic increment (counters)
const views = await cacheService.incr('page:views:home');

// List operations (recent activity)
await cacheService.lpush('user:123:activity', 'logged_in');
const recent = await cacheService.lrange('user:123:activity', 0, 9);

// Set operations (unique tags)
await cacheService.sadd('product:456:tags', 'ai', 'ml', 'nlp');
const tags = await cacheService.smembers('product:456:tags');

// Hash operations (user session)
await cacheService.hset('session:abc123', 'userId', '456');
await cacheService.hset('session:abc123', 'lastSeen', Date.now().toString());
const session = await cacheService.hgetall('session:abc123');

// Pipeline (batch commands)
const results = await cacheService.pipeline([
  ['get', 'user:1'],
  ['get', 'user:2'],
  ['incr', 'counter'],
  ['set', 'key', 'value']
]);
```

### Cache Statistics

```typescript
import { cacheService } from '@/lib/cache/redis-client';
import { getVectorCache } from '@/lib/cache/vector-cache';

// Redis cache stats
const stats = await cacheService.getStats();
console.log(stats.memory); // Memory usage
console.log(stats.keyspace); // Key count by database
console.log(stats.stats); // Operation statistics

// Vector cache stats
const vectorCache = getVectorCache();
const vectorStats = vectorCache.getStats();
console.log(vectorStats.hits); // Cache hits
console.log(vectorStats.misses); // Cache misses
console.log(vectorStats.memoryHits); // L1 cache hits
console.log(vectorStats.redisHits); // L2 cache hits
console.log(vectorStats.compressionSaved); // Bytes saved by compression
console.log(vectorStats.avgResponseTime); // Average response time (ms)
```

### Cache Warmup

```typescript
import { getVectorCache } from '@/lib/cache/vector-cache';

const vectorCache = getVectorCache();

// Preload frequently accessed embeddings
await vectorCache.warmup([
  'What is artificial intelligence?',
  'How does machine learning work?',
  'Benefits of AI in business'
]);

// Output:
// 🔥 Warming up vector cache with 3 items...
// ✅ Cache warmup completed: { found: 2, missing: 1, duration: 45 }
```

## ⚠️ Important Notes

### Vector Cache Duplicate Warning

**Status**: ⚠️ `vector-cache.ts` appears to be a duplicate from module-knowledge-base

The `vector-cache.ts.template` file is identical to the one in `module-knowledge-base/lib/cache/vector-cache.ts.template`. This is intentional for the following reasons:

1. **Standalone Module**: module-cache can be used independently without knowledge-base
2. **Dependency Flexibility**: Users can choose cache without full knowledge-base features
3. **Module Isolation**: Each module remains self-contained

**Recommendation**:
- If you select **both** module-cache and module-knowledge-base, use only ONE copy
- Place vector-cache.ts in `lib/cache/` (not duplicated)
- Knowledge-base module should import from `@/lib/cache/vector-cache`

### Redis Connection

- **No Database Adapter Conversion Needed**: Redis client does not use Prisma
- **Pure Redis Operations**: All operations use ioredis directly
- **Production Ready**: Can be used as-is without modifications

### Performance Considerations

- **Memory Cache Size**: Default 1000 items, adjust based on memory availability
- **Compression Threshold**: 1KB default, vectors >1KB are gzip compressed
- **TTL Strategy**: Balance between freshness and cache hit rate
- **Pipeline Usage**: Use pipeline for bulk operations (>5 commands)

## 📊 API Reference

### CacheService Methods

- `set(key, value, ttl?)` - Set cache with optional TTL
- `get<T>(key)` - Get cached value with type
- `del(key)` - Delete single cache key
- `delPattern(pattern)` - Delete keys matching pattern
- `exists(key)` - Check if key exists
- `expire(key, ttl)` - Set expiration time
- `ttl(key)` - Get remaining TTL
- `incr(key)` - Atomic increment
- `lpush(key, ...values)` - List push (left)
- `lrange(key, start, stop)` - List range query
- `sadd(key, ...members)` - Set add members
- `smembers(key)` - Get all set members
- `hset(key, field, value)` - Hash set field
- `hget(key, field)` - Hash get field
- `hgetall(key)` - Get all hash fields
- `mget(...keys)` - Multi-get keys
- `mset(...keyValues)` - Multi-set keys
- `pipeline(commands)` - Execute batch commands
- `getStats()` - Get cache statistics
- `healthCheck()` - Check Redis connection

### VectorCacheService Methods

- `get(text, model?)` - Get vector embedding from cache
- `set(text, vector, metadata?, options?)` - Store vector embedding
- `batchGet(texts, model?)` - Batch retrieve embeddings
- `batchSet(items, model?)` - Batch store embeddings
- `delete(text, model?)` - Delete specific embedding
- `warmup(texts, model?)` - Preload embeddings into cache
- `getStats()` - Get cache statistics
- `clear()` - Clear all vector cache
- `close()` - Close cache service

### CacheKeyGenerator Methods

- `knowledgeBaseList(filters)` - Generate key for KB list
- `knowledgeBaseItem(id)` - Generate key for KB item
- `userProfile(userId)` - Generate key for user profile
- `searchResults(query, type)` - Generate key for search results
- `apiResponse(endpoint, params)` - Generate key for API response

## 🔐 Security Best Practices

1. **Password Protection**: Always set REDIS_PASSWORD in production
2. **Network Security**: Use VPC/private network for Redis connections
3. **Key Expiration**: Set appropriate TTLs to prevent memory leaks
4. **Access Control**: Configure Redis ACLs for different services
5. **Data Sensitivity**: Avoid caching sensitive data without encryption

## 📝 Changelog

- **v5.0** (2025-10-06): Initial extraction
  - Redis client wrapper with decorator support
  - Vector embedding cache with dual-layer architecture
  - Compression, batch operations, performance metrics
  - Production-ready, no database adapter conversion needed
  - ⚠️ Note: vector-cache.ts duplicate from module-knowledge-base

## 📄 License

Part of AI Web App Template v5.0

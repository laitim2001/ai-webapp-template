# API Gateway 模組提取計劃
# API Gateway Module Extraction Plan

**創建日期**: 2025-10-05
**目標**: 從源項目提取 API Gateway 中間件系統並改造為通用模組

---

## 📋 API Gateway 文件清單

### 核心錯誤處理 (lib/api/ & lib/)

| 文件 | 路徑 | 用途 | 行數估計 |
|------|------|------|----------|
| errors.ts | lib/errors.ts | 統一錯誤處理系統 | ~500 |
| error-handler.ts | lib/api/error-handler.ts | API 錯誤處理器 | ~400 |
| response-helper.ts | lib/api/response-helper.ts | API 回應輔助函數 | ~200 |

### 企業級中間件 (lib/middleware/)

| 文件 | 路徑 | 用途 | 行數估計 |
|------|------|------|----------|
| rate-limiter.ts | lib/middleware/rate-limiter.ts | 速率限制中間件 | ~300 |
| cors.ts | lib/middleware/cors.ts | CORS 跨域配置 | ~380 |
| security-headers.ts | lib/middleware/security-headers.ts | 安全標頭中間件 | ~450 |
| request-id.ts | lib/middleware/request-id.ts | 請求 ID 追蹤 | ~240 |
| api-versioning.ts | lib/middleware/api-versioning.ts | API 版本管理 | ~440 |
| request-validator.ts | lib/middleware/request-validator.ts | 請求驗證中間件 | ~450 |
| request-transformer.ts | lib/middleware/request-transformer.ts | 請求轉換中間件 | ~600 |
| response-transformer.ts | lib/middleware/response-transformer.ts | 回應轉換中間件 | ~540 |
| response-cache.ts | lib/middleware/response-cache.ts | 回應緩存中間件 | ~600 |
| route-matcher.ts | lib/middleware/route-matcher.ts | 路由匹配器 | ~360 |
| routing-config.ts | lib/middleware/routing-config.ts | 路由配置管理 | ~380 |

**總計**: 約 14 個核心文件，~4,884 行代碼

---

## 🎯 提取策略

### Phase 1: 核心錯誤處理系統 (優先級 P0)
**文件**: errors.ts, error-handler.ts, response-helper.ts

**特點**:
- **ErrorType 枚舉**: 20+ 種錯誤類型分類
- **AppError 類別**: 統一錯誤結構
- **ErrorClassifier**: 自動錯誤分類（Prisma, JWT, 網路錯誤）
- **ErrorLogger**: 環境適配日誌系統
- **ErrorMetrics**: 錯誤統計收集
- **ApiResponse**: 統一 API 回應格式
- **withErrorHandling**: API 路由錯誤包裝器

**業務邏輯移除**:
- ❌ AI_SERVICE_ERROR, EMBEDDING_GENERATION_FAILED（AI 特定）
- ❌ Dynamics 365 特定錯誤類型
- ✅ 保留通用錯誤類型（認證、驗證、資源、服務、網路）

**改造需求**:
- 無需數據庫適配器改造（純邏輯處理）
- 需要移除業務特定錯誤類型
- 保留 Prisma, JWT, Zod 錯誤自動分類

### Phase 2: 安全與驗證中間件 (優先級 P1)
**文件**: rate-limiter.ts, cors.ts, security-headers.ts, request-validator.ts

**特點**:
- **Rate Limiter**: 內存+Redis 雙模式速率限制
- **CORS**: 可配置跨域資源共享
- **Security Headers**: 15+ 種安全標頭（CSP, HSTS, X-Frame-Options）
- **Request Validator**: Zod/Joi 集成驗證

**改造需求**:
- Rate Limiter 需要支持多數據庫存儲
- CORS 需要環境變數配置
- Security Headers 需要模板化 CSP 配置

### Phase 3: 請求/回應處理中間件 (優先級 P2)
**文件**: request-id.ts, request-transformer.ts, response-transformer.ts, response-cache.ts

**特點**:
- **Request ID**: UUID 生成與追蹤
- **Request Transformer**: 請求體轉換（大小寫、過濾、壓縮）
- **Response Transformer**: 回應轉換（格式化、過濾敏感資料）
- **Response Cache**: Redis/內存雙層緩存

**改造需求**:
- Cache 需要支持多數據庫/Redis 配置
- Transformer 需要移除業務特定轉換邏輯

### Phase 4: 路由管理中間件 (優先級 P3)
**文件**: api-versioning.ts, route-matcher.ts, routing-config.ts

**特點**:
- **API Versioning**: URL/Header/Query 三種版本策略
- **Route Matcher**: 路由模式匹配器
- **Routing Config**: 路由配置管理

**改造需求**:
- 移除業務特定路由配置
- 保留通用路由匹配邏輯

---

## 📦 模組結構

```
02-modules/module-api-gateway/
├── lib/
│   ├── errors.ts.template                    # 統一錯誤處理系統
│   ├── error-handler.ts.template             # API 錯誤處理器
│   ├── response-helper.ts.template           # API 回應輔助
│   │
│   └── middleware/
│       ├── rate-limiter.ts.template          # 速率限制
│       ├── cors.ts.template                  # CORS 配置
│       ├── security-headers.ts.template      # 安全標頭
│       ├── request-id.ts.template            # 請求 ID
│       ├── request-validator.ts.template     # 請求驗證
│       ├── request-transformer.ts.template   # 請求轉換
│       ├── response-transformer.ts.template  # 回應轉換
│       ├── response-cache.ts.template        # 回應緩存
│       ├── api-versioning.ts.template        # API 版本管理
│       ├── route-matcher.ts.template         # 路由匹配
│       └── routing-config.ts.template        # 路由配置
│
└── README.md                                 # API Gateway 模組文檔
```

---

## 🔑 核心功能清單

### 1. 統一錯誤處理
- ✅ 20+ 種錯誤類型分類
- ✅ 自動錯誤分類（Prisma, JWT, Zod, 網路）
- ✅ 環境適配日誌（開發 vs 生產）
- ✅ 錯誤統計與監控
- ✅ 安全錯誤回應（過濾敏感資訊）

### 2. 速率限制
- ✅ 內存模式（開發/小規模）
- ✅ Redis 模式（生產/分散式）
- ✅ 滑動窗口演算法
- ✅ 可配置限制規則（IP, User, API Key）
- ✅ 自定義錯誤回應

### 3. CORS 管理
- ✅ 可配置允許來源
- ✅ 憑證支持（Credentials）
- ✅ 預檢請求處理（OPTIONS）
- ✅ 方法/標頭白名單
- ✅ 環境變數配置

### 4. 安全標頭
- ✅ Content Security Policy (CSP)
- ✅ HTTP Strict Transport Security (HSTS)
- ✅ X-Frame-Options
- ✅ X-Content-Type-Options
- ✅ Referrer-Policy
- ✅ Permissions-Policy
- ✅ 15+ 安全標頭自動設置

### 5. 請求驗證
- ✅ Zod schema 驗證
- ✅ Joi schema 驗證
- ✅ 自定義驗證函數
- ✅ 請求體/查詢/參數驗證
- ✅ 統一錯誤回應

### 6. 請求/回應轉換
- ✅ 請求體轉換（大小寫、過濾、清理）
- ✅ 回應格式化（統一結構）
- ✅ 敏感資料過濾（密碼、Token）
- ✅ 壓縮/解壓縮
- ✅ 編碼轉換

### 7. 回應緩存
- ✅ 內存緩存（LRU）
- ✅ Redis 緩存（分散式）
- ✅ 緩存鍵生成策略
- ✅ TTL 配置
- ✅ 緩存失效策略
- ✅ 條件緩存（GET/HEAD only）

### 8. API 版本管理
- ✅ URL 版本（/api/v1/...）
- ✅ Header 版本（Accept-Version）
- ✅ Query 版本（?version=1）
- ✅ 版本棄用警告
- ✅ 版本路由映射

### 9. 請求追蹤
- ✅ UUID 請求 ID 生成
- ✅ 請求 ID 傳遞（Header）
- ✅ 日誌關聯
- ✅ 分散式追蹤支持

---

## 🔧 數據庫適配器改造

### 需要改造的中間件

**Rate Limiter** (rate-limiter.ts):
```typescript
// 原始代碼（Redis 直接調用）
await redisClient.incr(key)

// 改造後（適配器支持內存/Redis/數據庫）
await rateLimitStore.increment(key)
```

**Response Cache** (response-cache.ts):
```typescript
// 原始代碼（Redis 直接調用）
await redis.get(cacheKey)
await redis.setex(cacheKey, ttl, value)

// 改造後（適配器）
await cacheStore.get(cacheKey)
await cacheStore.set(cacheKey, value, ttl)
```

### 無需改造的中間件

- errors.ts - 純邏輯，無數據庫調用
- error-handler.ts - 純邏輯
- cors.ts - 純邏輯
- security-headers.ts - 純邏輯
- request-validator.ts - 純邏輯
- request-transformer.ts - 純邏輯
- response-transformer.ts - 純邏輯
- api-versioning.ts - 純邏輯
- request-id.ts - 純邏輯
- route-matcher.ts - 純邏輯

---

## ✅ 驗證檢查清單

### 錯誤處理驗證
- [ ] AppError 創建和序列化
- [ ] ErrorClassifier 自動分類
- [ ] withErrorHandling 包裝器
- [ ] 開發/生產環境錯誤回應

### 中間件驗證
- [ ] Rate Limiter (內存模式)
- [ ] Rate Limiter (Redis 模式)
- [ ] CORS 預檢請求
- [ ] Security Headers 設置
- [ ] Request Validation (Zod)
- [ ] Response Cache (內存)
- [ ] Response Cache (Redis)
- [ ] API Versioning (URL/Header/Query)

### 整合驗證
- [ ] 中間件鏈組合
- [ ] 錯誤處理鏈傳遞
- [ ] 請求 ID 追蹤
- [ ] 性能影響測試

---

## 📝 環境變數需求

```bash
# CORS 配置
ALLOWED_ORIGINS=http://localhost:3000,https://example.com
CORS_CREDENTIALS=true

# 速率限制
RATE_LIMIT_WINDOW=60000  # 60 seconds
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_STORE=memory  # memory | redis | database

# Redis (可選)
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=
REDIS_DB=0

# 緩存配置
CACHE_ENABLED=true
CACHE_TTL=300  # 5 minutes
CACHE_STORE=memory  # memory | redis

# API 版本
API_VERSION_STRATEGY=url  # url | header | query
API_DEFAULT_VERSION=1

# 安全標頭
CSP_ENABLED=true
HSTS_ENABLED=true
HSTS_MAX_AGE=31536000
```

---

## 🚀 下一步

1. ✅ **創建此計劃文檔** (當前)
2. ⏳ 提取核心錯誤處理文件（Phase 1）
3. ⏳ 提取安全與驗證中間件（Phase 2）
4. ⏳ 提取請求/回應處理中間件（Phase 3）
5. ⏳ 提取路由管理中間件（Phase 4）
6. ⏳ 改造 Rate Limiter 和 Cache 適配器
7. ⏳ 創建 API Gateway README
8. ⏳ 測試中間件組合和整合

---

**預計完成時間**: Week 2 Day 8-9 (2 天)
**預計代碼行數**: 4,884+ 行
**優先級**: P1 (高優先級，企業級 API 必需)

**建議**: 考慮到代碼量大，可分批提取：
- Day 8: Phase 1-2 (錯誤處理 + 安全驗證)
- Day 9: Phase 3-4 (請求回應處理 + 路由管理)

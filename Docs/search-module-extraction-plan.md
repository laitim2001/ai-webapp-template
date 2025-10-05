# Search Module 提取計劃
# Search Module Extraction Plan

**創建日期**: 2025-10-05
**目標**: 從源項目提取搜索模組並改造為通用模組

---

## 📋 Search Module 文件清單

### 核心搜索引擎 (lib/search/)

| 文件 | 路徑 | 用途 | 行數估計 |
|------|------|------|----------|
| vector-search.ts | lib/search/vector-search.ts | 向量搜索引擎 | ~620 |
| pgvector-search.ts | lib/search/pgvector-search.ts | pgvector 專用搜索 | ~700 |
| semantic-query-processor.ts | lib/search/semantic-query-processor.ts | 語義查詢處理 | ~930 |
| query-processor.ts | lib/search/query-processor.ts | 查詢處理器 | ~680 |
| result-ranker.ts | lib/search/result-ranker.ts | 結果排序引擎 | ~530 |
| contextual-result-enhancer.ts | lib/search/contextual-result-enhancer.ts | 上下文增強 | ~1,430 |
| search-suggestions.ts | lib/search/search-suggestions.ts | 搜索建議 | ~960 |
| search-analytics.ts | lib/search/search-analytics.ts | 搜索分析 | ~1,110 |
| crm-search-adapter.ts | lib/search/crm-search-adapter.ts | CRM 搜索適配器 | ~1,010 |

**總計**: 9 個文件，~7,970 行代碼

---

## 🎯 核心功能清單

### 1. 向量搜索引擎
- ✅ 多種相似度算法
  - 餘弦相似度 (Cosine Similarity)
  - 歐幾里得距離 (Euclidean Distance)
  - 點積 (Dot Product)
  - 混合搜索 (Hybrid)
- ✅ PostgreSQL pgvector 優化
- ✅ 分塊向量搜索
- ✅ 早期終止優化
- ✅ 批量處理

### 2. 語義查詢處理
- ✅ 自然語言理解
- ✅ 查詢擴展
- ✅ 同義詞處理
- ✅ 意圖識別
- ✅ 多語言支持

### 3. 查詢處理器
- ✅ 查詢解析
- ✅ 查詢優化
- ✅ 停用詞過濾
- ✅ 詞幹提取
- ✅ 分詞處理

### 4. 結果排序引擎
- ✅ 多因子排序
  - 相似度得分
  - 時間衰減
  - 用戶偏好
  - 文檔質量
  - 訪問頻率
- ✅ 自定義排序策略
- ✅ A/B 測試支持

### 5. 上下文增強
- ✅ 結果高亮
- ✅ 摘要生成
- ✅ 關聯推薦
- ✅ 上下文提取
- ✅ 相關片段選取

### 6. 搜索建議
- ✅ 自動完成
- ✅ 拼寫糾正
- ✅ 熱門搜索
- ✅ 個人化建議
- ✅ 搜索歷史

### 7. 搜索分析
- ✅ 搜索行為追蹤
- ✅ 點擊率分析
- ✅ 無結果查詢分析
- ✅ 性能指標監控
- ✅ 趨勢分析

### 8. CRM 搜索適配器 (業務特定)
- ⚠️ Dynamics 365 整合
- ⚠️ 客戶數據搜索
- ⚠️ 業務邏輯特定

---

## 🔧 業務邏輯移除策略

### 需要移除/抽象的業務邏輯

**crm-search-adapter.ts** (整個文件):
- ❌ Dynamics 365 特定邏輯
- ❌ 客戶數據結構
- ❌ CRM 業務規則

**建議**: 不提取此文件，或改造為通用的「外部數據源適配器」接口

**search-analytics.ts** (部分邏輯):
- ❌ 銷售相關分析指標
- ❌ 業務特定 KPI
- ✅ 保留通用分析功能（點擊率、搜索頻率、性能指標）

**contextual-result-enhancer.ts** (部分邏輯):
- ❌ 銷售場景特定增強
- ✅ 保留通用增強功能（高亮、摘要、相關推薦）

---

## 📦 模組結構

```
02-modules/module-search/
├── lib/
│   ├── search/
│   │   ├── vector-search.ts.template              # 向量搜索引擎
│   │   ├── pgvector-search.ts.template            # pgvector 專用
│   │   ├── semantic-query-processor.ts.template   # 語義查詢
│   │   ├── query-processor.ts.template            # 查詢處理
│   │   ├── result-ranker.ts.template              # 結果排序
│   │   ├── contextual-result-enhancer.ts.template # 上下文增強
│   │   ├── search-suggestions.ts.template         # 搜索建議
│   │   └── search-analytics.ts.template           # 搜索分析
│   │
│   └── adapters/
│       └── external-data-adapter.ts.template      # 外部數據源適配器接口
│
├── types/
│   └── search.ts.template                         # 搜索類型定義
│
└── README.md                                      # 搜索模組文檔
```

---

## 🔑 提取階段

### Phase 1: 核心向量搜索 (優先級 P0)
**文件**: vector-search.ts, pgvector-search.ts

**功能**:
- 向量搜索引擎
- PostgreSQL pgvector 支持
- 多種相似度算法

**改造需求**:
- Prisma → database adapter
- 條件編譯（PostgreSQL vs 其他）

### Phase 2: 查詢處理 (優先級 P1)
**文件**: query-processor.ts, semantic-query-processor.ts

**功能**:
- 查詢解析和優化
- 語義理解
- 多語言支持

**改造需求**:
- 無數據庫依賴（純邏輯）
- 移除業務特定查詢規則

### Phase 3: 結果處理 (優先級 P1)
**文件**: result-ranker.ts, contextual-result-enhancer.ts

**功能**:
- 智能排序
- 結果增強

**改造需求**:
- 移除業務特定排序因子
- 保留通用增強功能

### Phase 4: 搜索輔助 (優先級 P2)
**文件**: search-suggestions.ts, search-analytics.ts

**功能**:
- 搜索建議
- 搜索分析

**改造需求**:
- Prisma → database adapter
- 移除業務特定分析

---

## 🔧 數據庫適配器改造

### 需要改造的文件

**vector-search.ts**:
```typescript
// 原始代碼
await prisma.knowledgeBase.findMany()

// 改造後
await databaseAdapter.findMany('knowledgeBase', ...)
```

**pgvector-search.ts**:
```typescript
// PostgreSQL 專用，需要條件檢查
if (getDatabaseType() === 'postgresql') {
  // 使用 pgvector 原生查詢
  await prisma.$queryRaw`SELECT ... ORDER BY embedding <-> $1`
} else {
  throw new Error('pgvector requires PostgreSQL')
}
```

**search-suggestions.ts**:
```typescript
// 原始代碼
await prisma.searchHistory.create()
await prisma.searchSuggestion.findMany()

// 改造後
await databaseAdapter.create('searchHistory', ...)
await databaseAdapter.findMany('searchSuggestion', ...)
```

**search-analytics.ts**:
```typescript
// 原始代碼
await prisma.searchAnalytics.aggregate()

// 改造後
await databaseAdapter.aggregate('searchAnalytics', ...)
```

---

## 📝 環境變數需求

```bash
# 搜索配置
SEARCH_ALGORITHM=hybrid  # cosine | euclidean | dot_product | hybrid
SEARCH_SIMILARITY_THRESHOLD=0.7
SEARCH_RESULT_LIMIT=20
ENABLE_SEMANTIC_SEARCH=true

# PostgreSQL pgvector
ENABLE_PGVECTOR=true  # PostgreSQL only
PGVECTOR_INDEX_TYPE=ivfflat  # ivfflat | hnsw

# 查詢處理
ENABLE_QUERY_EXPANSION=true
ENABLE_SPELL_CHECK=true
QUERY_LANGUAGE=zh-TW

# 結果排序
RANKING_ALGORITHM=multi_factor  # similarity_only | multi_factor | custom
TIME_DECAY_FACTOR=0.1
USER_PREFERENCE_WEIGHT=0.3

# 搜索建議
ENABLE_AUTOCOMPLETE=true
ENABLE_SEARCH_HISTORY=true
MAX_SUGGESTIONS=10

# 搜索分析
ENABLE_SEARCH_ANALYTICS=true
ANALYTICS_RETENTION_DAYS=90
```

---

## ✅ 驗證檢查清單

### 向量搜索驗證
- [ ] PostgreSQL + pgvector 搜索
- [ ] MySQL JSON 向量搜索（降級）
- [ ] 餘弦相似度計算
- [ ] 歐幾里得距離計算
- [ ] 混合搜索評分

### 查詢處理驗證
- [ ] 查詢解析
- [ ] 語義擴展
- [ ] 停用詞過濾
- [ ] 分詞處理

### 結果處理驗證
- [ ] 多因子排序
- [ ] 結果高亮
- [ ] 摘要生成

### 搜索輔助驗證
- [ ] 自動完成
- [ ] 拼寫糾正
- [ ] 搜索歷史
- [ ] 搜索分析

---

## 🚀 下一步

1. ✅ **創建此計劃文檔** (當前)
2. ⏳ 提取核心向量搜索（Phase 1）
3. ⏳ 提取查詢處理（Phase 2）
4. ⏳ 提取結果處理（Phase 3）
5. ⏳ 提取搜索輔助（Phase 4）
6. ⏳ 創建 Search Module README
7. ⏳ 測試多數據庫支持

---

**預計完成時間**: Week 2 Day 11-12 (2 天)
**預計代碼行數**: ~2,800 行（核心邏輯，移除 CRM 適配器）
**優先級**: P0 (最高優先級，Knowledge Base 依賴)

**依賴模組**:
- AI Integration Module (嵌入生成)
- Cache Module (搜索緩存)

**與 Knowledge Base 關係**:
- Knowledge Base 使用 Search Module 的向量搜索引擎
- 建議一起提取以確保整合順暢

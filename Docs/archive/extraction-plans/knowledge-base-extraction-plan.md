# Knowledge Base 模組提取計劃
# Knowledge Base Module Extraction Plan

**創建日期**: 2025-10-05
**目標**: 從源項目提取知識庫系統並改造為通用模組

---

## 📋 Knowledge Base 文件清單

### 核心邏輯 (lib/knowledge/)

| 文件 | 路徑 | 用途 | 行數估計 |
|------|------|------|----------|
| version-control.ts | lib/knowledge/version-control.ts | 版本控制系統 | ~450 |
| analytics-service.ts | lib/knowledge/analytics-service.ts | 分析服務 | ~600 |
| full-text-search.ts | lib/knowledge/full-text-search.ts | 全文搜索 | ~400 |
| search-history-manager.ts | lib/knowledge/search-history-manager.ts | 搜索歷史 | ~430 |
| index.ts | lib/knowledge/index.ts | 模組導出 | ~10 |

### 向量搜索 (lib/search/)

| 文件 | 路徑 | 用途 | 行數估計 |
|------|------|------|----------|
| vector-search.ts | lib/search/vector-search.ts | 向量搜索引擎 | ~850 |
| pgvector-search.ts | lib/search/pgvector-search.ts | PostgreSQL pgvector | ~650 |

### AI 整合 (lib/ai/)

| 文件 | 路徑 | 用途 | 行數估計 |
|------|------|------|----------|
| embeddings.ts | lib/ai/embeddings.ts | 向量嵌入生成 | ~300 |
| enhanced-embeddings.ts | lib/ai/enhanced-embeddings.ts | 增強嵌入 | ~400 |

### 緩存 (lib/cache/)

| 文件 | 路徑 | 用途 | 行數估計 |
|------|------|------|----------|
| vector-cache.ts | lib/cache/vector-cache.ts | 向量緩存 | ~350 |

**核心邏輯總計**: 約 10 個文件，~4,440 行代碼

### API 路由 (app/api/knowledge-base/)

| 路由 | 功能 | 行數估計 |
|------|------|----------|
| /route.ts | CRUD 主路由 | ~300 |
| /search/route.ts | 搜索端點 | ~250 |
| /upload/route.ts | 文件上傳 | ~200 |
| /bulk-upload/route.ts | 批量上傳 | ~180 |
| /[id]/route.ts | 單個文檔 | ~150 |
| /[id]/versions/route.ts | 版本列表 | ~120 |
| /[id]/versions/[versionId]/route.ts | 版本詳情 | ~100 |
| /[id]/versions/compare/route.ts | 版本比較 | ~150 |
| /[id]/versions/revert/route.ts | 版本回溯 | ~120 |
| /advanced-search/route.ts | 高級搜索 | ~200 |
| /analytics/route.ts | 分析統計 | ~180 |
| /suggestions/route.ts | 搜索建議 | ~150 |
| /tags/route.ts | 標籤管理 | ~120 |

**API 路由總計**: 約 13 個端點，~2,220 行代碼

**知識庫模組總計**: 約 23 個文件，~6,660 行代碼

---

## 🎯 核心功能清單

### 1. 版本控制系統
- ✅ 完整修改歷史追蹤
- ✅ 版本快照創建
- ✅ 版本比較和差異分析
- ✅ 版本回溯功能
- ✅ 主要/次要版本分類
- ✅ 版本標籤系統
- ✅ 變更欄位追蹤

### 2. 向量搜索引擎
- ✅ 多種相似度算法
  - 餘弦相似度 (Cosine Similarity)
  - 歐幾里得距離 (Euclidean Distance)
  - 混合搜索 (Hybrid Search)
- ✅ 智能評分機制
  - 相似度權重
  - 時間衰減因子
  - 用戶偏好加權
- ✅ PostgreSQL pgvector 支持
- ✅ 向量緩存優化
- ✅ 分塊搜索 (Chunk Search)

### 3. 全文搜索
- ✅ 多語言支持
- ✅ 分詞和詞幹提取
- ✅ 關鍵詞高亮
- ✅ 模糊匹配
- ✅ 搜索建議

### 4. 搜索歷史管理
- ✅ 搜索記錄追蹤
- ✅ 熱門搜索統計
- ✅ 個人化推薦
- ✅ 搜索趨勢分析

### 5. 分析服務
- ✅ 文檔訪問統計
- ✅ 搜索行為分析
- ✅ 用戶活動追蹤
- ✅ 性能指標監控

### 6. 文件處理
- ✅ 多格式支持 (PDF, Word, Excel, TXT)
- ✅ 文件上傳和存儲
- ✅ 批量上傳
- ✅ 文件下載
- ✅ 內容提取

---

## 🔧 數據庫適配器改造

### 需要改造的文件

**version-control.ts**:
```typescript
// 原始代碼
this.prisma.knowledgeBase.findUnique()
this.prisma.knowledgeVersion.create()

// 改造後
databaseAdapter.findUnique('knowledgeBase', ...)
databaseAdapter.create('knowledgeVersion', ...)
```

**vector-search.ts**:
```typescript
// 原始代碼
await prisma.knowledgeBase.findMany()

// 改造後
await databaseAdapter.findMany('knowledgeBase', ...)
```

**pgvector-search.ts**:
```typescript
// PostgreSQL 專用，需要條件編譯
if (dbType === 'postgresql') {
  // 使用 pgvector 擴展
} else {
  // 降級到 JSON 向量搜索
}
```

**analytics-service.ts**:
```typescript
// 原始代碼
await prisma.searchHistory.create()
await prisma.knowledgeBase.update()

// 改造後
await databaseAdapter.create('searchHistory', ...)
await databaseAdapter.update('knowledgeBase', ...)
```

### 數據庫特定功能

**PostgreSQL**:
- ✅ pgvector 擴展支持
- ✅ 高性能向量索引
- ✅ 全文搜索索引

**MySQL**:
- ⚠️ JSON 向量搜索（降級）
- ⚠️ 無 pgvector 支持

**MongoDB**:
- ⚠️ JSON 向量搜索（降級）
- ✅ 原生 JSON 支持

**SQLite**:
- ⚠️ JSON 向量搜索（降級）
- ⚠️ 性能較低

---

## 📦 模組結構

```
02-modules/module-knowledge-base/
├── lib/
│   ├── knowledge/
│   │   ├── version-control.ts.template       # 版本控制系統
│   │   ├── analytics-service.ts.template     # 分析服務
│   │   ├── full-text-search.ts.template      # 全文搜索
│   │   ├── search-history-manager.ts.template # 搜索歷史
│   │   └── index.ts.template                 # 模組導出
│   │
│   ├── search/
│   │   ├── vector-search.ts.template         # 向量搜索引擎
│   │   └── pgvector-search.ts.template       # pgvector 專用
│   │
│   ├── ai/
│   │   ├── embeddings.ts.template            # 向量嵌入
│   │   └── enhanced-embeddings.ts.template   # 增強嵌入
│   │
│   └── cache/
│       └── vector-cache.ts.template          # 向量緩存
│
├── app/api/knowledge-base/
│   ├── route.ts.template                     # CRUD 主路由
│   ├── search/route.ts.template              # 搜索端點
│   ├── upload/route.ts.template              # 文件上傳
│   ├── [id]/route.ts.template                # 單個文檔
│   ├── [id]/versions/route.ts.template       # 版本管理
│   └── ...                                   # 其他 API 路由
│
├── types/
│   └── knowledge-base.ts.template            # 類型定義
│
└── README.md                                 # 知識庫模組文檔
```

---

## 🔑 提取階段

### Phase 1: 版本控制系統 (優先級 P0)
**文件**: version-control.ts

**功能**:
- 版本快照創建
- 版本比較和差異分析
- 版本回溯
- 版本統計

**改造需求**:
- Prisma → database adapter
- 支持 4 種數據庫

### Phase 2: 向量搜索引擎 (優先級 P0)
**文件**: vector-search.ts, pgvector-search.ts

**功能**:
- 多種相似度算法
- 智能評分機制
- PostgreSQL pgvector 支持
- 降級策略（非 PostgreSQL）

**改造需求**:
- Prisma → database adapter
- 條件編譯 (pgvector vs JSON)
- 向量緩存適配器

### Phase 3: AI 嵌入整合 (優先級 P1)
**文件**: embeddings.ts, enhanced-embeddings.ts

**功能**:
- Azure OpenAI 嵌入生成
- 嵌入緩存
- 批量嵌入處理

**改造需求**:
- 移除 Azure OpenAI 特定邏輯（可選功能）
- 支持多種嵌入服務（OpenAI, Azure, 自定義）

### Phase 4: 搜索與分析 (優先級 P2)
**文件**: full-text-search.ts, search-history-manager.ts, analytics-service.ts

**功能**:
- 全文搜索
- 搜索歷史
- 分析統計

**改造需求**:
- Prisma → database adapter
- 移除業務特定分析邏輯

### Phase 5: 緩存系統 (優先級 P2)
**文件**: vector-cache.ts

**功能**:
- 向量緩存
- LRU 緩存策略
- Redis 支持

**改造需求**:
- 支持內存/Redis 雙模式

---

## 📝 環境變數需求

```bash
# AI 嵌入服務 (可選)
EMBEDDING_SERVICE=openai  # openai | azure | custom
OPENAI_API_KEY={{YOUR_API_KEY}}
AZURE_OPENAI_ENDPOINT={{YOUR_ENDPOINT}}
AZURE_OPENAI_API_KEY={{YOUR_API_KEY}}
AZURE_OPENAI_EMBEDDING_DEPLOYMENT={{DEPLOYMENT_NAME}}

# 向量搜索配置
VECTOR_SEARCH_TYPE=hybrid  # cosine | euclidean | hybrid
VECTOR_SIMILARITY_THRESHOLD=0.7
VECTOR_SEARCH_LIMIT=10
ENABLE_PGVECTOR=true  # PostgreSQL only

# 向量緩存
VECTOR_CACHE_ENABLED=true
VECTOR_CACHE_TTL=3600  # 1 hour
VECTOR_CACHE_STORE=memory  # memory | redis

# 文件上傳
MAX_FILE_SIZE=10485760  # 10MB
ALLOWED_FILE_TYPES=pdf,doc,docx,txt,xlsx
UPLOAD_DIRECTORY=./uploads/knowledge-base

# 搜索配置
ENABLE_SEARCH_HISTORY=true
ENABLE_ANALYTICS=true
TIME_DECAY_ENABLED=true
```

---

## ✅ 驗證檢查清單

### 版本控制驗證
- [ ] 創建版本快照
- [ ] 版本比較
- [ ] 版本回溯
- [ ] 版本統計

### 向量搜索驗證
- [ ] PostgreSQL + pgvector 搜索
- [ ] MySQL JSON 向量搜索
- [ ] MongoDB JSON 向量搜索
- [ ] SQLite JSON 向量搜索
- [ ] 餘弦相似度計算
- [ ] 混合搜索評分

### AI 嵌入驗證
- [ ] OpenAI 嵌入生成
- [ ] Azure OpenAI 嵌入生成
- [ ] 嵌入緩存
- [ ] 批量嵌入處理

### 文件處理驗證
- [ ] PDF 文件上傳
- [ ] Word 文件上傳
- [ ] 文件內容提取
- [ ] 文件下載

---

## 🚀 下一步

1. ✅ **創建此計劃文檔** (當前)
2. ⏳ 提取版本控制系統（Phase 1）
3. ⏳ 提取向量搜索引擎（Phase 2）
4. ⏳ 提取 AI 嵌入整合（Phase 3）
5. ⏳ 提取搜索與分析（Phase 4）
6. ⏳ 提取緩存系統（Phase 5）
7. ⏳ 創建 Knowledge Base README
8. ⏳ 測試多數據庫支持

---

**預計完成時間**: Week 2 Day 9-10 (2 天)
**預計代碼行數**: 4,440+ 行（核心邏輯）
**優先級**: P0 (最高優先級，AI 應用核心)

**依賴模組**:
- Search Module (向量搜索算法)
- AI Integration Module (嵌入生成)
- Cache Module (向量緩存)

**建議**: 考慮到 Knowledge Base 與 Search Module 緊密耦合，建議：
- Day 9: 提取 Knowledge Base 核心（版本控制 + 基礎功能）
- Day 10: 與 Search Module 一起提取（向量搜索整合）

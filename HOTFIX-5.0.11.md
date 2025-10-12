# Hotfix 5.0.11 Release Notes

**發布日期**: 2025-10-12
**版本**: 5.0.11
**類型**: Critical Fix - Prisma Schema pgvector Index Syntax
**NPM**: https://www.npmjs.com/package/create-ai-webapp

---

## 🚨 緊急修復

### Prisma pgvector 索引語法錯誤

**問題嚴重性**: 🔴 Critical - 阻止數據庫遷移

**用戶反饋**:
```
Error: P3018
A migration failed to apply.

Database error code: 42704
Database error:
ERROR: operator class "vector_cosine_ops" does not exist for access method "gin"
```

**根本問題**:

1. **錯誤的索引類型組合**:
   ```prisma
   // v5.0.10 的錯誤語法
   @@index([embedding(ops: raw("vector_cosine_ops"))], type: Gin)
   ```
   - `vector_cosine_ops` 是 pgvector 專用的操作符類
   - **不能用於 GIN 索引** (GIN 是通用倒排索引)
   - pgvector 需要使用 **ivfflat** 或 **hnsw** 索引類型

2. **Prisma 對 pgvector 索引的支持有限**:
   - Prisma 目前**不完全支持** pgvector 特定索引語法
   - 嘗試在 schema.prisma 中定義向量索引會導致錯誤
   - 正確做法：在 migration SQL 中手動創建

3. **PostgreSQL pgvector 索引類型**:
   | 索引類型 | 用途 | 速度 | 精度 |
   |---------|------|------|------|
   | ivfflat | 近似最近鄰搜索 | 快 | 中等 |
   | hnsw | 分層圖索引 | 非常快 | 高 |
   | GIN | ❌ 不支持向量 | - | - |

---

## 🔧 正確的解決方案

### 1. 從 Prisma Schema 移除向量索引定義

**修復前 (v5.0.10)**:
```prisma
model KnowledgeItem {
  // ...
  embedding   Unsupported("vector(1536)")?

  @@index([title])
  @@index([category])
  @@index([status])
  @@index([embedding(ops: raw("vector_cosine_ops"))], type: Gin)  // ❌ 錯誤
  @@map("knowledge_items")
}
```

**修復後 (v5.0.11)**:
```prisma
model KnowledgeItem {
  // ...
  embedding   Unsupported("vector(1536)")?

  @@index([title])
  @@index([category])
  @@index([status])
  // 注意：pgvector 索引需要在 migration 中使用原始 SQL 創建
  // Prisma 目前不完全支持 pgvector 索引語法
  // 示例: CREATE INDEX ON knowledge_items USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
  @@map("knowledge_items")
}
```

### 2. 在 Migration 中手動創建向量索引

**Migration SQL (可選 - 需要向量搜索時添加)**:

創建文件：`prisma/migrations/XXXXXX_add_vector_index/migration.sql`

```sql
-- 創建 pgvector 擴展 (如果尚未創建)
CREATE EXTENSION IF NOT EXISTS vector;

-- 方案 A: 使用 ivfflat 索引 (適合大數據集)
CREATE INDEX knowledge_items_embedding_idx
ON knowledge_items
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- 方案 B: 使用 hnsw 索引 (更快但需要更多內存)
-- CREATE INDEX knowledge_items_embedding_idx
-- ON knowledge_items
-- USING hnsw (embedding vector_cosine_ops)
-- WITH (m = 16, ef_construction = 64);
```

**索引選擇指南**:

```yaml
ivfflat:
  適用: 大數據集 (>10萬條記錄)
  優點: 內存效率高，構建快
  缺點: 查詢精度略低
  參數: lists (聚類數量，通常為記錄數的平方根)

hnsw:
  適用: 中小數據集 (<10萬條記錄)
  優點: 查詢速度快，精度高
  缺點: 內存佔用大，構建慢
  參數:
    - m (鄰居數，越大精度越高)
    - ef_construction (構建質量，越大越好)
```

### 3. 何時需要創建向量索引？

**需要創建的情況**:
- 使用知識庫模組 (module-knowledge-base)
- 使用搜索模組 (module-search)
- 實現語義搜索功能
- 嵌入向量數量 >1000 條

**不需要創建的情況**:
- 基礎項目（沒有向量搜索功能）
- 開發/測試階段（數據量小）
- 不使用 embedding 字段

---

## 📋 技術細節

### pgvector 索引類型詳解

**1. ivfflat (Inverted File with Flat Compression)**:

```sql
CREATE INDEX ON knowledge_items
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```

**工作原理**:
- 將向量空間劃分為 N 個聚類 (lists)
- 搜索時只查找最相關的幾個聚類
- 犧牲部分精度換取速度

**參數調優**:
```sql
-- 小數據集 (<1萬條)
WITH (lists = 10)

-- 中等數據集 (1萬-10萬條)
WITH (lists = 100)

-- 大數據集 (>10萬條)
WITH (lists = 1000)
```

**2. hnsw (Hierarchical Navigable Small World)**:

```sql
CREATE INDEX ON knowledge_items
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);
```

**工作原理**:
- 構建分層圖結構
- 從粗粒度到細粒度搜索
- 高精度但內存開銷大

**參數調優**:
```sql
-- 平衡模式 (推薦)
WITH (m = 16, ef_construction = 64)

-- 高精度模式
WITH (m = 32, ef_construction = 128)

-- 快速模式 (犧牲精度)
WITH (m = 8, ef_construction = 32)
```

### 操作符類

**vector_cosine_ops** (餘弦相似度):
```sql
-- 適用: 文本嵌入、語義搜索
-- 距離公式: 1 - cosine_similarity(a, b)
-- 範圍: [0, 2]，0 表示完全相同

SELECT * FROM knowledge_items
ORDER BY embedding <=> '[0.1, 0.2, ...]'::vector
LIMIT 10;
```

**vector_l2_ops** (歐幾里德距離):
```sql
-- 適用: 圖像嵌入、數值向量
-- 距離公式: ||a - b||²
-- 範圍: [0, ∞)

SELECT * FROM knowledge_items
ORDER BY embedding <-> '[0.1, 0.2, ...]'::vector
LIMIT 10;
```

**vector_ip_ops** (內積):
```sql
-- 適用: 特定機器學習模型
-- 距離公式: -a · b
-- 範圍: (-∞, ∞)

SELECT * FROM knowledge_items
ORDER BY embedding <#> '[0.1, 0.2, ...]'::vector
LIMIT 10;
```

### 修改的文件

**create-ai-webapp/template/01-base/prisma/schema.postgresql.prisma**:

**Line 150-156: KnowledgeItem 模型索引**
```prisma
@@index([title])
@@index([category])
@@index([status])
// 注意：pgvector 索引需要在 migration 中使用原始 SQL 創建
// Prisma 目前不完全支持 pgvector 索引語法
// 示例: CREATE INDEX ON knowledge_items USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
@@map("knowledge_items")
```

**create-ai-webapp/package.json**:
- Line 3: 版本號從 `5.0.10` → `5.0.11`

---

## ✅ 修復驗證

### 測試場景 1: 基礎遷移（無向量索引）

```bash
# 1. 確保使用 pgvector 鏡像
docker run -d -p 5432:5432 \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=myapp \
  --name ai-webapp-postgres \
  ankane/pgvector:latest

# 2. 創建項目
npx create-ai-webapp@5.0.11 test-project
# 選擇 PostgreSQL
# 密碼: password
# 數據庫: myapp

# 3. 進入項目
cd test-project

# 4. 複製環境變數
cp .env.local .env

# 5. 初始化數據庫
npx prisma migrate dev --name init
# ✅ 成功！沒有向量索引錯誤
# ✅ 基礎表結構創建完成
```

### 測試場景 2: 手動添加向量索引（需要向量搜索時）

```bash
# 1. 創建 migration 文件
mkdir -p prisma/migrations/$(date +%Y%m%d%H%M%S)_add_vector_index
cat > prisma/migrations/$(date +%Y%m%d%H%M%S)_add_vector_index/migration.sql << 'EOF'
-- 確保 pgvector 擴展已啟用
CREATE EXTENSION IF NOT EXISTS vector;

-- 創建向量索引 (ivfflat)
CREATE INDEX IF NOT EXISTS knowledge_items_embedding_idx
ON knowledge_items
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
EOF

# 2. 應用 migration
npx prisma migrate deploy
# ✅ 向量索引創建成功

# 3. 驗證索引
docker exec -it ai-webapp-postgres psql -U postgres -d myapp -c "\d knowledge_items"
# 應該看到 knowledge_items_embedding_idx 索引
```

### 測試場景 3: 從 v5.0.10 升級

如果你已經使用 v5.0.10 創建了項目並遇到索引錯誤：

```bash
# 1. 進入項目
cd your-project

# 2. 刪除失敗的 migration
rm -rf prisma/migrations/20251012*_init

# 3. 更新 schema.prisma
# 移除錯誤的 @@index([embedding...]) 行

# 4. 重置數據庫
npx prisma migrate reset --force

# 5. 重新創建 migration
npx prisma migrate dev --name init
# ✅ 現在應該成功了
```

---

## 🎯 用戶指南

### 完整的向量搜索設置流程

**步驟 1: 基礎項目創建**
```bash
npx create-ai-webapp@latest my-ai-app
# 選擇 PostgreSQL
# 密碼和數據庫使用默認值
```

**步驟 2: 基礎數據庫初始化**
```bash
cd my-ai-app
cp .env.local .env
npx prisma migrate dev --name init
# ✅ 基礎表結構創建完成（無向量索引）
```

**步驟 3: 添加向量索引（可選 - 需要語義搜索時）**
```bash
# 創建向量索引 migration
npx prisma migrate create add_vector_index

# 編輯生成的 migration 文件，添加:
cat >> prisma/migrations/*_add_vector_index/migration.sql << 'EOF'
CREATE EXTENSION IF NOT EXISTS vector;

CREATE INDEX knowledge_items_embedding_idx
ON knowledge_items
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
EOF

# 應用 migration
npx prisma migrate deploy
```

**步驟 4: 啟動項目**
```bash
npm run dev
# 訪問 http://localhost:3000
```

### 何時需要向量索引？

**需要創建**:
```typescript
// 使用語義搜索
const results = await prisma.$queryRaw`
  SELECT * FROM knowledge_items
  ORDER BY embedding <=> ${searchEmbedding}::vector
  LIMIT 10
`;

// 相似內容推薦
const similar = await prisma.$queryRaw`
  SELECT * FROM knowledge_items
  WHERE id != ${currentId}
  ORDER BY embedding <=> (SELECT embedding FROM knowledge_items WHERE id = ${currentId})
  LIMIT 5
`;
```

**不需要創建**:
```typescript
// 標準查詢（不涉及向量）
const items = await prisma.knowledgeItem.findMany({
  where: { category: 'tech' },
  orderBy: { createdAt: 'desc' }
});

// 全文搜索（不使用 embedding）
const results = await prisma.knowledgeItem.findMany({
  where: { title: { contains: 'search term' }}
});
```

### 向量索引性能優化

**數據插入優化**:
```typescript
// 大批量插入時，先禁用索引
await prisma.$executeRaw`DROP INDEX IF EXISTS knowledge_items_embedding_idx`;

// 批量插入
await prisma.knowledgeItem.createMany({ data: items });

// 重新創建索引
await prisma.$executeRaw`
  CREATE INDEX knowledge_items_embedding_idx
  ON knowledge_items
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100)
`;
```

**搜索性能調優**:
```typescript
// 調整 probes 參數（搜索的聚類數量）
await prisma.$executeRaw`SET ivfflat.probes = 10`;  // 默認值 1

// 更多 probes = 更高精度但更慢
// probes = 1  (快速，低精度)
// probes = 10 (平衡)
// probes = 100 (慢速，高精度)
```

---

## 📊 影響分析

### 問題影響範圍

| 版本 | pgvector 鏡像 | Schema 索引 | 狀態 |
|------|--------------|------------|------|
| v5.0.9 | ❌ postgres:14 | ❌ 錯誤語法 | 雙重問題 |
| v5.0.10 | ✅ ankane/pgvector | ❌ 錯誤語法 | 部分修復 |
| v5.0.11 | ✅ ankane/pgvector | ✅ 正確語法 | 完全修復 |

**受影響的功能**:
- 知識庫語義搜索
- 向量相似度推薦
- AI 嵌入存儲和查詢

### 用戶體驗改進

**v5.0.10 問題**:
- ✅ pgvector 鏡像正確
- ❌ Prisma schema 索引語法錯誤
- ❌ 遷移失敗: "vector_cosine_ops does not exist for access method gin"

**v5.0.11 改進**:
- ✅ pgvector 鏡像正確
- ✅ 移除錯誤的索引定義
- ✅ 提供手動創建索引的文檔
- ✅ 清晰的向量索引選擇指南

---

## 🗺️ 版本歷史

### v5.0.11 (2025-10-12) - 當前版本

**Critical Fix**:
- 移除 Prisma schema 中錯誤的 pgvector 索引定義
- 添加註釋說明如何手動創建向量索引
- 提供 ivfflat 和 hnsw 索引的完整文檔
- 添加向量索引性能調優指南

### v5.0.10 (2025-10-12)

**Critical Fix**:
- 使用 ankane/pgvector 鏡像

**Issue**:
- ❌ Prisma schema 向量索引語法錯誤

### v5.0.9 (2025-10-12)

**Issues**:
- ❌ 標準 PostgreSQL 鏡像缺少 pgvector
- ❌ 向量索引語法錯誤

---

## 🔍 學到的教訓

### Prisma 與 pgvector 的兼容性

1. **Prisma 的限制**:
   - Prisma 不完全支持 PostgreSQL 擴展的所有功能
   - pgvector 是相對較新的擴展
   - 自定義索引類型需要使用原始 SQL

2. **正確的集成方式**:
   - Schema 中定義字段: `Unsupported("vector(1536)")`
   - Migration 中創建索引: 原始 SQL
   - 查詢時使用: `$queryRaw` 或 `$executeRaw`

3. **索引策略**:
   - 不是所有項目都需要向量索引
   - 根據數據量選擇合適的索引類型
   - 開發階段可以不創建索引

### 文檔的重要性

1. **清晰的說明**:
   - 何時需要向量索引
   - 如何手動創建
   - 性能調優建議

2. **用戶場景分類**:
   - 基礎用戶: 不需要向量搜索
   - 進階用戶: 需要語義搜索功能
   - 提供針對性指導

---

## 🎯 下一步計劃

### v5.1.0 (計劃中)

- [ ] 提供向量索引創建腳本
- [ ] 添加向量搜索示例代碼
- [ ] 向量索引自動化工具
- [ ] 性能基準測試文檔

---

## 📜 完整變更日誌

```
v5.0.11 (2025-10-12) - CRITICAL FIX
- fix: remove incorrect pgvector index definition from Prisma schema
- docs: add manual vector index creation guide
- docs: add ivfflat and hnsw index documentation
- docs: add vector search performance tuning guide
- docs: add HOTFIX-5.0.11.md release notes

v5.0.10 (2025-10-12) - CRITICAL FIX
- fix: use ankane/pgvector image for PostgreSQL
- issue: Prisma schema vector index syntax error

v5.0.9 (2025-10-12) - CRITICAL FIX
- fix: revert to single .env.local file
- issue: standard postgres:14 image lacks pgvector extension
```

---

**立即使用修復版本**:

```bash
npx create-ai-webapp@latest my-awesome-app
```

**驗證版本**:

```bash
npm view create-ai-webapp version
# 應顯示: 5.0.11
```

---

**發布日期**: 2025-10-12
**發布者**: laitim2001
**版本**: 5.0.11 (Critical Fix)
**狀態**: ✅ 準備發布
**優先級**: 🔴 緊急修復 (pgvector 索引語法)

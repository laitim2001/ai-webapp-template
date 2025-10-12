# Hotfix 5.0.10 Release Notes

**發布日期**: 2025-10-12
**版本**: 5.0.10
**類型**: Critical Fix - PostgreSQL pgvector Extension Support
**NPM**: https://www.npmjs.com/package/create-ai-webapp

---

## 🚨 緊急修復

### PostgreSQL pgvector 擴展缺失問題

**問題嚴重性**: 🔴 Critical - 阻止數據庫遷移

**用戶反饋**:
```
Error: P3018
A migration failed to apply.

Database error code: 58P01
Database error:
ERROR: could not open extension control file "/usr/share/postgresql/14/extension/vector.control": No such file or directory
```

**根本問題**:

1. **Docker 鏡像不完整**:
   - v5.0.9 使用標準 `postgres:14` 鏡像
   - 標準鏡像**不包含 pgvector 擴展**
   - Prisma schema 使用了 `extensions = [vector]`
   - 導致遷移失敗

2. **向量搜索功能需求**:
   ```prisma
   datasource db {
     provider   = "postgresql"
     url        = env("DATABASE_URL")
     extensions = [vector]  // 需要 pgvector 擴展
   }
   ```

3. **Docker 容器管理缺失**:
   - 沒有提供容器刪除/重啟說明
   - 用戶遇到問題時不知道如何清理重建

---

## 🔧 完整的解決方案

### 1. 使用 pgvector 專用鏡像

**修復前 (v5.0.9)**:
```bash
docker run -d -p 5432:5432 \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=myapp \
  postgres:14
# ❌ 缺少 pgvector 擴展
```

**修復後 (v5.0.10)**:
```bash
docker run -d -p 5432:5432 \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=myapp \
  --name ai-webapp-postgres \
  ankane/pgvector:latest
# ✅ 包含 pgvector 擴展
# ✅ 添加容器名稱便於管理
```

**為什麼使用 ankane/pgvector**:
- 官方推薦的 pgvector Docker 鏡像
- 基於標準 PostgreSQL，添加 pgvector 擴展
- 自動配置擴展，開箱即用
- 持續更新，支持最新 PostgreSQL 版本

### 2. 添加完整的 Docker 容器管理說明

**新增命令指南**:
```bash
# 查看運行中的容器
docker ps

# 查看所有容器（包括已停止）
docker ps -a

# 停止容器
docker stop ai-webapp-postgres

# 啟動已停止的容器
docker start ai-webapp-postgres

# 刪除容器（需要重新生成時）
docker stop ai-webapp-postgres
docker rm ai-webapp-postgres

# 查看容器日誌（排查問題）
docker logs ai-webapp-postgres

# 進入容器內部（高級操作）
docker exec -it ai-webapp-postgres bash
```

### 3. 統一所有數據庫的 Docker 命令格式

**PostgreSQL (pgvector)**:
```bash
docker run -d -p 5432:5432 \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=myapp \
  --name ai-webapp-postgres \
  ankane/pgvector:latest
```

**MySQL**:
```bash
docker run -d -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=myapp \
  --name ai-webapp-mysql \
  mysql:8.0
```

**MongoDB**:
```bash
docker run -d -p 27017:27017 \
  --name ai-webapp-mongodb \
  mongo:6.0
```

**統一特點**:
- ✅ 所有命令都添加 `--name` 參數
- ✅ 容器名稱統一格式 `ai-webapp-{dbtype}`
- ✅ 數據庫名稱與 CLI 默認值匹配
- ✅ 密碼與 CLI 默認值匹配

---

## 📋 技術細節

### 什麼是 pgvector？

**pgvector** 是 PostgreSQL 的向量相似度搜索擴展：

| 功能 | 說明 |
|------|------|
| 向量存儲 | 存儲高維向量數據（如文本嵌入） |
| 相似度搜索 | 查找最相似的向量（餘弦相似度、歐幾里德距離） |
| 索引優化 | IVFFlat、HNSW 索引加速查詢 |
| AI/ML 集成 | 支持 OpenAI embeddings、語義搜索 |

**應用場景**:
- 語義搜索（向量化文本搜索）
- 推薦系統（相似內容推薦）
- 圖像檢索（視覺相似度）
- 異常檢測（模式匹配）

### 為什麼需要 pgvector？

**模板中的使用場景**:
```javascript
// 知識庫模組 (module-knowledge-base)
// 存儲文檔嵌入向量用於語義搜索
model Document {
  id        String   @id
  content   String
  embedding Unsupported("vector(1536)")  // OpenAI ada-002 embedding
}

// 搜索模組 (module-search)
// 使用向量相似度進行智能搜索
SELECT * FROM documents
ORDER BY embedding <-> '[...]'  // 餘弦相似度
LIMIT 10;
```

### 修改的文件

**create-ai-webapp/lib/cli.js**:

1. **Line 689-694: PostgreSQL Docker 命令**
   ```javascript
   console.log(chalk.white('     Docker (推薦 - 包含 pgvector 擴展):'));
   console.log(chalk.gray('       docker run -d -p 5432:5432 \\'));
   console.log(chalk.gray('         -e POSTGRES_PASSWORD=password \\'));
   console.log(chalk.gray('         -e POSTGRES_DB=myapp \\'));
   console.log(chalk.gray('         --name ai-webapp-postgres \\'));
   console.log(chalk.gray('         ankane/pgvector:latest\n'));
   ```

2. **Line 706-711: MySQL Docker 命令（添加容器名稱）**
   ```javascript
   console.log(chalk.gray('       docker run -d -p 3306:3306 \\'));
   console.log(chalk.gray('         -e MYSQL_ROOT_PASSWORD=password \\'));
   console.log(chalk.gray('         -e MYSQL_DATABASE=myapp \\'));
   console.log(chalk.gray('         --name ai-webapp-mysql \\'));
   console.log(chalk.gray('         mysql:8.0\n'));
   ```

3. **Line 723-726: MongoDB Docker 命令（添加容器名稱）**
   ```javascript
   console.log(chalk.gray('       docker run -d -p 27017:27017 \\'));
   console.log(chalk.gray('         --name ai-webapp-mongodb \\'));
   console.log(chalk.gray('         mongo:6.0\n'));
   ```

4. **Line 726-755: 新增 Docker 容器管理說明**
   ```javascript
   // Docker 容器管理說明
   if (dbType === 'postgresql' || dbType === 'mysql' || dbType === 'mongodb') {
     console.log(chalk.yellow('  💡 Docker 容器管理命令:\n'));

     console.log(chalk.white('     查看運行中的容器:'));
     console.log(chalk.gray('       docker ps\n'));

     console.log(chalk.white('     查看所有容器（包括已停止）:'));
     console.log(chalk.gray('       docker ps -a\n'));

     const containerName = dbType === 'postgresql' ? 'ai-webapp-postgres'
                         : dbType === 'mysql' ? 'ai-webapp-mysql'
                         : 'ai-webapp-mongodb';

     console.log(chalk.white('     停止容器:'));
     console.log(chalk.gray(`       docker stop ${containerName}\n`));

     console.log(chalk.white('     啟動已停止的容器:'));
     console.log(chalk.gray(`       docker start ${containerName}\n`));

     console.log(chalk.white('     刪除容器（需要重新生成時）:'));
     console.log(chalk.gray(`       docker stop ${containerName}`));
     console.log(chalk.gray(`       docker rm ${containerName}\n`));

     console.log(chalk.white('     查看容器日誌（排查問題）:'));
     console.log(chalk.gray(`       docker logs ${containerName}\n`));

     console.log(chalk.white('     進入容器內部（高級操作）:'));
     console.log(chalk.gray(`       docker exec -it ${containerName} ${dbType === 'mongodb' ? 'mongosh' : 'bash'}\n`));
   }
   ```

**create-ai-webapp/package.json**:
- Line 3: 版本號從 `5.0.9` → `5.0.10`

---

## ✅ 修復驗證

### 測試場景 1: 全新項目（v5.0.10）

```bash
# 1. 啟動 PostgreSQL with pgvector
docker run -d -p 5432:5432 \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=myapp \
  --name ai-webapp-postgres \
  ankane/pgvector:latest

# 2. 創建項目
npx create-ai-webapp@5.0.10 test-project
# 選擇 PostgreSQL
# 密碼: password (默認值)
# 數據庫: myapp (默認值)

# 3. 進入項目
cd test-project

# 4. 驗證 .env.local
cat .env.local
# DATABASE_URL="postgresql://postgres:password@localhost:5432/myapp"

# 5. 複製環境變數文件
cp .env.local .env

# 6. 初始化數據庫
npx prisma migrate dev --name init
# ✅ 成功！pgvector 擴展已安裝
# ✅ 遷移完成

# 7. 驗證 pgvector 擴展
docker exec -it ai-webapp-postgres psql -U postgres -d myapp -c "SELECT * FROM pg_extension WHERE extname='vector';"
# ✅ 應顯示 vector 擴展
```

### 測試場景 2: 從 v5.0.9 升級

如果你已經使用 v5.0.9 創建了項目，遇到 pgvector 錯誤：

```bash
# 1. 停止並刪除舊容器
docker stop ai-webapp-postgres  # 如果容器沒有名字，使用 docker ps 查看 CONTAINER ID
docker rm ai-webapp-postgres

# 2. 使用 pgvector 鏡像重新創建容器
docker run -d -p 5432:5432 \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=myapp \
  --name ai-webapp-postgres \
  ankane/pgvector:latest

# 3. 重新初始化數據庫
cd your-project
npx prisma migrate dev --name init
# ✅ 現在應該成功了
```

### 測試場景 3: 容器管理操作

```bash
# 查看運行中的容器
docker ps
# CONTAINER ID   IMAGE                    PORTS                    NAMES
# abc123def456   ankane/pgvector:latest   0.0.0.0:5432->5432/tcp   ai-webapp-postgres

# 停止容器（不刪除數據）
docker stop ai-webapp-postgres

# 再次啟動
docker start ai-webapp-postgres

# 查看日誌
docker logs ai-webapp-postgres

# 完全刪除（會丟失數據）
docker stop ai-webapp-postgres
docker rm ai-webapp-postgres
```

---

## 🎯 用戶指南

### 完整的 PostgreSQL + pgvector 工作流程

```bash
# ===== 步驟 1: 啟動數據庫 =====
docker run -d -p 5432:5432 \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=myapp \
  --name ai-webapp-postgres \
  ankane/pgvector:latest

# 驗證容器運行
docker ps | grep postgres

# ===== 步驟 2: 創建項目 =====
npx create-ai-webapp@latest my-ai-app
# 選擇 PostgreSQL
# 使用默認值（password, myapp）

# ===== 步驟 3: 初始化數據庫 =====
cd my-ai-app
cp .env.local .env
npx prisma migrate dev --name init

# ===== 步驟 4: 啟動項目 =====
npm run dev
# 訪問 http://localhost:3000
```

### 排查 pgvector 問題

**問題**: 遷移時仍然報 vector.control 錯誤

**檢查步驟**:
```bash
# 1. 確認使用的是 pgvector 鏡像
docker ps
# 應該顯示 ankane/pgvector:latest

# 2. 進入容器檢查擴展文件
docker exec -it ai-webapp-postgres bash
ls /usr/share/postgresql/*/extension/ | grep vector
# 應該顯示 vector.control 和 vector--*.sql

# 3. 測試擴展安裝
docker exec -it ai-webapp-postgres psql -U postgres -d myapp -c "CREATE EXTENSION IF NOT EXISTS vector;"
# 應該成功，無錯誤

# 4. 如果以上都失敗，刪除並重新創建容器
docker stop ai-webapp-postgres
docker rm ai-webapp-postgres
# 重新運行 docker run 命令
```

### 數據持久化（可選）

如果需要持久化數據庫數據：

```bash
docker run -d -p 5432:5432 \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=myapp \
  --name ai-webapp-postgres \
  -v pgdata:/var/lib/postgresql/data \
  ankane/pgvector:latest

# 數據會保存在 Docker volume 'pgdata' 中
# 即使刪除容器，數據也不會丟失
```

---

## 📊 影響分析

### 問題影響範圍

| 受影響版本 | 問題 | 影響 |
|-----------|------|------|
| v5.0.9 及之前 | 使用標準 postgres:14 鏡像 | ❌ 無法運行包含向量搜索的遷移 |
| v5.0.10 | 使用 ankane/pgvector 鏡像 | ✅ 完全支持向量搜索功能 |

**受影響的模組**:
- 知識庫系統 (module-knowledge-base) - 使用向量嵌入
- 搜索模組 (module-search) - 向量相似度搜索
- 推薦引擎 (module-recommendation) - 基於向量的推薦

### 用戶體驗改進

**v5.0.9 問題**:
- ❌ 標準 PostgreSQL 鏡像缺少 pgvector
- ❌ 遷移失敗，錯誤信息難懂
- ❌ 沒有容器管理指導

**v5.0.10 改進**:
- ✅ pgvector 專用鏡像，開箱即用
- ✅ 完整的容器管理命令說明
- ✅ 統一的容器命名規範
- ✅ 清晰的錯誤排查指南

---

## 🗺️ 版本歷史

### v5.0.10 (2025-10-12) - 當前版本

**Critical Fix**:
- 使用 ankane/pgvector 鏡像替代標準 postgres:14
- 添加完整的 Docker 容器管理說明
- 統一所有數據庫的 Docker 命令格式和容器命名
- 添加 pgvector 擴展說明和故障排查指南

### v5.0.9 (2025-10-12)

**Critical Fix**:
- 回歸單一 `.env.local` 文件設計
- 修復 Docker 數據庫名稱匹配問題
- 更新密碼默認值

**Issue**:
- ❌ PostgreSQL 鏡像缺少 pgvector 擴展

### v5.0.8 (2025-10-12) - 已撤回

**Issue**:
- ❌ 錯誤設計：同時生成 `.env` 和 `.env.local`

### v5.0.7 (2025-10-12)

**UX Improvement**:
- 將數據庫初始化從致命錯誤改為可選步驟

---

## 🔍 學到的教訓

### Docker 鏡像選擇的重要性

1. **了解依賴需求**:
   - 不是所有 PostgreSQL 功能都在標準鏡像中
   - pgvector 是可選擴展，需要專門的鏡像
   - 應該提前識別項目對擴展的依賴

2. **使用正確的官方鏡像**:
   - `ankane/pgvector` 是 pgvector 官方推薦鏡像
   - 不要嘗試手動安裝擴展（複雜且容易出錯）
   - 使用社區驗證的解決方案

3. **提供完整的命令**:
   - Docker 命令要包含 `--name` 參數
   - 方便用戶進行容器管理
   - 一致的命名規範提高可維護性

### 用戶指導的完整性

1. **不僅要提供啟動命令**:
   - 還要提供停止、刪除、查看日誌的命令
   - 幫助用戶處理錯誤情況
   - 提供故障排查步驟

2. **考慮用戶的學習曲線**:
   - 不是所有用戶都熟悉 Docker
   - 清晰的步驟和解釋很重要
   - 提供測試和驗證方法

3. **版本升級路徑**:
   - 為舊版本用戶提供升級指南
   - 說明如何遷移現有項目
   - 最小化升級成本

---

## 🎯 下一步計劃

### v5.1.0 (計劃中)

- [ ] 添加數據庫連接測試工具
- [ ] 支持 Docker Compose 一鍵啟動所有服務
- [ ] 添加數據庫備份和恢復指南
- [ ] 提供向量搜索示例代碼

### v5.2.0 (規劃中)

- [ ] 支持其他向量數據庫（Pinecone, Weaviate）
- [ ] 添加向量搜索性能優化指南
- [ ] 提供嵌入模型選擇指導

---

## 📜 完整變更日誌

```
v5.0.10 (2025-10-12) - CRITICAL FIX
- fix: use ankane/pgvector image for PostgreSQL with vector extension support
- feat: add comprehensive Docker container management commands
- feat: add --name parameter to all Docker commands for easier management
- docs: add pgvector extension explanation and troubleshooting guide
- docs: add HOTFIX-5.0.10.md release notes

v5.0.9 (2025-10-12) - CRITICAL FIX
- fix: revert to single .env.local file (match source project design)
- fix: add POSTGRES_DB=myapp to Docker command
- fix: update password default value to 'password'
- issue: standard postgres:14 image lacks pgvector extension

v5.0.8 (2025-10-12) - DEPRECATED
- issue: generated both .env and .env.local (wrong design)

v5.0.7 (2025-10-12) - UX IMPROVEMENT
- feat: graceful database initialization with optional fallback
```

---

**立即使用修復版本**:

```bash
npx create-ai-webapp@latest my-awesome-app
```

**驗證版本**:

```bash
npm view create-ai-webapp version
# 應顯示: 5.0.10
```

---

**發布日期**: 2025-10-12
**發布者**: laitim2001
**版本**: 5.0.10 (Critical Fix)
**狀態**: ✅ 準備發布
**優先級**: 🔴 緊急修復 (pgvector 擴展支持)

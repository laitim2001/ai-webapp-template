# 數據庫切換指南
# Database Switching Guide

**版本**: 5.0
**最後更新**: 2025-10-06

本指南詳細說明如何在不同數據庫之間切換，以及每種數據庫的優缺點和最佳實踐。

---

## 📋 目錄

1. [支持的數據庫](#支持的數據庫)
2. [快速切換步驟](#快速切換步驟)
3. [詳細切換指南](#詳細切換指南)
4. [數據庫對比](#數據庫對比)
5. [常見問題](#常見問題)
6. [最佳實踐](#最佳實踐)

---

## 支持的數據庫

AI Web App Template 支持 4 種數據庫，每種都有其優勢和適用場景：

| 數據庫 | 類型 | 推薦場景 | 特殊功能 |
|--------|------|----------|----------|
| **PostgreSQL** | SQL | 生產環境 (推薦) | pgvector (向量搜索) |
| **MySQL** | SQL | 生產環境 | 高性能查詢 |
| **MongoDB** | NoSQL | 非結構化數據 | 靈活 schema |
| **SQLite** | SQL | 開發/測試 | 零配置 |

---

## 快速切換步驟

### 方法 1: 使用 CLI 工具 (推薦)

如果你尚未初始化項目，使用 CLI 自動配置：

```bash
# 運行初始化 CLI
node scripts/init-project.js

# 在"選擇數據庫類型"步驟選擇你想要的數據庫
# CLI 會自動:
# 1. 複製對應的 Prisma schema
# 2. 生成正確的 DATABASE_URL
# 3. 安裝數據庫專用依賴
# 4. 配置數據庫適配器
```

### 方法 2: 手動切換 (已初始化項目)

如果項目已經初始化，需要手動切換數據庫：

```bash
# 1. 更新 .env.local 中的 DATABASE_URL
# 2. 複製對應的 Prisma schema
# 3. 重新生成 Prisma Client
# 4. 運行數據庫遷移
```

詳細步驟見下方。

---

## 詳細切換指南

### 切換到 PostgreSQL

#### 1. 安裝 PostgreSQL

**macOS (Homebrew)**:
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Ubuntu/Debian**:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows**:
- 下載安裝程序: https://www.postgresql.org/download/windows/
- 使用 PostgreSQL Installer 安裝

#### 2. 創建數據庫

```bash
# 進入 PostgreSQL 命令行
psql postgres

# 創建數據庫和用戶
CREATE DATABASE myapp_db;
CREATE USER myapp_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE myapp_db TO myapp_user;

# 退出
\q
```

#### 3. 配置 Prisma Schema

```bash
# 複製 PostgreSQL schema
cp prisma/schema.postgresql.prisma prisma/schema.prisma
```

#### 4. 更新環境變數

編輯 `.env.local`:

```bash
# PostgreSQL 連接字符串
DATABASE_URL="postgresql://myapp_user:your_password@localhost:5432/myapp_db"

# 或使用遠程數據庫
DATABASE_URL="postgresql://user:password@your-server.com:5432/dbname"
```

#### 5. 安裝依賴 (如果尚未安裝)

```bash
npm install @prisma/client pg
```

#### 6. 生成 Prisma Client 和運行遷移

```bash
# 生成 Prisma Client
npx prisma generate

# 運行數據庫遷移
npx prisma migrate dev --name init

# 查看數據庫 (可選)
npx prisma studio
```

#### 7. 啟用 pgvector (向量搜索功能，可選)

如果需要使用知識庫模組的向量搜索功能：

```bash
# 進入 PostgreSQL
psql myapp_db

# 啟用 pgvector 擴展
CREATE EXTENSION IF NOT EXISTS vector;

# 驗證安裝
SELECT * FROM pg_extension WHERE extname = 'vector';

# 退出
\q
```

---

### 切換到 MySQL

#### 1. 安裝 MySQL

**macOS (Homebrew)**:
```bash
brew install mysql
brew services start mysql
```

**Ubuntu/Debian**:
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
```

**Windows**:
- 下載安裝程序: https://dev.mysql.com/downloads/installer/
- 使用 MySQL Installer 安裝

#### 2. 創建數據庫

```bash
# 登入 MySQL
mysql -u root -p

# 創建數據庫和用戶
CREATE DATABASE myapp_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'myapp_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON myapp_db.* TO 'myapp_user'@'localhost';
FLUSH PRIVILEGES;

# 退出
exit;
```

#### 3. 配置 Prisma Schema

```bash
# 複製 MySQL schema
cp prisma/schema.mysql.prisma prisma/schema.prisma
```

#### 4. 更新環境變數

編輯 `.env.local`:

```bash
# MySQL 連接字符串
DATABASE_URL="mysql://myapp_user:your_password@localhost:3306/myapp_db"

# 或使用遠程數據庫
DATABASE_URL="mysql://user:password@your-server.com:3306/dbname"
```

#### 5. 安裝依賴

```bash
npm install @prisma/client mysql2
```

#### 6. 生成 Prisma Client 和運行遷移

```bash
# 生成 Prisma Client
npx prisma generate

# 運行數據庫遷移
npx prisma migrate dev --name init

# 查看數據庫 (可選)
npx prisma studio
```

#### 7. 配置全文搜索 (可選)

MySQL 使用 FULLTEXT 索引進行全文搜索：

```sql
-- 進入 MySQL
mysql -u myapp_user -p myapp_db

-- 為知識庫內容創建全文索引
ALTER TABLE KnowledgeBase ADD FULLTEXT INDEX ft_content (content);
ALTER TABLE KnowledgeBase ADD FULLTEXT INDEX ft_title (title);

-- 退出
exit;
```

---

### 切換到 MongoDB

#### 1. 安裝 MongoDB

**macOS (Homebrew)**:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Ubuntu/Debian**:
```bash
# 導入公鑰
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# 添加 MongoDB 源
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# 安裝
sudo apt update
sudo apt install -y mongodb-org

# 啟動
sudo systemctl start mongod
```

**Windows**:
- 下載安裝程序: https://www.mongodb.com/try/download/community
- 使用 MongoDB Installer 安裝

#### 2. 創建數據庫和用戶

```bash
# 進入 MongoDB Shell
mongosh

# 切換到 admin 數據庫
use admin

# 創建管理員用戶
db.createUser({
  user: "admin",
  pwd: "admin_password",
  roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
})

# 切換到應用數據庫
use myapp_db

# 創建應用用戶
db.createUser({
  user: "myapp_user",
  pwd: "your_password",
  roles: [ { role: "readWrite", db: "myapp_db" } ]
})

# 退出
exit
```

#### 3. 配置 Prisma Schema

```bash
# 複製 MongoDB schema
cp prisma/schema.mongodb.prisma prisma/schema.prisma
```

#### 4. 更新環境變數

編輯 `.env.local`:

```bash
# MongoDB 連接字符串 (無認證)
DATABASE_URL="mongodb://localhost:27017/myapp_db"

# MongoDB 連接字符串 (有認證)
DATABASE_URL="mongodb://myapp_user:your_password@localhost:27017/myapp_db?authSource=myapp_db"

# MongoDB Atlas (雲端)
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/myapp_db?retryWrites=true&w=majority"
```

#### 5. 安裝依賴

```bash
npm install @prisma/client mongodb
```

#### 6. 生成 Prisma Client 和同步 Schema

**重要**: MongoDB 使用 `prisma db push` 而不是 `migrate`，因為 MongoDB 是無 schema 的。

```bash
# 生成 Prisma Client
npx prisma generate

# 同步 schema 到 MongoDB
npx prisma db push

# 查看數據庫 (可選)
npx prisma studio
```

#### 7. 配置文本搜索索引 (可選)

```javascript
// 使用 MongoDB Shell 或 MongoDB Compass

// 創建文本搜索索引
db.KnowledgeBase.createIndex({
  title: "text",
  content: "text"
})

// 驗證索引
db.KnowledgeBase.getIndexes()
```

---

### 切換到 SQLite

#### 1. 無需安裝

SQLite 是內嵌數據庫，Node.js 會自動處理。

#### 2. 配置 Prisma Schema

```bash
# 複製 SQLite schema
cp prisma/schema.sqlite.prisma prisma/schema.prisma
```

#### 3. 更新環境變數

編輯 `.env.local`:

```bash
# SQLite 本地文件
DATABASE_URL="file:./dev.db"

# 或指定其他位置
DATABASE_URL="file:./data/myapp.db"
```

#### 4. 安裝依賴

```bash
npm install @prisma/client
```

#### 5. 生成 Prisma Client 和運行遷移

```bash
# 生成 Prisma Client
npx prisma generate

# 運行數據庫遷移 (會自動創建 dev.db 文件)
npx prisma migrate dev --name init

# 查看數據庫 (可選)
npx prisma studio
```

#### 6. 配置全文搜索 (可選)

SQLite 使用 FTS5 進行全文搜索：

```sql
-- 使用 sqlite3 命令行或 Prisma Studio

-- 創建 FTS5 虛擬表
CREATE VIRTUAL TABLE KnowledgeBase_fts USING fts5(
  title,
  content,
  content='KnowledgeBase',
  content_rowid='id'
);

-- 創建觸發器保持同步
CREATE TRIGGER KnowledgeBase_ai AFTER INSERT ON KnowledgeBase BEGIN
  INSERT INTO KnowledgeBase_fts(rowid, title, content) VALUES (new.id, new.title, new.content);
END;

CREATE TRIGGER KnowledgeBase_ad AFTER DELETE ON KnowledgeBase BEGIN
  DELETE FROM KnowledgeBase_fts WHERE rowid = old.id;
END;

CREATE TRIGGER KnowledgeBase_au AFTER UPDATE ON KnowledgeBase BEGIN
  DELETE FROM KnowledgeBase_fts WHERE rowid = old.id;
  INSERT INTO KnowledgeBase_fts(rowid, title, content) VALUES (new.id, new.title, new.content);
END;
```

---

## 數據庫對比

### 功能對比

| 功能 | PostgreSQL | MySQL | MongoDB | SQLite |
|------|-----------|-------|---------|--------|
| **向量搜索** | ✅ pgvector | ❌ | ✅ (第三方) | ❌ |
| **全文搜索** | ✅ 內建 | ✅ FULLTEXT | ✅ 文本索引 | ✅ FTS5 |
| **事務支持** | ✅ 完整 | ✅ 完整 | ✅ 有限 | ✅ 完整 |
| **JSON 支持** | ✅ JSONB | ✅ JSON | ✅ 原生 | ✅ JSON1 |
| **複製/分片** | ✅ 強大 | ✅ 強大 | ✅ 原生 | ❌ |
| **水平擴展** | ✅ 中等 | ✅ 中等 | ✅ 優秀 | ❌ |
| **並發寫入** | ✅ 優秀 | ✅ 優秀 | ✅ 優秀 | ⚠️ 有限 |

### 性能對比

| 指標 | PostgreSQL | MySQL | MongoDB | SQLite |
|------|-----------|-------|---------|--------|
| **讀取性能** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **寫入性能** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **複雜查詢** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **大數據量** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **並發處理** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |

### 使用場景推薦

#### PostgreSQL (推薦生產環境)
✅ **適合**:
- 需要向量搜索功能 (AI/ML 應用)
- 複雜的關聯查詢
- 嚴格的數據完整性要求
- 需要高級 SQL 功能 (窗口函數、CTE 等)
- 企業級應用

❌ **不適合**:
- 超高頻寫入場景 (考慮 MongoDB)
- 簡單的 CRUD 應用 (可能過於複雜)

#### MySQL (推薦生產環境)
✅ **適合**:
- 讀取密集型應用
- 需要最高性能的查詢
- 傳統 Web 應用
- 已有 MySQL 運維經驗的團隊

❌ **不適合**:
- 需要向量搜索
- 需要高級 SQL 功能

#### MongoDB (推薦特定場景)
✅ **適合**:
- 非結構化或半結構化數據
- 需要快速迭代和 schema 變更
- 大規模數據和高吞吐量
- 地理空間數據
- 需要水平擴展

❌ **不適合**:
- 複雜的關聯查詢
- 嚴格的 ACID 事務要求
- 需要向量搜索 (PostgreSQL 更好)

#### SQLite (僅開發/測試)
✅ **適合**:
- 本地開發和測試
- 小型應用 (<100GB 數據)
- 嵌入式應用
- 單用戶應用

❌ **不適合**:
- 生產環境 (並發限制)
- 高並發寫入
- 需要複製/高可用性

---

## 常見問題

### Q1: 可以在不丟失數據的情況下切換數據庫嗎？

**A**: 可以，但需要進行數據遷移：

```bash
# 1. 導出現有數據
npx prisma db pull  # 從數據庫反向生成 schema
# 或手動導出 SQL/JSON

# 2. 切換到新數據庫 (按照上述步驟)

# 3. 導入數據到新數據庫
# - PostgreSQL/MySQL: 使用 SQL 導入
# - MongoDB: 使用 mongoimport
# - SQLite: 使用 sqlite3 導入

# 4. 驗證數據完整性
npx prisma studio
```

### Q2: 數據庫適配器如何工作？

**A**: 數據庫適配器層 (`lib/db/database-adapter.ts`) 提供統一接口，所有模組通過適配器訪問數據庫，而不直接使用 Prisma。這樣切換數據庫時，應用代碼無需修改。

```typescript
// 模組使用適配器
import { databaseAdapter } from '@/lib/db/database-adapter';

// 適配器自動路由到正確的數據庫
const users = await databaseAdapter.findMany('user', {
  where: { active: true }
});
```

### Q3: 為什麼 MongoDB 使用 `db push` 而不是 `migrate`？

**A**: MongoDB 是無 schema 的 NoSQL 數據庫，不需要預定義表結構。Prisma 使用 `db push` 將 schema 定義同步到 MongoDB，但不會創建傳統的遷移文件。

### Q4: 如何在開發中使用 SQLite，生產中使用 PostgreSQL？

**A**: 使用環境變數控制：

```bash
# .env.local (開發)
DATABASE_URL="file:./dev.db"

# .env.production (生產)
DATABASE_URL="postgresql://user:password@prod-server:5432/dbname"
```

然後使用不同的 Prisma schema：

```bash
# 開發時
cp prisma/schema.sqlite.prisma prisma/schema.prisma

# 部署前
cp prisma/schema.postgresql.prisma prisma/schema.prisma
```

### Q5: 切換數據庫後需要修改代碼嗎？

**A**: **不需要**。所有模組都使用數據庫適配器，適配器會自動處理數據庫差異。但有以下例外：

- **向量搜索**: 只有 PostgreSQL 支持 pgvector
- **全文搜索**: 不同數據庫語法不同，但適配器已處理
- **特殊功能**: 如地理空間查詢，需要檢查數據庫支持

### Q6: 如何驗證數據庫切換成功？

**A**: 使用以下步驟驗證：

```bash
# 1. 檢查 Prisma Client 生成
npx prisma generate

# 2. 運行健康檢查
npm run health-check

# 3. 打開 Prisma Studio 查看數據庫
npx prisma studio

# 4. 運行測試
npm test

# 5. 啟動開發服務器
npm run dev
```

---

## 最佳實踐

### 1. 選擇正確的數據庫

```
決策樹:
┌─ 需要向量搜索？
│  └─ 是 → PostgreSQL (pgvector)
│
├─ 需要最高讀取性能？
│  └─ 是 → MySQL
│
├─ 數據結構經常變化？
│  └─ 是 → MongoDB
│
├─ 只是本地開發？
│  └─ 是 → SQLite
│
└─ 不確定？
   └─ PostgreSQL (最全面的功能)
```

### 2. 環境隔離

使用不同的數據庫實例：

```bash
# 開發環境
DATABASE_URL="postgresql://localhost:5432/myapp_dev"

# 測試環境
DATABASE_URL="postgresql://localhost:5432/myapp_test"

# 生產環境
DATABASE_URL="postgresql://prod-server:5432/myapp_prod"
```

### 3. 連接池配置

根據數據庫類型優化連接池：

```javascript
// lib/db/connection-pool.ts

const poolConfig = {
  postgresql: {
    max: 20,
    min: 5,
    idleTimeoutMillis: 30000,
  },
  mysql: {
    max: 15,
    min: 3,
    idleTimeoutMillis: 30000,
  },
  mongodb: {
    maxPoolSize: 10,
    minPoolSize: 2,
  },
  sqlite: {
    // SQLite 不需要連接池
  },
};
```

### 4. 備份策略

每種數據庫都需要定期備份：

```bash
# PostgreSQL
pg_dump -U myapp_user myapp_db > backup.sql

# MySQL
mysqldump -u myapp_user -p myapp_db > backup.sql

# MongoDB
mongodump --db=myapp_db --out=/backup/

# SQLite
cp dev.db backup_$(date +%Y%m%d).db
```

### 5. 監控和日誌

啟用數據庫查詢日誌：

```typescript
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  log      = ["query", "info", "warn", "error"]
}
```

### 6. 索引優化

根據查詢模式添加索引：

```prisma
// prisma/schema.prisma
model User {
  id    String @id @default(cuid())
  email String @unique
  name  String

  @@index([email]) // 添加索引加速查詢
}
```

### 7. 遷移管理

保持遷移文件有序：

```bash
# 創建命名清晰的遷移
npx prisma migrate dev --name add_user_email_index

# 在生產環境部署遷移
npx prisma migrate deploy
```

---

## 總結

- **PostgreSQL**: 生產環境首選，功能最全面
- **MySQL**: 高性能查詢，傳統 Web 應用
- **MongoDB**: 靈活 schema，大規模數據
- **SQLite**: 僅用於開發和測試

所有數據庫通過統一的適配器層訪問，切換數據庫無需修改應用代碼。

---

**需要幫助？**
- 查看 [Prisma 文檔](https://www.prisma.io/docs)
- 查看各數據庫官方文檔
- 提交 [GitHub Issue](https://github.com/laitim2001/ai-webapp-template/issues)

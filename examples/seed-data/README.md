# 種子數據說明

本目錄包含用於初始化項目的示例數據。這些數據採用通用格式，可以幫助您快速啟動項目並了解數據結構。

## 📦 數據文件

### users.json
包含 5 個示例用戶，涵蓋不同角色：

| 郵箱 | 角色 | 說明 |
|------|------|------|
| admin@example.com | ADMIN | 系統管理員，完整權限 |
| manager@example.com | MANAGER | 管理人員，項目和團隊管理 |
| editor@example.com | EDITOR | 編輯人員，內容創建和審核 |
| user1@example.com | USER | 一般用戶（已驗證郵箱） |
| user2@example.com | USER | 一般用戶（未驗證郵箱） |

**默認密碼**：所有用戶的密碼哈希對應明文密碼 `password123`

**密碼哈希**: `$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIr9O.u5wS`

### content-items.json
包含 20 個示例內容條目，涵蓋多種分類：

| 分類 | 數量 | 示例 |
|------|------|------|
| guide | 7 | 入門指南、最佳實踐、使用技巧 |
| advanced | 3 | 進階功能、自定義工作流程 |
| support | 1 | 常見問題解答 |
| announcement | 2 | 版本更新、未來規劃 |
| developer | 1 | API 文檔 |
| security | 3 | 數據安全、權限管理、備份 |
| analytics | 1 | 報告和分析 |

**特色標記**: 5 篇文章標記為 `featured`（精選）

**狀態**: 全部為 `published`（已發布）

### projects.json
包含 10 個示例項目，涵蓋不同狀態和優先級：

| 狀態 | 數量 | 優先級分佈 |
|------|------|-----------|
| active | 5 | Critical: 1, High: 1, Medium: 3 |
| planning | 3 | High: 1, Critical: 1, Low: 1 |
| completed | 1 | High: 1 |
| on-hold | 1 | Low: 1 |

**項目類型**:
- 開發項目: 網站重構、移動應用、API 文檔
- 基礎設施: 數據遷移、監控系統
- 質量保證: 自動化測試、安全審計
- 研究: 用戶體驗研究
- 功能增強: 性能優化、國際化支持

## 🚀 使用方法

### 方法 1: 使用 Prisma Seed 腳本

1. **創建種子腳本** (`prisma/seed.ts`):

```typescript
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('開始載入種子數據...');

  // 載入用戶數據
  const usersData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../examples/seed-data/users.json'), 'utf-8')
  );

  for (const user of usersData) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }
  console.log(`✅ 已創建 ${usersData.length} 個用戶`);

  // 載入內容數據
  const contentData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../examples/seed-data/content-items.json'), 'utf-8')
  );

  for (const content of contentData) {
    await prisma.content.upsert({
      where: { id: content.id },
      update: {},
      create: content,
    });
  }
  console.log(`✅ 已創建 ${contentData.length} 個內容條目`);

  // 載入項目數據
  const projectsData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../examples/seed-data/projects.json'), 'utf-8')
  );

  for (const project of projectsData) {
    await prisma.project.upsert({
      where: { id: project.id },
      update: {},
      create: project,
    });
  }
  console.log(`✅ 已創建 ${projectsData.length} 個項目`);

  console.log('種子數據載入完成！');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

2. **在 package.json 中添加**:

```json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

3. **運行種子腳本**:

```bash
npx prisma db seed
```

### 方法 2: 手動導入

您也可以通過應用的 UI 或 API 手動創建這些數據。

## 🔧 自定義數據

### 修改現有數據

直接編輯 JSON 文件，修改您需要的字段。所有文件都使用標準 JSON 格式，易於編輯。

### 添加更多數據

您可以按照現有格式添加更多用戶、內容或項目：

```json
{
  "id": "user-006",
  "email": "newuser@example.com",
  "name": "新用戶",
  "role": "USER",
  "password": "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIr9O.u5wS",
  "emailVerified": true,
  "avatar": null,
  "bio": "這是新添加的用戶",
  "createdAt": "2025-01-30T00:00:00.000Z",
  "updatedAt": "2025-01-30T00:00:00.000Z"
}
```

### 生成密碼哈希

如果需要生成新的密碼哈希，可以使用 bcrypt:

```typescript
import bcrypt from 'bcryptjs';

const password = 'your-password';
const hash = await bcrypt.hash(password, 12);
console.log(hash);
```

## 📋 數據結構說明

### 用戶 (User)

```typescript
{
  id: string;              // 唯一標識符
  email: string;           // 郵箱（唯一）
  name: string;            // 用戶名稱
  role: string;            // 角色: ADMIN, MANAGER, EDITOR, USER
  password: string;        // bcrypt 哈希密碼
  emailVerified: boolean;  // 郵箱是否已驗證
  avatar: string | null;   // 頭像 URL
  bio: string;             // 個人簡介
  createdAt: string;       // 創建時間 (ISO 8601)
  updatedAt: string;       // 更新時間 (ISO 8601)
}
```

### 內容 (Content)

```typescript
{
  id: string;              // 唯一標識符
  title: string;           // 標題
  slug: string;            // URL 友好的標識符
  content: string;         // Markdown 格式的內容
  excerpt: string;         // 摘要
  category: string;        // 分類
  tags: string[];          // 標籤數組
  author: string;          // 作者郵箱
  status: string;          // 狀態: draft, published, archived
  featured: boolean;       // 是否精選
  viewCount: number;       // 瀏覽次數
  publishedAt: string;     // 發布時間 (ISO 8601)
  createdAt: string;       // 創建時間 (ISO 8601)
  updatedAt: string;       // 更新時間 (ISO 8601)
}
```

### 項目 (Project)

```typescript
{
  id: string;              // 唯一標識符
  name: string;            // 項目名稱
  slug: string;            // URL 友好的標識符
  description: string;     // 項目描述
  status: string;          // 狀態: planning, active, on-hold, completed
  priority: string;        // 優先級: low, medium, high, critical
  owner: string;           // 負責人郵箱
  members: string[];       // 成員郵箱數組
  progress: number;        // 進度百分比 (0-100)
  budget: number;          // 預算
  startDate: string;       // 開始日期 (YYYY-MM-DD)
  dueDate: string;         // 截止日期 (YYYY-MM-DD)
  completedAt?: string;    // 完成時間 (ISO 8601, 可選)
  onHoldReason?: string;   // 暫停原因 (可選)
  tags: string[];          // 標籤數組
  category: string;        // 分類
  createdAt: string;       // 創建時間 (ISO 8601)
  updatedAt: string;       // 更新時間 (ISO 8601)
}
```

## ⚠️ 注意事項

1. **密碼安全**: 默認密碼 `password123` 僅用於開發測試，生產環境請務必修改
2. **郵箱地址**: 所有郵箱都使用 `@example.com`，請根據實際情況修改
3. **ID 格式**: 使用簡單的字符串 ID，您可以改用 UUID 或其他格式
4. **日期時間**: 所有日期使用 ISO 8601 格式，請根據您的時區調整
5. **數據關聯**: 某些字段（如 `author`, `owner`, `members`）通過郵箱關聯用戶，請確保數據一致性

## 🔗 相關文檔

- [Prisma Seed 文檔](https://www.prisma.io/docs/guides/database/seed-database)
- [bcrypt 密碼哈希](https://www.npmjs.com/package/bcryptjs)
- [JSON 格式規範](https://www.json.org/)

---

**提示**: 這些示例數據設計為通用格式，易於理解和修改。您可以根據實際項目需求自由調整數據結構和內容。

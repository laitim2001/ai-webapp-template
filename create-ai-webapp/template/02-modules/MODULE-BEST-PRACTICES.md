# 模組最佳實踐指南
# Module Best Practices Guide

**AI Web App Template v5.0**

本指南提供使用和開發模組的最佳實踐建議，幫助您充分利用模組系統並避免常見錯誤。

---

## 📋 目錄

1. [模組選擇指南](#模組選擇指南)
2. [模組整合最佳實踐](#模組整合最佳實踐)
3. [數據庫適配器使用](#數據庫適配器使用)
4. [錯誤處理模式](#錯誤處理模式)
5. [性能優化建議](#性能優化建議)
6. [安全性最佳實踐](#安全性最佳實踐)
7. [測試策略](#測試策略)
8. [常見問題與解決方案](#常見問題與解決方案)

---

## 🎯 模組選擇指南

### 核心模組（推薦所有項目）

| 模組 | 優先級 | 適用場景 |
|------|--------|---------|
| **module-auth** | P0 | 幾乎所有需要用戶系統的應用 |
| **module-api-gateway** | P0 | 需要企業級API管理的應用 |

### P1模組（常用功能）

| 模組 | 適用場景 | 依賴關係 |
|------|---------|---------|
| **module-knowledge-base** | 需要文檔管理、搜索功能 | module-search (可選) |
| **module-ai-integration** | 需要AI功能（聊天、嵌入、生成） | 無 |
| **module-workflow** | 需要審批流程、狀態管理 | module-auth |
| **module-notification** | 需要通知功能（郵件、站內） | module-auth |
| **module-cache** | 高流量應用，需要緩存層 | Redis |

### P2模組（輔助功能）

| 模組 | 適用場景 | 依賴關係 |
|------|---------|---------|
| **module-template** | 需要動態模板生成（郵件、報告） | 無 |
| **module-pdf** | 需要PDF生成功能 | module-template (可選) |
| **module-parsers** | 需要文件解析（PDF/Word/Excel） | 無 |
| **module-dynamics365** | 需要與Dynamics 365整合 | module-auth |
| **module-customer360** | 需要客戶360度視圖 | module-knowledge-base |
| **module-search** | 需要高級搜索功能 | 無 |

### 模組選擇流程圖

```
開始
  ↓
需要用戶系統？ → 是 → ✅ module-auth
  ↓ 否
需要API管理？ → 是 → ✅ module-api-gateway
  ↓ 否
需要文檔管理？ → 是 → ✅ module-knowledge-base
  ↓ 否
需要AI功能？ → 是 → ✅ module-ai-integration
  ↓ 否
需要工作流程？ → 是 → ✅ module-workflow
  ↓ 否
選擇其他P2模組
```

---

## 🔧 模組整合最佳實踐

### 1. 模組安裝順序

**推薦順序**（避免依賴問題）：

```bash
1. module-auth           # 基礎：用戶系統
2. module-api-gateway    # 基礎：API管理
3. module-cache          # 基礎：緩存層（如需要）
4. module-knowledge-base # 功能：文檔管理
5. module-ai-integration # 功能：AI能力
6. module-workflow       # 功能：工作流
7. module-notification   # 功能：通知系統
8. 其他輔助模組          # 根據需求選擇
```

### 2. 模組導入模式

✅ **正確做法**：

```typescript
// 使用模組導出的公共API
import { authenticateUser } from '@/lib/auth-server';
import { sendEmail } from '@/lib/notification/email-service';
import { generatePDF } from '@/lib/pdf/pdf-generator';
```

❌ **錯誤做法**：

```typescript
// 不要直接訪問模組內部實現
import { hashPassword } from '@/lib/auth-server/internal/hash';  // ❌
import { EmailTransport } from '@/lib/notification/email-service/transport';  // ❌
```

### 3. 配置管理

✅ **正確做法** - 使用環境變數：

```typescript
// .env.local
JWT_SECRET=your-secret-key
OPENAI_API_KEY=sk-...
REDIS_URL=redis://localhost:6379

// 代碼中讀取
const jwtSecret = process.env.JWT_SECRET!;
```

❌ **錯誤做法** - 硬編碼配置：

```typescript
const jwtSecret = 'my-secret-key';  // ❌ 不要硬編碼
const apiKey = 'sk-abc123';         // ❌ 不要提交到git
```

---

## 💾 數據庫適配器使用

### 核心原則

所有數據庫操作必須通過 `databaseAdapter` 完成，確保多數據庫兼容性。

### 標準CRUD操作

```typescript
import { databaseAdapter } from '@/lib/db/database-adapter';

// ✅ Create
const user = await databaseAdapter.create('user', {
  data: {
    email: 'user@example.com',
    name: 'John Doe',
  },
});

// ✅ Read (單筆)
const user = await databaseAdapter.findUnique('user', {
  where: { id: userId },
});

// ✅ Read (多筆)
const users = await databaseAdapter.findMany('user', {
  where: { role: 'ADMIN' },
  orderBy: { createdAt: 'desc' },
  take: 10,
});

// ✅ Update
const updated = await databaseAdapter.update('user', {
  where: { id: userId },
  data: { name: 'Jane Doe' },
});

// ✅ Delete
await databaseAdapter.delete('user', {
  where: { id: userId },
});
```

### 批量操作

```typescript
// ✅ 批量創建
const users = await databaseAdapter.createMany('user', {
  data: [
    { email: 'user1@example.com', name: 'User 1' },
    { email: 'user2@example.com', name: 'User 2' },
  ],
});

// ✅ 批量更新
await databaseAdapter.updateMany('user', {
  where: { role: 'USER' },
  data: { isActive: true },
});

// ✅ 批量刪除
await databaseAdapter.deleteMany('user', {
  where: { createdAt: { lt: oldDate } },
});
```

### 事務處理

```typescript
// ✅ 使用事務確保數據一致性
await databaseAdapter.transaction(async (tx) => {
  const order = await tx.create('order', {
    data: { userId, total: 100 },
  });

  await tx.createMany('orderItem', {
    data: items.map(item => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
    })),
  });

  await tx.update('user', {
    where: { id: userId },
    data: { totalOrders: { increment: 1 } },
  });
});
```

### 數據庫特定功能

```typescript
// PostgreSQL - 向量搜索
if (databaseAdapter.type === 'postgresql') {
  const results = await databaseAdapter.vectorSearch('knowledge_base', {
    vector: embedding,
    limit: 10,
  });
}

// MongoDB - 聚合查詢
if (databaseAdapter.type === 'mongodb') {
  const stats = await databaseAdapter.aggregate('user', [
    { $group: { _id: '$role', count: { $sum: 1 } } },
  ]);
}
```

---

## 🚨 錯誤處理模式

### 1. 統一錯誤處理

✅ **正確做法**：

```typescript
import { AppError, ErrorCode } from '@/lib/errors/app-error';
import { handleError } from '@/lib/errors/error-handler';

export async function createUser(data: CreateUserInput) {
  try {
    // 業務邏輯
    const user = await databaseAdapter.create('user', { data });
    return { success: true, data: user };
  } catch (error) {
    // 統一錯誤處理
    if (error.code === 'P2002') {  // Prisma unique constraint
      throw new AppError(
        ErrorCode.CONFLICT,
        'Email already exists',
        { email: data.email }
      );
    }
    throw handleError(error);
  }
}
```

### 2. API路由錯誤處理

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { handleApiError } from '@/lib/errors/api-error-handler';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await createUser(body);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);  // 自動轉換為適當的HTTP響應
  }
}
```

### 3. 前端錯誤處理

```typescript
// 使用 use-auth hook 的錯誤處理
const { login } = useAuth();

const handleLogin = async () => {
  try {
    await login(email, password);
    router.push('/dashboard');
  } catch (error) {
    if (error.code === 'AUTH_INVALID_CREDENTIALS') {
      setError('Invalid email or password');
    } else {
      setError('An error occurred. Please try again.');
    }
  }
};
```

---

## ⚡ 性能優化建議

### 1. 緩存策略

```typescript
import { redisClient } from '@/lib/cache/redis-client';

// ✅ 緩存頻繁訪問的數據
export async function getUser(userId: string) {
  const cacheKey = `user:${userId}`;

  // 先檢查緩存
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // 緩存未命中，查詢數據庫
  const user = await databaseAdapter.findUnique('user', {
    where: { id: userId },
  });

  // 存入緩存（TTL: 1小時）
  await redisClient.set(cacheKey, JSON.stringify(user), 'EX', 3600);

  return user;
}
```

### 2. 批量操作優化

```typescript
// ❌ 錯誤：N+1查詢問題
for (const user of users) {
  const orders = await databaseAdapter.findMany('order', {
    where: { userId: user.id },
  });
  user.orders = orders;
}

// ✅ 正確：批量查詢
const userIds = users.map(u => u.id);
const allOrders = await databaseAdapter.findMany('order', {
  where: { userId: { in: userIds } },
});

// 按userId分組
const ordersByUser = allOrders.reduce((acc, order) => {
  if (!acc[order.userId]) acc[order.userId] = [];
  acc[order.userId].push(order);
  return acc;
}, {});

users.forEach(user => {
  user.orders = ordersByUser[user.id] || [];
});
```

### 3. 分頁查詢

```typescript
// ✅ 使用 cursor-based 分頁（大數據集）
export async function getUsers(cursor?: string, limit = 20) {
  return await databaseAdapter.findMany('user', {
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: 'desc' },
  });
}

// ✅ 使用 offset 分頁（小數據集）
export async function getUsersPage(page = 1, pageSize = 20) {
  const skip = (page - 1) * pageSize;

  const [users, total] = await Promise.all([
    databaseAdapter.findMany('user', {
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    }),
    databaseAdapter.count('user'),
  ]);

  return {
    data: users,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}
```

---

## 🔒 安全性最佳實踐

### 1. 身份驗證

```typescript
// ✅ 保護API路由
import { verifyAuth } from '@/lib/auth-server';

export async function GET(request: NextRequest) {
  const authResult = await verifyAuth(request);
  if (!authResult.success) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = authResult.user;
  // 使用已驗證的用戶進行操作
}
```

### 2. 授權檢查

```typescript
// ✅ 檢查用戶權限
export async function deleteUser(userId: string, currentUser: User) {
  // 只有管理員或用戶本人可以刪除
  if (currentUser.role !== 'ADMIN' && currentUser.id !== userId) {
    throw new AppError(
      ErrorCode.FORBIDDEN,
      'You do not have permission to delete this user'
    );
  }

  await databaseAdapter.delete('user', { where: { id: userId } });
}
```

### 3. 輸入驗證

```typescript
import { z } from 'zod';

// ✅ 使用Zod驗證輸入
const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(100),
});

export async function createUser(input: unknown) {
  // 驗證輸入
  const data = CreateUserSchema.parse(input);

  // 繼續處理已驗證的數據
  const user = await databaseAdapter.create('user', { data });
  return user;
}
```

### 4. SQL注入防護

```typescript
// ✅ database adapter 自動防護SQL注入
const users = await databaseAdapter.findMany('user', {
  where: {
    email: userInput,  // 自動轉義，安全
  },
});

// ❌ 不要使用原始SQL（除非絕對必要）
const users = await databaseAdapter.rawQuery(
  `SELECT * FROM users WHERE email = '${userInput}'`  // ❌ SQL注入風險
);
```

---

## 🧪 測試策略

### 1. 單元測試

```typescript
// __tests__/lib/auth.test.ts
import { validatePassword } from '@/lib/auth';

describe('validatePassword', () => {
  it('should validate strong password', () => {
    const result = validatePassword('StrongP@ss123');
    expect(result.isValid).toBe(true);
  });

  it('should reject weak password', () => {
    const result = validatePassword('weak');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must be at least 8 characters');
  });
});
```

### 2. API測試

```typescript
// __tests__/api/users.test.ts
import { POST } from '@/app/api/users/route';
import { NextRequest } from 'next/server';

describe('POST /api/users', () => {
  it('should create user with valid data', async () => {
    const req = new NextRequest('http://localhost/api/users', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'StrongP@ss123',
        name: 'Test User',
      }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.email).toBe('test@example.com');
  });
});
```

### 3. 整合測試

```typescript
// tests/integration/auth-flow.test.ts
describe('Authentication Flow', () => {
  it('should complete full auth flow', async () => {
    // 1. 註冊
    const registerResponse = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    expect(registerResponse.status).toBe(201);

    // 2. 登入
    const loginResponse = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const { token } = await loginResponse.json();
    expect(token).toBeDefined();

    // 3. 訪問受保護資源
    const profileResponse = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(profileResponse.status).toBe(200);
  });
});
```

---

## 💡 常見問題與解決方案

### 問題 1: 模組之間的循環依賴

**症狀**：
```
Error: Circular dependency detected: moduleA -> moduleB -> moduleA
```

**解決方案**：
```typescript
// ❌ 錯誤：直接相互導入
// moduleA.ts
import { funcB } from './moduleB';

// moduleB.ts
import { funcA } from './moduleA';  // 循環依賴！

// ✅ 正確：使用共享的types文件
// types/shared.ts
export interface SharedType { }

// moduleA.ts
import type { SharedType } from './types/shared';

// moduleB.ts
import type { SharedType } from './types/shared';
```

### 問題 2: 數據庫連接池耗盡

**症狀**：
```
Error: Can't reach database server
Error: Connection pool timeout
```

**解決方案**：
```typescript
// ✅ 使用連接池管理
import { databaseAdapter } from '@/lib/db/database-adapter';

// 在serverless環境中重用連接
export const config = {
  maxDuration: 60,
};

// 使用 $disconnect() 釋放連接
try {
  const result = await databaseAdapter.findMany('user');
  return result;
} finally {
  // Serverless環境不需要disconnect（會自動管理）
  // 長時間運行的進程才需要手動管理
}
```

### 問題 3: Token過期處理

**症狀**：用戶在使用過程中突然被登出

**解決方案**：
```typescript
// ✅ 實現token自動刷新
import { useAuth } from '@/hooks/use-auth';

export function useApi() {
  const { refreshToken } = useAuth();

  const apiCall = async (url: string, options = {}) => {
    try {
      const response = await fetch(url, options);

      if (response.status === 401) {
        // Token過期，嘗試刷新
        const refreshed = await refreshToken();
        if (refreshed) {
          // 重試原始請求
          return fetch(url, options);
        }
      }

      return response;
    } catch (error) {
      throw error;
    }
  };

  return { apiCall };
}
```

### 問題 4: 文件上傳大小限制

**症狀**：
```
Error: Request entity too large
```

**解決方案**：
```typescript
// next.config.js
module.exports = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',  // 增加限制
    },
  },
};

// 或在特定API路由中禁用bodyParser
export const config = {
  api: {
    bodyParser: false,  // 使用multipart/form-data處理大文件
  },
};
```

### 問題 5: Redis緩存同步問題

**症狀**：修改數據後，緩存數據仍然是舊的

**解決方案**：
```typescript
// ✅ 更新數據時清除相關緩存
export async function updateUser(userId: string, data: any) {
  // 1. 更新數據庫
  const user = await databaseAdapter.update('user', {
    where: { id: userId },
    data,
  });

  // 2. 清除緩存
  await redisClient.del(`user:${userId}`);
  await redisClient.del(`users:list`);  // 也清除列表緩存

  return user;
}
```

---

## 📚 延伸閱讀

- [模組使用範例](./MODULE-USAGE-EXAMPLES.md)
- [模組整合指南](./MODULE-INTEGRATION-GUIDE.md)
- [數據庫適配器文檔](../01-base/lib/db/README.md)
- [錯誤處理指南](../01-base/lib/errors/README.md)

---

**版本**: 1.0.0
**最後更新**: 2025-10-06
**維護者**: AI Web App Template Team

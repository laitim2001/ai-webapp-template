# 認證系統提取計劃
# Authentication System Extraction Plan

**創建日期**: 2025-10-05
**目標**: 從源項目提取認證系統並改造為數據庫無關的模組

---

## 📋 認證系統文件清單

### 核心認證邏輯 (lib/)

| 文件 | 路徑 | 用途 | 行數估計 |
|------|------|------|---------|
| auth.ts | lib/auth.ts | 客戶端認證工具 | ~100 |
| auth-server.ts | lib/auth-server.ts | 服務端認證工具 | ~200 |
| token-service.ts | lib/auth/token-service.ts | JWT Token 服務 | ~550 |
| azure-ad-service.ts | lib/auth/azure-ad-service.ts | Azure AD SSO 整合 | ~350 |

### API 路由 (app/api/auth/)

| 路由 | 路徑 | 功能 | 行數估計 |
|------|------|------|---------|
| /login | app/api/auth/login/route.ts | 登入端點 | ~150 |
| /logout | app/api/auth/logout/route.ts | 登出端點 | ~80 |
| /register | app/api/auth/register/route.ts | 註冊端點 | ~200 |
| /refresh | app/api/auth/refresh/route.ts | Token 刷新 | ~120 |
| /me | app/api/auth/me/route.ts | 獲取當前用戶 | ~100 |
| /azure-ad/login | app/api/auth/azure-ad/login/route.ts | Azure AD 登入 | ~100 |
| /azure-ad/callback | app/api/auth/azure-ad/callback/route.ts | Azure AD 回調 | ~150 |

### React Hooks (hooks/)

| 文件 | 路徑 | 用途 | 行數估計 |
|------|------|------|---------|
| use-auth.tsx | hooks/use-auth.tsx | 認證 Hook | ~300 |

### 測試文件 (__tests__)

| 文件 | 路徑 | 用途 |
|------|------|------|
| login.test.tsx | __tests__/auth/login.test.tsx | 登入測試 |
| login.test.ts | __tests__/api/auth/login.test.ts | API 登入測試 |
| register.test.ts | __tests__/api/auth/register.test.ts | 註冊測試 |

**總計**: 約 8-10 個核心文件，2,500+ 行代碼

---

## 🎯 提取策略

### Phase 1: 核心文件提取
1. ✅ 提取 lib/auth.ts → 02-modules/module-auth/lib/auth.ts.template
2. ✅ 提取 lib/auth-server.ts → 02-modules/module-auth/lib/auth-server.ts.template
3. ✅ 提取 lib/auth/token-service.ts → 02-modules/module-auth/lib/token-service.ts.template
4. ✅ 提取 lib/auth/azure-ad-service.ts → 02-modules/module-auth/lib/azure-ad-service.ts.template

### Phase 2: API 路由提取
5. ✅ 提取所有 app/api/auth/** 路由
6. ✅ 轉換為模板格式

### Phase 3: React Hooks 提取
7. ✅ 提取 hooks/use-auth.tsx

### Phase 4: 數據庫適配器改造
8. ✅ 替換所有 Prisma 直接調用
9. ✅ 使用 databaseAdapter 統一接口
10. ✅ 確保支持 4 種數據庫

### Phase 5: 測試文件提取
11. ✅ 提取測試文件
12. ✅ 適配多數據庫測試

---

## 🔧 數據庫適配器改造

### 需要替換的 Prisma 調用

**原始代碼模式**:
```typescript
// ❌ 直接使用 Prisma
import { prisma } from '@/lib/prisma'

const user = await prisma.user.findUnique({
  where: { email }
})
```

**改造後**:
```typescript
// ✅ 使用數據庫適配器
import { databaseAdapter } from '@/lib/db/database-adapter'

const user = await databaseAdapter.findUnique('user', {
  where: { email }
})
```

### 認證系統中的數據庫操作

| 操作 | Prisma 原始 | 適配器調用 |
|------|------------|-----------|
| 查找用戶 | prisma.user.findUnique() | databaseAdapter.findUnique('user', ...) |
| 創建用戶 | prisma.user.create() | databaseAdapter.create('user', ...) |
| 更新用戶 | prisma.user.update() | databaseAdapter.update('user', ...) |
| 查找 Session | prisma.session.findUnique() | databaseAdapter.findUnique('session', ...) |
| 創建 Session | prisma.session.create() | databaseAdapter.create('session', ...) |
| 刪除 Session | prisma.session.delete() | databaseAdapter.delete('session', ...) |

---

## 📦 模組結構

```
02-modules/module-auth/
├── lib/
│   ├── auth.ts.template              # 客戶端認證工具
│   ├── auth-server.ts.template       # 服務端認證工具
│   ├── token-service.ts.template     # JWT Token 服務
│   └── azure-ad-service.ts.template  # Azure AD SSO
│
├── app/
│   └── api/
│       └── auth/
│           ├── login/
│           │   └── route.ts.template
│           ├── logout/
│           │   └── route.ts.template
│           ├── register/
│           │   └── route.ts.template
│           ├── refresh/
│           │   └── route.ts.template
│           ├── me/
│           │   └── route.ts.template
│           └── azure-ad/
│               ├── login/
│               │   └── route.ts.template
│               └── callback/
│                   └── route.ts.template
│
├── hooks/
│   └── use-auth.tsx.template         # React 認證 Hook
│
├── __tests__/
│   ├── auth/
│   │   └── login.test.tsx
│   └── api/
│       └── auth/
│           ├── login.test.ts
│           └── register.test.ts
│
├── types/
│   └── auth.ts.template              # 認證類型定義
│
└── README.md                         # 認證模組說明文檔
```

---

## 🔑 核心功能清單

### 1. JWT 雙 Token 系統
- ✅ Access Token (15 分鐘有效期)
- ✅ Refresh Token (7 天有效期)
- ✅ Token 自動刷新機制
- ✅ Token 黑名單 (登出時)

### 2. 用戶認證流程
- ✅ 用戶註冊 (郵箱 + 密碼)
- ✅ 用戶登入 (bcrypt 密碼驗證)
- ✅ 用戶登出 (Token 失效)
- ✅ 密碼重置 (可選功能)

### 3. Azure AD SSO 整合
- ✅ Azure AD OAuth 流程
- ✅ 企業用戶自動創建
- ✅ 用戶信息同步

### 4. 會話管理
- ✅ Session 存儲 (數據庫)
- ✅ Session 驗證
- ✅ Session 清理 (過期處理)

### 5. 安全特性
- ✅ bcrypt 密碼哈希
- ✅ JWT 簽名驗證
- ✅ CSRF 保護
- ✅ Rate Limiting (登入失敗限制)

---

## ✅ 驗證檢查清單

### PostgreSQL 驗證
- [ ] 用戶註冊成功
- [ ] 用戶登入成功
- [ ] Token 刷新成功
- [ ] 用戶登出成功
- [ ] Azure AD SSO 成功

### MySQL 驗證
- [ ] 用戶註冊成功
- [ ] 用戶登入成功
- [ ] Token 刷新成功
- [ ] 用戶登出成功

### MongoDB 驗證
- [ ] 用戶註冊成功
- [ ] 用戶登入成功
- [ ] Token 刷新成功
- [ ] 用戶登出成功

### SQLite 驗證
- [ ] 用戶註冊成功
- [ ] 用戶登入成功
- [ ] Token 刷新成功
- [ ] 用戶登出成功

---

## 📝 環境變數需求

```bash
# JWT 密鑰
JWT_SECRET={{RANDOM_32_BYTE_STRING}}
JWT_REFRESH_SECRET={{RANDOM_32_BYTE_STRING}}

# Azure AD (可選)
AZURE_AD_CLIENT_ID={{YOUR_CLIENT_ID}}
AZURE_AD_CLIENT_SECRET={{YOUR_CLIENT_SECRET}}
AZURE_AD_TENANT_ID={{YOUR_TENANT_ID}}
AZURE_AD_REDIRECT_URI={{YOUR_REDIRECT_URI}}

# Token 有效期
JWT_ACCESS_TOKEN_EXPIRY=15m
JWT_REFRESH_TOKEN_EXPIRY=7d

# 登入限制
MAX_LOGIN_ATTEMPTS=5
LOGIN_LOCKOUT_DURATION=15m
```

---

## 🚀 下一步

1. ✅ **創建此計劃文檔** (當前)
2. ⏳ 提取核心認證文件
3. ⏳ 改造為數據庫適配器
4. ⏳ 測試 4 種數據庫
5. ⏳ 創建認證模組 README

---

**預計完成時間**: Week 2 Day 6-7 (2 天)
**預計代碼行數**: 2,500+ 行

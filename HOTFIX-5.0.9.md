# Hotfix 5.0.9 Release Notes

**發布日期**: 2025-10-12
**版本**: 5.0.9
**類型**: Critical Fix - Environment Variables & Docker Configuration
**NPM**: https://www.npmjs.com/package/create-ai-webapp

---

## 🚨 緊急修復

### v5.0.8 的設計錯誤

**問題嚴重性**: 🔴 Critical - 違反源項目設計原則

**用戶反饋**:
> "第1, 項目不應該會同時使用 .env 和 .env.local, 因為源項目中也只是使用到 .env.local"
> "第2. Docker 命令生成時的數據庫名稱是否一致呢?"

**根本問題**:

1. **v5.0.8 的錯誤設計**:
   - 同時生成 `.env` 和 `.env.local` 兩個文件
   - 違反源項目只使用 `.env.local` 的設計原則
   - 引入不必要的文件冗餘

2. **Docker 數據庫名稱不匹配**:
   ```bash
   # CLI 詢問的默認數據庫名
   Database: myapp

   # Docker 命令（v5.0.8）
   docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=password postgres:14
   # ❌ 沒有指定 POSTGRES_DB，會使用默認的 "postgres" 數據庫

   # 連接字符串
   DATABASE_URL="postgresql://postgres:password@localhost:5432/myapp"
   # ❌ 嘗試連接 "myapp" 數據庫，但不存在！
   ```

3. **密碼默認值問題**:
   - CLI 詢問密碼時默認為空
   - Docker 命令示例使用 `password`
   - 不匹配導致認證失敗

---

## 🔧 正確的解決方案

### 1. 回歸單一 `.env.local` 文件

**設計原則**: 遵循源項目設計，只使用 `.env.local`

```javascript
// 修復前 (v5.0.8 - 錯誤設計)
await fs.writeFile('.env.local', envContent);
await fs.writeFile('.env', envContent);  // ❌ 不必要的冗餘

// 修復後 (v5.0.9 - 正確設計)
await fs.writeFile('.env.local', envContent);  // ✅ 只生成 .env.local
```

**手動初始化時的處理**:
- 用戶需要手動複製 `.env.local` → `.env`
- 完成信息中明確說明這個步驟

### 2. 修復 Docker 數據庫名稱

```bash
# 修復前 (v5.0.8)
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=password postgres:14
# ❌ 使用默認 "postgres" 數據庫

# 修復後 (v5.0.9)
docker run -d -p 5432:5432 \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=myapp \
  postgres:14
# ✅ 創建 "myapp" 數據庫，與 CLI 默認值匹配
```

### 3. 修復密碼默認值

```javascript
// 修復前 (v5.0.8)
{
  type: 'password',
  name: 'password',
  message: 'Password:',
  default: '',  // ❌ 空密碼
}

// 修復後 (v5.0.9)
{
  type: 'password',
  name: 'password',
  message: 'Password (用於 Docker 請使用 "password"):',
  default: 'password',  // ✅ 匹配 Docker 示例
}
```

### 4. 更新手動初始化步驟

```
修復前 (v5.0.8):
  3. 確認 .env 或 .env.local 中的數據庫連接信息正確
  4. 初始化數據庫

修復後 (v5.0.9):
  3. 確認 .env.local 中的數據庫連接信息正確
  4. 複製環境變數文件（Prisma CLI 需要）:
     copy .env.local .env     # Windows
     cp .env.local .env       # macOS/Linux
  5. 初始化數據庫
```

---

## 📋 技術細節

### 為什麼只使用 `.env.local`？

| 文件 | 用途 | 應該提交到 Git? |
|------|------|-----------------|
| `.env` | 默認環境變數（無敏感信息） | ✅ 可以提交 |
| `.env.local` | 本地開發環境變數（含敏感信息） | ❌ 不應提交 |
| `.env.production` | 生產環境變數 | ❌ 不應提交 |

**源項目設計**:
- 只使用 `.env.local` 存儲所有本地環境變數
- `.env.local` 在 `.gitignore` 中，不會被提交
- 簡單、清晰、符合 Next.js 最佳實踐

**Prisma CLI 的限制**:
- Prisma CLI 默認只讀取 `.env`
- 解決方案: 用戶手動複製 `.env.local` → `.env`（一次性操作）

### Docker 環境變數完整列表

**PostgreSQL**:
```bash
docker run -d -p 5432:5432 \
  -e POSTGRES_PASSWORD=password \    # 必須
  -e POSTGRES_DB=myapp \             # 重要！與 CLI 默認值匹配
  postgres:14
```

**MySQL**:
```bash
docker run -d -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=myapp \
  mysql:8.0
```

**MongoDB**:
```bash
docker run -d -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  -e MONGO_INITDB_DATABASE=myapp \
  mongo:6.0
```

### 修改的文件

**create-ai-webapp/lib/cli.js**:

1. **Line 521-538: `generateEnvFile()` 函數**
   ```javascript
   // 只生成 .env.local (Next.js 和開發環境使用)
   await fs.writeFile('.env.local', envContent);
   spinner.succeed('環境變數文件已生成 (.env.local)');
   ```

2. **Line 267-272: 密碼提示**
   ```javascript
   {
     type: 'password',
     name: 'password',
     message: 'Password (用於 Docker 請使用 "password"):',
     default: 'password',
   }
   ```

3. **Line 689-693: Docker 命令**
   ```javascript
   console.log(chalk.white('     Docker (推薦):'));
   console.log(chalk.gray('       docker run -d -p 5432:5432 \\'));
   console.log(chalk.gray('         -e POSTGRES_PASSWORD=password \\'));
   console.log(chalk.gray('         -e POSTGRES_DB=myapp \\'));
   console.log(chalk.gray('         postgres:14\n'));
   ```

4. **Line 725-736: 手動初始化步驟**
   ```javascript
   console.log(chalk.cyan('  3. 確認 .env.local 中的數據庫連接信息正確\n'));
   console.log(chalk.cyan('  4. 複製環境變數文件（Prisma CLI 需要）:'));
   console.log(chalk.gray('     copy .env.local .env     # Windows'));
   console.log(chalk.gray('     cp .env.local .env       # macOS/Linux\n'));
   console.log(chalk.cyan('  5. 初始化數據庫:\n'));
   ```

**create-ai-webapp/package.json**:
- Line 3: 版本號從 `5.0.8` → `5.0.9`

---

## ✅ 修復驗證

### 測試場景 1: Docker PostgreSQL 完整流程

```bash
# 1. 啟動 PostgreSQL（使用正確的命令）
docker run -d -p 5432:5432 \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=myapp \
  postgres:14

# 2. 創建項目
npx create-ai-webapp@5.0.9 test-project
# 選擇 PostgreSQL
# 密碼: password (默認值，直接按 Enter)
# 數據庫: myapp (默認值)

# 3. 進入項目
cd test-project

# 4. 驗證 .env.local
cat .env.local
# DATABASE_URL="postgresql://postgres:password@localhost:5432/myapp"
# ✅ 密碼和數據庫名都正確

# 5. 複製環境變數文件
cp .env.local .env

# 6. 手動初始化數據庫
npx prisma migrate dev --name init
# ✅ 成功連接
# ✅ 數據庫初始化完成
```

### 測試場景 2: CLI 自動初始化

```bash
# 先啟動數據庫
docker run -d -p 5432:5432 \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=myapp \
  postgres:14

# 創建項目
npx create-ai-webapp@5.0.9 test-project-2
# 選擇 PostgreSQL
# 密碼: password
# 數據庫: myapp

# 預期結果:
# ✅ 自動初始化成功（CLI 內部會複製 .env.local → .env）
# 🎉 項目創建成功！
```

### 測試場景 3: 驗證單一 .env.local

```bash
cd test-project
ls -a | grep env

# 應該看到:
# .env.local      ✅ CLI 生成
# .env            ❌ 不存在（需要手動複製）

# 這與源項目設計一致
```

---

## 🎯 用戶指南

### 完整的手動初始化流程

```bash
# 1. 啟動數據庫（使用正確的命令）
docker run -d -p 5432:5432 \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=myapp \
  postgres:14

# 2. 創建項目
npx create-ai-webapp@latest my-project

# 3. 進入項目
cd my-project

# 4. 檢查 .env.local
cat .env.local
# 確認 DATABASE_URL 正確

# 5. 複製給 Prisma CLI 使用
copy .env.local .env      # Windows
cp .env.local .env        # macOS/Linux

# 6. 初始化數據庫
npx prisma migrate dev --name init

# 7. 啟動項目
npm run dev
```

### 為什麼需要複製 .env.local？

- **Next.js**: 可以自動讀取 `.env.local`
- **Prisma CLI**: 只讀取 `.env`

這是 Prisma 的設計限制，不是我們的 bug。解決方案就是手動複製一次。

### 如果忘記複製 .env.local 會怎樣？

```bash
npx prisma migrate dev --name init

# 錯誤:
# Environment variables loaded from .env
# Prisma schema loaded from prisma\schema.prisma
# Error: P1000: Authentication failed
```

**解決方法**: 複製文件後重新運行
```bash
cp .env.local .env
npx prisma migrate dev --name init
```

---

## 📊 影響分析

### 設計對比

| 方面 | v5.0.8 (錯誤) | v5.0.9 (正確) |
|------|---------------|---------------|
| 生成的文件 | `.env.local` + `.env` | 只 `.env.local` |
| 符合源項目設計 | ❌ 否 | ✅ 是 |
| 文件冗餘 | ❌ 有冗餘 | ✅ 無冗餘 |
| Docker 數據庫名 | ❌ 不匹配 | ✅ 匹配 |
| 密碼默認值 | ❌ 空 | ✅ "password" |
| 手動初始化指導 | ❌ 不清晰 | ✅ 清晰明確 |

### 用戶體驗改進

**v5.0.8 問題**:
- 同時有兩個文件，用戶困惑
- Docker 命令與 CLI 不匹配
- 密碼默認值導致認證失敗

**v5.0.9 改進**:
- 只有 `.env.local`，清晰簡單
- Docker 命令完整，一次成功
- 密碼默認值匹配，減少錯誤

---

## 🗺️ 版本歷史

### v5.0.9 (2025-10-12) - 當前版本

**Critical Fix**:
- 回歸單一 `.env.local` 文件設計（符合源項目）
- 修復 Docker 命令，添加 `POSTGRES_DB=myapp`
- 更新密碼默認值為 `password`（匹配 Docker）
- 改進手動初始化步驟說明

### v5.0.8 (2025-10-12) - 已撤回

**Issue**:
- ❌ 錯誤設計：同時生成 `.env` 和 `.env.local`
- ❌ Docker 數據庫名不匹配
- ❌ 密碼默認值不正確

### v5.0.7 (2025-10-12)

**UX Improvement**:
- 將數據庫初始化從致命錯誤改為可選步驟

### v5.0.6 (2025-10-11)

**Critical Hotfix**:
- 修復 ESLint 9 與 eslint-config-next 衝突

---

## 🔍 學到的教訓

### 設計原則的重要性

1. **遵循源項目設計**: 不要"優化"已經良好的設計
   - 源項目只用 `.env.local` 是有原因的
   - 不應該為了"方便"而引入新文件

2. **理解工具限制**: Prisma CLI 的限制是已知的
   - 正確的做法: 教用戶如何處理
   - 錯誤的做法: 違反設計原則來"解決"

3. **完整的示例命令**: Docker 命令必須完整
   - 不只是 `POSTGRES_PASSWORD`
   - 還需要 `POSTGRES_DB` 等關鍵參數

4. **默認值要合理**: CLI 提示的默認值應該匹配示例命令
   - 密碼默認 `password` → 匹配 Docker 命令
   - 數據庫默認 `myapp` → 匹配 Docker 命令

### 用戶反饋的價值

感謝用戶指出設計問題：
- 快速發現了 v5.0.8 的錯誤設計
- 提供了正確的解決方向
- 避免了更多用戶遇到問題

---

## 🎯 下一步計劃

### v5.1.0 (計劃中)

- [ ] 添加數據庫連接測試工具
- [ ] 支持從現有數據庫導入 schema
- [ ] 改進環境變數管理體驗
- [ ] 添加常見問題排查指南

---

## 📜 完整變更日誌

```
v5.0.9 (2025-10-12) - CRITICAL FIX
- fix: revert to single .env.local file (match source project design)
- fix: add POSTGRES_DB=myapp to Docker command
- fix: update password default value to 'password'
- docs: improve manual database initialization steps
- docs: add HOTFIX-5.0.9.md release notes

v5.0.8 (2025-10-12) - DEPRECATED
- issue: generated both .env and .env.local (wrong design)
- issue: Docker database name mismatch
- issue: password default value incorrect

v5.0.7 (2025-10-12) - UX IMPROVEMENT
- feat: graceful database initialization with optional fallback

v5.0.6 (2025-10-11) - HOTFIX
- fix: upgrade eslint-config-next to 15.5.4 for ESLint 9 compatibility
```

---

**立即使用正確版本**:

```bash
npx create-ai-webapp@latest my-awesome-app
```

**驗證版本**:

```bash
npm view create-ai-webapp version
# 應顯示: 5.0.9
```

---

**發布日期**: 2025-10-12
**發布者**: laitim2001
**版本**: 5.0.9 (Critical Fix)
**狀態**: ✅ 準備發布
**優先級**: 🔴 緊急修復 (設計錯誤修正)

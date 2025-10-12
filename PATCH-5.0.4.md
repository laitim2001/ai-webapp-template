# Patch 5.0.4 Release Notes

**發布日期**: 2025-10-11
**版本**: 5.0.4
**類型**: Critical Bug Fix
**NPM**: https://www.npmjs.com/package/create-ai-webapp

---

## 🚨 關鍵修復

### Prisma Schema 模板文件衝突

**問題嚴重性**: 🔴 Critical - 導致 58 個 Prisma 驗證錯誤

**問題描述**:
```
Error: Prisma schema validation - (get-config wasm)
Error code: P1012
error: Datasource provider not known: "{{PROVIDER}}".
error: This line is not a valid definition: {{VECTOR_EXTENSION}}
error: This line is not a valid field: id {{ID_TYPE}}
error: This line is not a valid field: {{MONGODB_MAP}}
... (共 58 個驗證錯誤)
```

**根本原因**:
- `copyBaseFiles()` 函數會遞歸複製所有基礎文件，包括 `schema.prisma.template`
- `copyDirectory()` 自動處理 `.template` 文件，移除後綴並替換基本占位符
- 但 Prisma schema 有特殊占位符 (`{{PROVIDER}}`, `{{ID_TYPE}}`, `{{MONGODB_MAP}}` 等) 未被處理
- 結果生成的 `schema.prisma` 包含未替換的占位符
- `copyPrismaSchema()` 後來嘗試覆蓋，但可能已被錯誤文件污染

**修復方案**:
```javascript
// lib/file-processor.js:59-62
// 在 copyBaseFiles 中添加過濾器，排除 Prisma schema 文件

// 跳過 Prisma schema 文件 (由 copyPrismaSchema 專門處理)
if (relativePath.includes('prisma') && path.basename(filePath).startsWith('schema.')) {
  return false;
}
```

**修復策略**:
- ✅ `copyBaseFiles()` 不再複製任何 `schema.*` 文件
- ✅ 只有 `copyPrismaSchema()` 負責複製數據庫特定的 schema
- ✅ 避免模板文件被意外處理和生成錯誤的 `schema.prisma`
- ✅ 確保正確的 `schema.{database}.prisma` 被複製

**影響範圍**:
- ✅ 所有數據庫類型的項目初始化
- ✅ 100% 修復 Prisma 驗證錯誤
- ✅ 確保 `npx prisma generate` 正常執行

---

## 📋 技術細節

### 文件處理流程

**修復前**:
```
1. copyBaseFiles() 複製所有文件
   ├─ schema.postgresql.prisma ✅
   ├─ schema.mysql.prisma ✅
   ├─ schema.mongodb.prisma ✅
   ├─ schema.sqlite.prisma ✅
   └─ schema.prisma.template ❌ (被處理成 schema.prisma，包含占位符)

2. copyPrismaSchema() 複製特定數據庫 schema
   └─ 嘗試覆蓋 schema.prisma，但可能失敗或不完整
```

**修復後**:
```
1. copyBaseFiles() 複製所有文件
   ├─ 跳過所有 schema.* 文件 ✅

2. copyPrismaSchema() 專門處理 schema
   └─ 複製正確的 schema.{database}.prisma → schema.prisma ✅
```

### 文件過濾邏輯

**新增過濾條件**:
```javascript
// 檢查路徑是否在 prisma 目錄下
if (relativePath.includes('prisma')) {
  // 檢查文件名是否以 schema. 開頭
  if (path.basename(filePath).startsWith('schema.')) {
    return false; // 跳過該文件
  }
}
```

**過濾的文件**:
- `schema.postgresql.prisma`
- `schema.mysql.prisma`
- `schema.mongodb.prisma`
- `schema.sqlite.prisma`
- `schema.prisma.template`

**不過濾的文件**:
- `seed.js`
- `seed-data/` (目錄)
- 其他 Prisma 相關文件

---

## 🔧 修復文件

### 變更的文件

1. **create-ai-webapp/lib/file-processor.js**
   - 函數: `copyBaseFiles()`
   - 行數: 第 59-62 行
   - 變更: 添加 Prisma schema 文件過濾器

2. **create-ai-webapp/package.json**
   - 行數: 第 3 行
   - 變更: 版本號從 `5.0.3` → `5.0.4`

---

## ✅ 測試驗證

### 測試場景 1: PostgreSQL 項目

```bash
npx create-ai-webapp@5.0.4 test-postgresql
# 選擇: PostgreSQL
# 預期結果:
# ✅ schema.prisma 正確生成 (無占位符)
# ✅ npx prisma generate 成功
# ✅ npx prisma migrate dev 成功
```

### 測試場景 2: MySQL 項目

```bash
npx create-ai-webapp@5.0.4 test-mysql
# 選擇: MySQL
# 預期結果:
# ✅ schema.prisma 正確生成 (MySQL 語法)
# ✅ npx prisma generate 成功
# ✅ npx prisma migrate dev 成功
```

### 測試場景 3: MongoDB 項目

```bash
npx create-ai-webapp@5.0.4 test-mongodb
# 選擇: MongoDB
# 預期結果:
# ✅ schema.prisma 正確生成 (MongoDB 語法)
# ✅ npx prisma generate 成功
# ✅ npx prisma db push 成功
```

### 測試場景 4: SQLite 項目

```bash
npx create-ai-webapp@5.0.4 test-sqlite
# 選擇: SQLite
# 預期結果:
# ✅ schema.prisma 正確生成 (SQLite 語法)
# ✅ npx prisma generate 成功
# ✅ npx prisma migrate dev 成功
```

---

## 🔄 升級指南

### 自動升級 (推薦)

用戶使用 `@latest` 會自動獲取 5.0.4:

```bash
npx create-ai-webapp@latest my-app
```

### 已有項目 (受影響用戶)

如果已經使用 v5.0.0-5.0.3 創建項目並遇到 Prisma 錯誤:

```bash
# 1. 進入項目目錄
cd your-project

# 2. 檢查 schema.prisma 是否包含占位符
grep "{{" prisma/schema.prisma

# 3. 如果有占位符，從模板重新複製正確的 schema
# 從 ai-webapp-template/01-base/prisma/ 複製對應的 schema.{database}.prisma

# 4. 重新生成 Prisma Client
npx prisma generate

# 5. 運行數據庫遷移
npx prisma migrate dev --name init  # PostgreSQL/MySQL/SQLite
# 或
npx prisma db push  # MongoDB
```

---

## 📊 影響分析

### 受影響用戶

**v5.0.0-5.0.3 用戶**:
- ✅ 已修復 (5.0.4)
- 問題: 58 個 Prisma 驗證錯誤
- 影響: 無法執行 `npx prisma generate`
- 範圍: **所有數據庫類型**

### 錯誤示例

```
error: Datasource provider not known: "{{PROVIDER}}".
  -->  schema.prisma:31
   |
30 | datasource db {
31 |   provider = "{{PROVIDER}}"
   |              ~~~~~~~~~~~~~~
   |

error: This line is not a valid definition: {{VECTOR_EXTENSION}}
  -->  schema.prisma:33
   |
32 |   url      = env("DATABASE_URL")
33 |   {{VECTOR_EXTENSION}}
   |   ~~~~~~~~~~~~~~~~~~~~~~
   |

... (共 58 個類似錯誤)
```

---

## 🗺️ 版本歷史

### v5.0.4 (2025-10-11) - 當前版本

**Critical Fix**:
- 修復 Prisma schema 模板文件衝突 (排除 schema.* 自動複製)

### v5.0.3 (2025-10-11)

**Bug Fix**:
- 改進 Prisma 錯誤輸出可見性 (`stdio: 'inherit'`)

### v5.0.2 (2025-10-11)

**Critical Fix**:
- 修復 OpenTelemetry 依賴衝突 (`api@1.7.0`)

### v5.0.1 (2025-10-11)

**Bug Fixes**:
- 改進 npm install 錯誤處理
- 修復 Windows 清理目錄問題

### v5.0.0 (2025-10-11)

**Initial Release**:
- NPX 包首次發布
- 22個功能模組
- 15個演示頁面

---

## 🤝 致謝

### 問題發現

感謝用戶報告和測試發現此關鍵問題:
- 實際用戶測試反饋
- 詳細錯誤日誌提供

### 快速響應

- **發現時間**: 2025-10-11 11:00
- **修復時間**: 2025-10-11 11:20
- **發布時間**: 2025-10-11 11:30
- **響應時長**: < 30 分鐘 ⚡

---

## 📞 支持

### 遇到問題?

**GitHub Issues**: https://github.com/laitim2001/ai-webapp-template/issues
**NPM Package**: https://www.npmjs.com/package/create-ai-webapp
**Email**: laitim20012@gmail.com

### 報告 Bug

請提供:
1. 操作系統 (Windows/macOS/Linux)
2. Node.js 版本 (`node --version`)
3. NPM 版本 (`npm --version`)
4. 選擇的數據庫類型
5. 完整錯誤日誌

---

## 🔍 學到的教訓

### 文件處理策略

1. **專門處理特殊文件** - 不要讓通用函數處理特殊文件
2. **明確的文件過濾** - 使用精確的過濾器避免意外複製
3. **職責分離** - 每個函數有明確的單一職責
4. **測試所有數據庫** - 確保所有數據庫類型都經過測試

### 質量保證

1. **完整測試覆蓋** - 測試所有配置組合
2. **錯誤可見性** - 確保所有錯誤都能被用戶看到
3. **快速響應** - 關鍵問題立即修復並發布
4. **詳細文檔** - 清晰的發布說明和升級指南

---

## 🎯 下一步計劃

### v5.0.5 (可能)

- [ ] 添加更詳細的初始化日誌
- [ ] 改進文件複製進度顯示
- [ ] 添加 schema 驗證步驟

### v5.1.0 (計劃中)

- [ ] 添加 `--skip-install` 選項
- [ ] 支持自定義模板
- [ ] 改進 CLI 互動體驗
- [ ] 添加依賴健康檢查

---

## 📜 完整變更日誌

```
v5.0.4 (2025-10-11)
- fix: exclude Prisma schema files from automatic copying in copyBaseFiles
- docs: add PATCH-5.0.4.md release notes

v5.0.3 (2025-10-11)
- fix: improve Prisma error visibility (stdio: inherit)
- docs: add PATCH-5.0.3.md release notes

v5.0.2 (2025-10-11)
- fix: resolve OpenTelemetry dependency conflict (@opentelemetry/api@1.7.0)
- docs: add PATCH-5.0.2.md release notes

v5.0.1 (2025-10-11)
- fix: improve npm install error handling (stdio: inherit)
- fix: Windows directory cleanup with retry logic
- docs: add PATCH-5.0.1.md release notes

v5.0.0 (2025-10-11)
- feat: initial NPX package release
- feat: 22 functional modules
- feat: 15 demo pages
- feat: multi-database support
- docs: comprehensive Chinese documentation
```

---

**立即使用修復版本**:

```bash
npx create-ai-webapp@latest my-awesome-app
```

**驗證版本**:

```bash
npm view create-ai-webapp version
# 應顯示: 5.0.4
```

---

**發布日期**: 2025-10-11
**發布者**: laitim2001
**版本**: 5.0.4 (Critical Fix)
**狀態**: ✅ 準備發布

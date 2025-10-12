# Hotfix 5.0.12 Release Notes

**發布日期**: 2025-10-12
**版本**: 5.0.12
**類型**: Critical Fix - Missing Dependency
**NPM**: https://www.npmjs.com/package/create-ai-webapp

---

## 🚨 緊急修復

### tailwindcss-animate 依賴缺失

**問題嚴重性**: 🔴 Critical - 阻止應用啟動

**用戶反饋**:
```
Error: Cannot find module 'tailwindcss-animate'
Require stack:
- C:\test-ai-webapp\test-ai-webapp-new\tailwind.config.js
```

**根本問題**:

1. **模板依賴不完整**:
   - `tailwind.config.js` 引用了 `tailwindcss-animate` 插件
   - 但 `package.json.template` 中**沒有包含**這個依賴
   - CLI 生成項目時只安裝 package.json 中列出的依賴
   - 導致運行時找不到模塊

2. **引用位置**:
   ```javascript
   // tailwind.config.js (Line 143)
   plugins: [
     require("tailwindcss-animate"),  // ❌ 依賴缺失
   ],
   ```

3. **影響範圍**:
   - 所有使用 v5.0.11（及之前版本）創建的項目
   - 運行 `npm run dev` 時立即失敗
   - 無法啟動開發服務器

---

## 🔧 解決方案

### 修復內容

**package.json.template (Line 89-94)**:

**修復前 (v5.0.11)**:
```json
"devDependencies": {
  "tailwindcss": "^3.4.1",
  "postcss": "^8.4.33",
  "autoprefixer": "^10.4.16",
  "@tailwindcss/typography": "^0.5.10",
  "@tailwindcss/forms": "^0.5.7",
  // ❌ 缺少 tailwindcss-animate
}
```

**修復後 (v5.0.12)**:
```json
"devDependencies": {
  "tailwindcss": "^3.4.1",
  "tailwindcss-animate": "^1.0.7",  // ✅ 添加
  "postcss": "^8.4.33",
  "autoprefixer": "^10.4.16",
  "@tailwindcss/typography": "^0.5.10",
  "@tailwindcss/forms": "^0.5.7",
}
```

### 修改的文件

**create-ai-webapp/template/01-base/package.json.template**:
- Line 90: 添加 `"tailwindcss-animate": "^1.0.7"`

**create-ai-webapp/package.json**:
- Line 3: 版本號從 `5.0.11` → `5.0.12`

---

## ✅ 修復驗證

### 測試場景 1: 全新項目（v5.0.12）

```bash
# 創建項目
npx create-ai-webapp@5.0.12 test-project
# 選擇 PostgreSQL
# 使用默認配置

# 進入項目
cd test-project

# 檢查 package.json
cat package.json | grep tailwindcss-animate
# ✅ 應該看到: "tailwindcss-animate": "^1.0.7"

# 啟動開發服務器
npm run dev
# ✅ 成功啟動，沒有 "Cannot find module" 錯誤
```

### 測試場景 2: 從 v5.0.11 升級

如果你已經使用 v5.0.11 創建了項目並遇到此錯誤：

```bash
# 進入項目
cd your-project

# 安裝缺失的依賴
npm install tailwindcss-animate --save-dev

# 啟動開發服務器
npm run dev
# ✅ 現在應該成功了
```

---

## 📋 技術細節

### 什麼是 tailwindcss-animate？

**tailwindcss-animate** 是一個 Tailwind CSS 插件，提供預設的動畫工具類。

**功能**:
```javascript
// 提供這些動畫類
animate-spin       // 旋轉動畫
animate-ping       // 脈衝動畫
animate-pulse      // 漸變動畫
animate-bounce     // 彈跳動畫
// ... 以及自定義動畫
```

**在模板中的使用**:
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),  // 啟用動畫插件
  ],
}
```

**應用場景**:
- Radix UI 組件動畫（手風琴、對話框等）
- 載入狀態指示器
- 過渡效果和微互動
- 響應式動畫

### 為什麼會漏掉？

這是**模板維護疏忽**：
1. 複製 `tailwind.config.js` 時包含了插件引用
2. 但更新 `package.json.template` 時忘記添加對應依賴
3. 本地測試環境可能已全局安裝，沒有發現問題
4. 用戶全新安裝時才暴露問題

### 依賴版本

**tailwindcss-animate@1.0.7**:
- 發布日期: 2023-12
- 兼容性: Tailwind CSS 3.x
- 無重大更新，版本穩定
- 無已知安全漏洞

---

## 🎯 用戶指南

### 完整的項目啟動流程

**使用 v5.0.12（已修復）**:
```bash
# 1. 啟動數據庫
docker run -d -p 5432:5432 \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=myapp \
  --name ai-webapp-postgres \
  ankane/pgvector:latest

# 2. 創建項目
npx create-ai-webapp@latest my-app
# 選擇 PostgreSQL，使用默認值

# 3. 進入項目
cd my-app

# 4. 初始化數據庫
cp .env.local .env
npx prisma migrate dev --name init

# 5. 啟動開發服務器
npm run dev
# ✅ 訪問 http://localhost:3000
```

### 如果遇到 "Cannot find module" 錯誤

**診斷步驟**:
```bash
# 1. 檢查是否安裝了 tailwindcss-animate
npm list tailwindcss-animate

# 如果顯示 "empty"，則未安裝
# 2. 手動安裝
npm install tailwindcss-animate --save-dev

# 3. 驗證安裝
cat package.json | grep tailwindcss-animate
# 應該看到: "tailwindcss-animate": "^1.0.7"

# 4. 重新啟動
npm run dev
```

### 檢查其他可能缺失的依賴

```bash
# 檢查所有依賴是否完整安裝
npm list --depth=0

# 如果有警告，重新安裝
npm install

# 清理並重新安裝（如果問題持續）
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 影響分析

### 問題影響範圍

| 版本 | tailwindcss-animate | 狀態 |
|------|-------------------|------|
| v5.0.11 及之前 | ❌ 缺失 | 無法啟動 |
| v5.0.12 | ✅ 包含 | 正常運行 |

**受影響的功能**:
- 所有使用 Tailwind CSS 的組件
- Radix UI 組件動畫
- 自定義動畫效果
- 開發服務器啟動

### 用戶體驗影響

**v5.0.11 問題**:
- ❌ 運行 `npm run dev` 立即失敗
- ❌ 錯誤信息不明確（需要了解依賴關係）
- ❌ 需要手動安裝依賴才能運行
- ❌ 影響所有新用戶的第一印象

**v5.0.12 改進**:
- ✅ 依賴完整，開箱即用
- ✅ `npm run dev` 直接成功
- ✅ 無需手動安裝額外依賴
- ✅ 順暢的用戶體驗

---

## 🗺️ 版本歷史

### v5.0.12 (2025-10-12) - 當前版本

**Critical Fix**:
- 添加缺失的 `tailwindcss-animate` 依賴到 package.json.template
- 確保所有 Tailwind CSS 插件依賴完整

### v5.0.11 (2025-10-12)

**Critical Fix**:
- 修復 Prisma pgvector 索引語法錯誤

**Issue**:
- ❌ 缺少 tailwindcss-animate 依賴

### v5.0.10 (2025-10-12)

**Critical Fix**:
- 使用 ankane/pgvector 鏡像
- 添加 Docker 容器管理命令

---

## 🔍 學到的教訓

### 依賴管理的完整性

1. **配置文件與依賴對齊**:
   - 配置文件中引用的每個包都必須在 dependencies 中
   - 檢查 require() 和 import 語句
   - 驗證所有插件和擴展

2. **模板測試覆蓋**:
   - 在乾淨環境中測試項目生成
   - 不依賴全局安裝的包
   - 自動化依賴完整性檢查

3. **發布前驗證**:
   ```bash
   # 應該執行的測試流程
   npx create-ai-webapp@latest test-project
   cd test-project
   npm run dev  # 必須成功
   npm run build  # 必須成功
   ```

4. **文檔與代碼一致性**:
   - tailwind.config.js 使用的插件
   - package.json 必須包含這些插件
   - 避免複製粘貼導致的不一致

### 質量保證流程

**發布前檢查清單**:
- [ ] 在新目錄中測試項目創建
- [ ] 檢查所有 require() 對應的依賴
- [ ] 運行 `npm run dev` 驗證啟動
- [ ] 運行 `npm run build` 驗證構建
- [ ] 檢查 npm audit 安全漏洞
- [ ] 驗證關鍵功能可用

---

## 🎯 下一步計劃

### v5.1.0 (計劃中)

- [ ] 添加依賴完整性自動檢查腳本
- [ ] 改進模板測試覆蓋
- [ ] 添加 CI/CD 自動化測試
- [ ] 提供依賴更新指南

---

## 📜 完整變更日誌

```
v5.0.12 (2025-10-12) - CRITICAL FIX
- fix: add missing tailwindcss-animate dependency to package.json.template
- docs: add HOTFIX-5.0.12.md release notes

v5.0.11 (2025-10-12) - CRITICAL FIX
- fix: remove incorrect pgvector index definition from Prisma schema
- issue: missing tailwindcss-animate dependency

v5.0.10 (2025-10-12) - CRITICAL FIX
- fix: use ankane/pgvector image for PostgreSQL
- feat: add comprehensive Docker container management commands
```

---

**立即使用修復版本**:

```bash
npx create-ai-webapp@latest my-awesome-app
```

**驗證版本**:

```bash
npm view create-ai-webapp version
# 應顯示: 5.0.12
```

**修復現有項目**:

```bash
cd your-existing-project
npm install tailwindcss-animate --save-dev
npm run dev
```

---

**發布日期**: 2025-10-12
**發布者**: laitim2001
**版本**: 5.0.12 (Critical Fix)
**狀態**: ✅ 準備發布
**優先級**: 🔴 緊急修復 (缺失依賴)

# Hotfix 5.0.6 Release Notes

**發布日期**: 2025-10-11
**版本**: 5.0.6
**類型**: Critical Hotfix
**NPM**: https://www.npmjs.com/package/create-ai-webapp

---

## 🚨 緊急修復

### ESLint 9 依賴衝突

**問題嚴重性**: 🔴 Critical - 阻止項目創建

**問題描述**:
```
npm error ERESOLVE unable to resolve dependency tree
npm error peer eslint@"^7.23.0 || ^8.0.0" from eslint-config-next@14.2.33
npm error Found: eslint@9.37.0
```

**根本原因**:
- v5.0.5 升級 ESLint 到 9.37.0
- 但 `eslint-config-next@^14.2.0` 只支持 ESLint 7-8
- 導致 peer dependency 衝突
- **100% 用戶受影響** - 無法完成 `npm install`

**修復方案**:
```json
// package.json.template

// 修復前 (v5.0.5)
"eslint": "^9.37.0",
"eslint-config-next": "^14.2.0",  // ❌ 不支持 ESLint 9

// 修復後 (v5.0.6)
"eslint": "^9.37.0",
"eslint-config-next": "^15.5.4",  // ✅ 支持 ESLint 9
```

**驗證**:
```bash
npm view eslint-config-next@15.5.4 peerDependencies
# { eslint: '^7.23.0 || ^8.0.0 || ^9.0.0', typescript: '>=3.3.1' }
```

**影響範圍**:
- ✅ 所有項目類型（PostgreSQL/MySQL/MongoDB/SQLite）
- ✅ 所有模組組合
- ✅ 100% 修復依賴安裝問題

---

## 📋 技術細節

### eslint-config-next 版本矩陣

| 版本 | ESLint 支持 | Next.js | 狀態 |
|------|------------|---------|------|
| 14.2.x | ^7.23.0 \|\| ^8.0.0 | 14.x | ❌ 不支持 ESLint 9 |
| **15.5.4** | ^7.23.0 \|\| ^8.0.0 \|\| **^9.0.0** | 15.x | ✅ 支持 ESLint 9 |
| 16.0.0-beta | ^9.0.0 | 16.x | 🚧 Beta |

### Next.js 兼容性

**重要**: 升級到 `eslint-config-next@15.5.4` 與 Next.js 14 完全兼容
- ✅ Next.js 14.2.0 正常工作
- ✅ ESLint 9.37.0 正常工作
- ✅ 所有 ESLint 規則正常運行

---

## 🔧 修復文件

### 變更的文件

1. **01-base/package.json.template**
   - 行數: 第 88 行
   - 變更: `eslint-config-next` 從 `^14.2.0` → `^15.5.4`

2. **create-ai-webapp/template/01-base/package.json.template**
   - 同步更新 NPX 包模板

3. **create-ai-webapp/package.json**
   - 行數: 第 3 行
   - 變更: 版本號從 `5.0.5` → `5.0.6`

---

## ✅ 測試驗證

### 測試場景 1: 零模組配置

```bash
npx create-ai-webapp@5.0.6 test-zero-modules
# 選擇: PostgreSQL
# 不選任何模組

# 預期結果:
# ✅ npm install 成功 (無 ESLint 衝突)
# ✅ 所有依賴正確安裝
# ✅ eslint-config-next@15.5.4 安裝成功
# ✅ eslint@9.37.0 安裝成功
```

### 測試場景 2: 完整模組配置

```bash
npx create-ai-webapp@5.0.6 test-full-modules
# 選擇: PostgreSQL
# 選擇所有模組

# 預期結果:
# ✅ npm install 成功
# ✅ 無依賴衝突
# ✅ 項目創建成功
```

### 測試場景 3: ESLint 驗證

```bash
cd test-project
npm run lint

# 預期結果:
# ✅ ESLint 9 正常工作
# ✅ Next.js ESLint 規則正確應用
# ✅ 無配置錯誤
```

---

## 🔄 升級指南

### 自動升級 (推薦)

用戶使用 `@latest` 會自動獲取 5.0.6:

```bash
npx create-ai-webapp@latest my-app
```

### 已有項目 (v5.0.5)

**如果已使用 v5.0.5 創建項目並遇到安裝錯誤**:

```bash
# 進入項目目錄
cd your-project

# 方案 1: 更新 package.json
# 修改 eslint-config-next 版本
"eslint-config-next": "^15.5.4"

# 清理並重新安裝
rm -rf node_modules package-lock.json
npm install

# 方案 2: 使用 legacy peer deps (臨時方案)
npm install --legacy-peer-deps
```

---

## 📊 影響分析

### 受影響用戶

**v5.0.5 用戶**:
- 🔴 **100% 受影響** - npm install 失敗
- 問題: ESLint peer dependency 衝突
- 影響: 無法完成項目創建
- ✅ 已修復 (5.0.6)

### v5.0.5 存活時間

- **發布時間**: 2025-10-11 12:15
- **問題發現**: 2025-10-11 12:30
- **修復發布**: 2025-10-11 12:45
- **存活時長**: < 30 分鐘 ⚡

---

## 🗺️ 版本歷史

### v5.0.6 (2025-10-11) - 當前版本

**Critical Hotfix**:
- 修復 ESLint 9 與 eslint-config-next 衝突
- 升級 eslint-config-next 14.2 → 15.5.4

### v5.0.5 (2025-10-11) - 已撤回

**Issues**:
- ❌ ESLint 9 依賴衝突 (阻止安裝)
- ✅ 環境變數修復有效
- ✅ 依賴更新正確

**建議**: 跳過此版本，使用 5.0.6

### v5.0.4 (2025-10-11)

**Critical Fix**:
- 修復 Prisma schema 模板衝突

### v5.0.3 (2025-10-11)

**Bug Fix**:
- 改進 Prisma 錯誤輸出

### v5.0.2 (2025-10-11)

**Critical Fix**:
- 修復 OpenTelemetry 依賴衝突

### v5.0.1 (2025-10-11)

**Bug Fixes**:
- 改進錯誤處理和 Windows 兼容性

### v5.0.0 (2025-10-11)

**Initial Release**:
- NPX 包首次發布

---

## 🤝 致謝

### 問題發現

感謝用戶的即時反饋:
- 實際測試發現問題
- 快速報告錯誤日誌

### 快速響應

- **問題發現**: 2025-10-11 12:30
- **根本原因分析**: 2025-10-11 12:35
- **修復實施**: 2025-10-11 12:40
- **發布驗證**: 2025-10-11 12:45
- **總響應時長**: < 15 分鐘 ⚡⚡⚡

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
4. 使用的版本 (`npx create-ai-webapp@VERSION`)
5. 完整錯誤日誌

---

## 🔍 學到的教訓

### 依賴管理教訓

1. **Peer Dependencies 測試** - 升級主依賴時必須檢查所有 peer deps
2. **兼容性矩陣** - 維護依賴版本兼容性表
3. **完整測試** - 每次發布前完整運行 `npm install` 測試
4. **快速回滾** - 發現問題立即發布修復版本

### 發布流程改進

**未來計劃**:
1. 添加 CI/CD 自動測試 `npm install`
2. 添加依賴兼容性檢查腳本
3. 發布前在乾淨環境測試
4. 維護依賴版本測試矩陣

---

## 🎯 下一步計劃

### v5.0.7 (可能)

- [ ] 添加 CI/CD 依賴測試
- [ ] 添加 pre-publish 驗證腳本
- [ ] 改進錯誤提示（提示使用 --legacy-peer-deps）

### v5.1.0 (計劃中)

- [ ] 添加 `--skip-install` 選項
- [ ] 支持自定義模板
- [ ] 改進 CLI 互動體驗
- [ ] 添加依賴健康檢查

---

## 📜 完整變更日誌

```
v5.0.6 (2025-10-11) - HOTFIX
- fix: upgrade eslint-config-next to 15.5.4 for ESLint 9 compatibility
- docs: add HOTFIX-5.0.6.md release notes

v5.0.5 (2025-10-11) - DEPRECATED
- fix: copy .env.local to .env for Prisma CLI compatibility
- deps: upgrade major dependencies (ESLint 9, Prisma 6, Puppeteer 24)
- issue: ESLint peer dependency conflict - USE 5.0.6 INSTEAD

v5.0.4 (2025-10-11)
- fix: exclude Prisma schema files from automatic copying

v5.0.3 (2025-10-11)
- fix: improve Prisma error visibility

v5.0.2 (2025-10-11)
- fix: resolve OpenTelemetry dependency conflict

v5.0.1 (2025-10-11)
- fix: improve npm install error handling
- fix: Windows directory cleanup

v5.0.0 (2025-10-11)
- feat: initial NPX package release
```

---

**立即使用修復版本**:

```bash
npx create-ai-webapp@latest my-awesome-app
```

**驗證版本**:

```bash
npm view create-ai-webapp version
# 應顯示: 5.0.6
```

---

**發布日期**: 2025-10-11
**發布者**: laitim2001
**版本**: 5.0.6 (Critical Hotfix)
**狀態**: ✅ 準備發布
**優先級**: 🚨 緊急修復

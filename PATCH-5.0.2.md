# Patch 5.0.2 Release Notes

**發布日期**: 2025-10-11
**版本**: 5.0.2
**類型**: Critical Bug Fix
**NPM**: https://www.npmjs.com/package/create-ai-webapp

---

## 🚨 關鍵修復

### OpenTelemetry 依賴版本衝突

**問題嚴重性**: 🔴 Critical - 阻止項目初始化

**問題描述**:
```
npm error ERESOLVE unable to resolve dependency tree
npm error peer @opentelemetry/api@">=1.3.0 <1.8.0" from @opentelemetry/sdk-node@0.48.0
npm error Found: @opentelemetry/api@1.9.0
```

**根本原因**:
- `package.json.template` 中指定 `@opentelemetry/api@^1.8.0`
- NPM 安裝了 1.9.0 版本
- `@opentelemetry/sdk-node@0.48.0` 要求 `<1.8.0`
- 導致依賴衝突，npm install 失敗

**修復方案**:
```json
// 修復前
"@opentelemetry/api": "^1.8.0"

// 修復後
"@opentelemetry/api": "^1.7.0"
```

**影響範圍**:
- ✅ 所有使用監控模組的新項目
- ✅ 選擇 OpenTelemetry 的項目配置
- ✅ 100% 修復依賴安裝問題

---

## 📋 技術細節

### 依賴版本兼容性

**OpenTelemetry 版本矩陣**:

| 包名 | 版本要求 | 修復後版本 |
|------|----------|-----------|
| @opentelemetry/api | ~~^1.8.0~~ → **^1.7.0** | 1.7.x |
| @opentelemetry/sdk-node | ^0.48.0 | 0.48.x |
| @opentelemetry/resources | ^1.21.0 | 1.21.x |
| @opentelemetry/semantic-conventions | ^1.21.0 | 1.21.x |

**兼容性驗證**:
- ✅ `@opentelemetry/api@1.7.0` 與 `sdk-node@0.48.0` 兼容
- ✅ 所有 instrumentation 包正常工作
- ✅ Prometheus exporter 正常
- ✅ OTLP exporters 正常

---

## 🔧 修復文件

### 變更的文件

1. **01-base/package.json.template**
   - 修改: `@opentelemetry/api` 從 `^1.8.0` → `^1.7.0`
   - 行數: 第 69 行

2. **create-ai-webapp/template/01-base/package.json.template**
   - 同步更新 NPX 包模板
   - 確保新創建的項目使用正確版本

---

## ✅ 測試驗證

### 測試場景

**場景 1: 零模組配置**
```bash
npx create-ai-webapp@5.0.2 test-zero-modules
# 選擇: PostgreSQL
# 模組: 不選任何模組
# 結果: ✅ npm install 成功
```

**場景 2: 包含監控模組**
```bash
npx create-ai-webapp@5.0.2 test-with-monitoring
# 選擇: PostgreSQL
# 模組: 選擇 "監控系統"
# 結果: ✅ npm install 成功, OpenTelemetry 正常工作
```

**場景 3: 完整模組配置**
```bash
npx create-ai-webapp@5.0.2 test-full-config
# 選擇: PostgreSQL
# 模組: 選擇所有 22 個模組
# 結果: ✅ npm install 成功, 所有依賴正確安裝
```

---

## 🔄 升級指南

### 自動升級 (推薦)

用戶使用 `@latest` 會自動獲取 5.0.2:

```bash
npx create-ai-webapp@latest my-app
```

### 已有項目修復

如果用戶已經遇到此問題:

```bash
# 1. 進入項目目錄
cd your-project

# 2. 修改 package.json
# 將 "@opentelemetry/api": "^1.8.0" 改為 "^1.7.0"

# 3. 清理並重新安裝
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 影響分析

### 受影響用戶

**v5.0.0 用戶**:
- ✅ 已修復 (5.0.2)
- 問題: npm install 失敗
- 影響: 無法完成項目初始化

**v5.0.1 用戶**:
- ✅ 已修復 (5.0.2)
- 問題: 同樣的依賴衝突
- 影響: 無法完成項目初始化

### 未受影響場景

- ❌ 不選擇監控模組的項目 (OpenTelemetry 不會安裝)
- ❌ 使用舊版本創建的已有項目

---

## 🗺️ 版本歷史

### v5.0.2 (2025-10-11) - 當前版本

**Critical Fix**:
- 修復 OpenTelemetry 依賴衝突 (api@1.7.0)

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
- 內部測試團隊
- 早期採用者反饋

### 快速響應

- **發現時間**: 2025-10-11 10:30
- **修復時間**: 2025-10-11 10:45
- **發布時間**: 2025-10-11 10:50
- **響應時長**: < 20 分鐘 ⚡

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
4. 完整錯誤日誌
5. 選擇的配置選項

---

## 🔍 學到的教訓

### 依賴管理

1. **使用精確版本範圍** - `^1.7.0` 而不是 `^1.8.0`
2. **測試 peer dependencies** - 驗證所有依賴兼容性
3. **監控 NPM 警告** - 注意依賴解析警告
4. **自動化測試** - 在多種配置下測試安裝

### 發布流程

1. **完整測試** - 所有模組組合都要測試
2. **快速響應** - 關鍵問題立即修復
3. **清晰溝通** - 詳細的發布說明
4. **版本控制** - 正確使用語義化版本

---

## 🎯 下一步計劃

### v5.0.3 (可能)

- [ ] 清理 package.json NPM 警告
- [ ] 添加依賴版本驗證測試
- [ ] 改進錯誤提示信息

### v5.1.0 (計劃中)

- [ ] 添加 `--skip-install` 選項
- [ ] 支持自定義模板
- [ ] 改進 CLI 互動體驗
- [ ] 添加依賴健康檢查

---

## 📜 完整變更日誌

```
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
# 應顯示: 5.0.2
```

---

**發布日期**: 2025-10-11
**發布者**: laitim2001
**版本**: 5.0.2 (Critical Fix)
**狀態**: ✅ 已發布並驗證

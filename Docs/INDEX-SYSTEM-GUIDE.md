# 索引系統指南
# Index System Guide

**版本**: 1.0
**創建日期**: 2025-10-10
**狀態**: 雙索引系統（人類可讀 + 機器可讀）

---

## 📋 概述

AI Web App Template 使用雙索引系統，平衡人類可讀性和機器解析效率：

1. **人類可讀索引**: `TEMPLATE-INDEX.md` - 描述性表格格式，豐富的上下文信息
2. **機器可讀索引**: `.template-files.json` - JSON 格式，精確的文件列表和元數據

---

## 🎯 雙索引系統設計理念

### 為什麼需要兩種索引？

| 需求 | 人類可讀索引 | 機器可讀索引 |
|------|-------------|-------------|
| **閱讀理解** | ✅ 優秀 | ❌ 困難 |
| **上下文信息** | ✅ 豐富 | ⚠️ 有限 |
| **維護更新** | ⚠️ 手動 | ✅ 自動 |
| **解析準確性** | ⚠️ 35% | ✅ 99% |
| **查詢效率** | ❌ 慢 | ✅ 快 |
| **自動化支持** | ❌ 差 | ✅ 優秀 |

### 設計決策

1. **TEMPLATE-INDEX.md 保持現有格式**
   - 優先考慮信息豐富度和可讀性
   - 適合開發者瀏覽、理解項目結構
   - 包含文件用途、重要性、統計信息

2. **添加 .template-files.json 作為補充**
   - 100% 準確的文件列表
   - 支持自動化工具和腳本
   - 自動生成，無需手動維護

---

## 📄 文件說明

### 1. TEMPLATE-INDEX.md（人類可讀索引）

**位置**: 根目錄
**格式**: Markdown（描述性表格）
**維護**: 手動更新
**用途**:
- 開發者閱讀理解項目結構
- 查找文件的功能描述和用途
- 了解模組的完成度和統計信息

**示例格式**:
```markdown
| 文件 | 大小 | 用途 | 重要性 |
|------|------|------|--------|
| **init-project.js** | ~800行 | 🔧 CLI初始化工具 | ⭐⭐⭐ |
```

**優點**:
- ✅ 包含豐富的上下文信息
- ✅ 易於人類閱讀和理解
- ✅ 提供文件用途說明

**限制**:
- ⚠️ 機器解析準確度低（~35%）
- ⚠️ 需要手動維護
- ⚠️ 描述性文字難以精確匹配

---

### 2. .template-files.json（機器可讀索引）

**位置**: 根目錄（gitignore，不提交）
**格式**: JSON
**維護**: 自動生成
**用途**:
- 自動化工具和腳本解析
- 索引同步檢查
- 精確的文件列表查詢

**結構**:
```json
{
  "version": "1.0",
  "generated": "2025-10-10T12:00:00Z",
  "description": "機器可讀的模板文件索引",
  "files": [
    {
      "path": "01-base/lib/errors.ts.template",
      "type": "template",
      "module": "base",
      "stats": {
        "size": 8192,
        "lines": 300,
        "modified": "2025-10-10T10:00:00Z"
      }
    }
  ],
  "stats": {
    "totalFiles": 343,
    "byType": {...},
    "byModule": {...},
    "totalLines": 144712,
    "totalSize": 3690000
  }
}
```

**優點**:
- ✅ 100% 準確的文件列表
- ✅ 自動生成，零維護成本
- ✅ 支持高效查詢和過濾
- ✅ 包含文件統計元數據

**限制**:
- ⚠️ 缺少文件用途的詳細描述
- ⚠️ 不適合人類直接閱讀

---

## 🔧 使用指南

### 生成機器可讀索引

```bash
# 自動掃描項目並生成 .template-files.json
node scripts/generate-machine-index.js
```

**何時生成**:
- 新增/刪除文件後
- 模組更新後
- 運行 `check-index-sync.js` 發現不同步時
- 發布新版本前

**輸出信息**:
- 文件總數
- 按類型/模組統計
- 代碼總行數
- 索引文件大小

---

### 檢查索引同步狀態

```bash
# 自動使用機器可讀索引（如果存在）
node scripts/check-index-sync.js
```

**檢查內容**:
1. 索引健康度（實際文件 vs 索引文件）
2. 核心文件完整性
3. 遺漏索引的文件
4. 幽靈條目（索引存在但文件不存在）
5. 目錄覆蓋率

**健康度標準**:
- **優秀**: ≥95%，核心文件100%，無幽靈條目
- **良好**: ≥90%，核心文件100%
- **需要改進**: ≥80%
- **需要立即處理**: <80%

---

### 查詢機器可讀索引

需要安裝 `jq` 工具（JSON 處理器）。

**查看所有文件**:
```bash
jq '.files[]' .template-files.json
```

**按模組查詢**:
```bash
# 查詢認證模組的所有文件
jq '.files[] | select(.module=="auth")' .template-files.json

# 查詢基礎模板層文件
jq '.files[] | select(.module=="base")' .template-files.json
```

**按類型查詢**:
```bash
# 查詢所有文檔文件
jq '.files[] | select(.type=="documentation")' .template-files.json

# 查詢所有模板文件
jq '.files[] | select(.type=="template")' .template-files.json

# 查詢所有測試文件
jq '.files[] | select(.type=="test")' .template-files.json
```

**統計信息**:
```bash
# 查看整體統計
jq '.stats' .template-files.json

# 查看按類型統計
jq '.stats.byType' .template-files.json

# 查看按模組統計
jq '.stats.byModule' .template-files.json
```

**組合查詢**:
```bash
# 查詢認證模組的模板文件
jq '.files[] | select(.module=="auth" and .type=="template")' .template-files.json

# 查詢大於500行的文件
jq '.files[] | select(.stats.lines > 500)' .template-files.json

# 統計每個模組的文件數
jq '.files | group_by(.module) | map({module: .[0].module, count: length})' .template-files.json
```

---

## 📝 維護工作流

### 標準維護流程

```bash
# 1. 開發：新增/修改文件
git add .

# 2. 更新機器索引
node scripts/generate-machine-index.js

# 3. 檢查同步狀態
node scripts/check-index-sync.js

# 4. （可選）手動更新 TEMPLATE-INDEX.md
#    僅在新增重要模組或文件時更新

# 5. 提交變更
git add TEMPLATE-INDEX.md  # 如果有更新
git commit -m "feat: add new module"
```

### 發布前檢查

```bash
# 1. 重新生成機器索引
node scripts/generate-machine-index.js

# 2. 檢查索引健康度
node scripts/check-index-sync.js

# 3. 確保健康度 ≥95%
# 4. 更新 TEMPLATE-INDEX.md 的版本和更新歷史
# 5. 提交並發布
```

---

## 🎯 最佳實踐

### 1. TEMPLATE-INDEX.md 維護

**何時更新**:
- ✅ 新增模組時
- ✅ 重要文件用途變更時
- ✅ Phase 完成時更新統計信息
- ❌ 不需要每次文件變更都更新

**更新內容**:
- 新模組的描述和統計
- Phase 完成度更新
- 版本號和更新歷史
- 重要文件的用途說明

**保持簡潔**:
- 不需要列出所有文件
- 重點記錄重要文件和模組
- 使用統計數字而非詳細列表

---

### 2. 機器可讀索引使用

**自動化場景**:
```bash
# CI/CD 管道中檢查
node scripts/generate-machine-index.js
node scripts/check-index-sync.js
if [ $? -ne 0 ]; then
  echo "索引健康度不足，請更新"
  exit 1
fi
```

**文件查找**:
```bash
# 查找特定文件
jq -r '.files[].path | select(contains("errors.ts"))' .template-files.json

# 列出所有測試文件
jq -r '.files[] | select(.type=="test") | .path' .template-files.json
```

**統計報告**:
```bash
# 生成模組大小報告
jq '.files | group_by(.module) | map({
  module: .[0].module,
  files: length,
  lines: ([.[].stats.lines] | add)
})' .template-files.json
```

---

### 3. 索引一致性檢查

**定期檢查**（建議頻率）:
- 每次新增文件後
- 每天開發結束前
- 每週一次完整檢查
- 發布前必須檢查

**檢查命令**:
```bash
# 快速檢查
node scripts/check-index-sync.js

# 詳細檢查（保存日誌）
node scripts/check-index-sync.js > index-check.log 2>&1
```

---

## 🔄 工作流整合

### Git Hooks 整合（可選）

**pre-commit hook**（自動檢查）:
```bash
#!/bin/bash
# .git/hooks/pre-commit

echo "檢查索引同步狀態..."
node scripts/generate-machine-index.js > /dev/null 2>&1
node scripts/check-index-sync.js

if [ $? -ne 0 ]; then
  echo "⚠️  索引健康度不足，建議更新後再提交"
  echo "繼續提交請使用: git commit --no-verify"
  exit 1
fi

echo "✅ 索引健康度良好"
```

### npm scripts 整合

在 `package.json` 中添加：
```json
{
  "scripts": {
    "index:generate": "node scripts/generate-machine-index.js",
    "index:check": "node scripts/check-index-sync.js",
    "index:update": "npm run index:generate && npm run index:check"
  }
}
```

使用：
```bash
npm run index:generate  # 生成索引
npm run index:check     # 檢查索引
npm run index:update    # 生成並檢查
```

---

## 📊 索引統計參考

### 當前項目統計（v5.0）

```json
{
  "totalFiles": 343,
  "totalLines": 144712,
  "totalSize": "3.52 MB",
  "byType": {
    "template": 197,
    "documentation": 104,
    "code": 5,
    "schema": 5,
    "test": 32
  },
  "byModule": {
    "base": 80,
    "docs": 41,
    "auth": 18,
    "api-gateway": 15,
    "security": 14,
    "(其他模組)": 175
  }
}
```

### 索引健康度歷史

| 日期 | 版本 | 健康度 | 說明 |
|------|------|--------|------|
| 2025-10-05 | v4.0 | ~30% | 僅 Markdown 索引 |
| 2025-10-10 | v5.0 | **99.1%** | 雙索引系統 |

---

## 🐛 常見問題

### Q1: 為什麼機器索引不提交到 Git？

**A**: 機器索引是自動生成的，每個開發者本地生成即可，不需要共享。好處：
- 減少 Git 衝突
- 保持倉庫大小
- 每個環境生成最準確的索引

### Q2: 如果機器索引不存在會怎樣？

**A**: `check-index-sync.js` 會自動回退到解析 Markdown 索引，但準確度較低（~35%）。建議運行一次 `node scripts/generate-machine-index.js`。

### Q3: TEMPLATE-INDEX.md 需要經常更新嗎？

**A**: 不需要。TEMPLATE-INDEX.md 是給人類閱讀的高層次概覽，只在以下情況更新：
- 新增模組
- Phase 完成
- 重要文件用途變更
- 發布新版本

### Q4: 如何處理索引健康度警告？

**A**: 根據警告類型處理：
- **遺漏索引**: 運行 `node scripts/generate-machine-index.js`
- **幽靈條目**: 文件已刪除但索引未更新，重新生成索引
- **核心文件缺失**: 檢查核心文件是否存在

### Q5: 機器索引多久生成一次？

**A**: 建議時機：
- 新增/刪除文件後
- 每天開發結束前
- 發布前必須生成

---

## 📚 相關文檔

- [TEMPLATE-INDEX.md](../TEMPLATE-INDEX.md) - 人類可讀索引
- [INDEX-MAINTENANCE-GUIDE.md](../INDEX-MAINTENANCE-GUIDE.md) - 索引維護詳細指南
- [PROJECT-INDEX.md](../PROJECT-INDEX.md) - 高層次項目導航

---

## 🔮 未來改進

### 計劃功能

1. **自動化維護**
   - Git hooks 自動生成索引
   - CI/CD 管道檢查
   - Pre-commit 健康度檢查

2. **增強查詢**
   - Web UI 索引查詢界面
   - 依賴關係圖生成
   - 文件變更歷史追蹤

3. **智能分析**
   - 模組複雜度分析
   - 代碼質量指標
   - 測試覆蓋率整合

---

**文檔版本**: 1.0
**創建日期**: 2025-10-10
**維護者**: Claude Code
**狀態**: 雙索引系統已實現，健康度 99.1% ✅

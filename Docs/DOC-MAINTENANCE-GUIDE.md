# 📚 文檔維護指南
# Documentation Maintenance Guide

**版本**: v1.0
**最後更新**: 2025-10-13

---

## 🎯 目的

本指南說明如何維護 AI Web App Template 項目的文檔系統，確保文檔始終保持最新、準確和易於查找。

---

## 📖 文檔系統架構

### 文檔入口

**[DOCUMENTATION-MAP.md](../DOCUMENTATION-MAP.md)** 是整個項目文檔的導航中心：

```
項目根目錄
│
├── DOCUMENTATION-MAP.md ⭐ ← 文檔導航入口
│   ├── 🎯 核心文檔 (必讀) - 11個
│   ├── 📖 參考文檔 (按需查閱) - 12個
│   └── 🗄️ 歷史文檔 (僅供參考) - 已歸檔
│
├── README.md - 項目主文檔
├── CHANGELOG.md - 版本變更記錄
├── CLAUDE.md - AI 助手指南
│
├── Docs/ - 項目文檔目錄
│   ├── PROJECT-STATUS.md ⭐ 當前狀態
│   ├── DATABASE-SWITCHING-GUIDE.md
│   ├── archive/ - 歷史文檔歸檔
│   │   ├── old-status/ - 已過時的狀態文檔
│   │   ├── dev-tracking/ - 開發追蹤記錄
│   │   └── extraction-plans/ - 已完成的提取計劃
│   └── ...
│
├── 01-base/docs/ - 基礎模板文檔
├── 02-modules/ - 模組文檔 (22個模組)
└── create-ai-webapp/ - NPM 包文檔
```

### 文檔分類

| 類型 | 位置 | 用途 | 更新頻率 |
|------|------|------|---------|
| **核心文檔** | 根目錄 + Docs/ | 日常必讀 | 每次版本發布 |
| **參考文檔** | Docs/ | 按需查閱 | 重大更新時 |
| **模組文檔** | 02-modules/*/README.md | 模組說明 | 模組變更時 |
| **歷史文檔** | Docs/archive/ | 僅供參考 | 不再更新 |

---

## 🔧 自動化文檔審查系統

### 1. 手動執行檢查

使用 `check-docs-health.js` 腳本：

```bash
# 執行完整的文檔健康檢查
node scripts/check-docs-health.js

# 檢查結果會生成報告：
# Docs/doc-health-report-YYYY-MM-DD.md
```

**檢查項目**:
- ✅ 核心文檔是否存在
- ⏰ 過時文檔檢測（超過90天未更新）
- 🔗 斷裂的內部鏈接
- 🔍 重複文檔檢測
- 🗺️  DOCUMENTATION-MAP.md 完整性

### 2. 自動化檢查 (GitHub Actions)

已配置 GitHub Actions 工作流程 (`.github/workflows/docs-health-check.yml`)：

**觸發條件**:
- 🕒 **每週一早上 9:00** 自動執行
- 📝 **PR 涉及文檔變更**時執行
- 🚀 **Push 到 main** 且涉及文檔時執行
- 🖱️  **手動觸發** (GitHub Actions 頁面)

**自動行動**:
- 生成健康報告並上傳為 Artifact
- 在 PR 中自動評論報告摘要
- 健康度 < 70% 時自動創建 Issue 提醒

### 3. 查看報告

**方式一：本地查看**
```bash
# 最新報告
cat Docs/doc-health-report-*.md | less
```

**方式二：GitHub Actions**
1. 進入 GitHub repository
2. 點擊 **Actions** 標籤
3. 選擇 **Documentation Health Check** workflow
4. 下載 **doc-health-report** artifact

---

## 📋 文檔維護流程

### 日常維護 (每週)

**責任人**: 項目維護者

```bash
# 1. 執行健康檢查
node scripts/check-docs-health.js

# 2. 查看報告
cat Docs/doc-health-report-$(date +%Y-%m-%d).md

# 3. 處理問題
#    - 修復斷裂的鏈接
#    - 更新過時的文檔
#    - 刪除重複的文檔
```

### 版本發布時 (每次發布)

**必須更新的文檔**:

```bash
# 1. 更新版本相關文檔
vim CHANGELOG.md           # 記錄版本變更
vim Docs/PROJECT-STATUS.md # 更新項目狀態
vim README.md              # 更新版本號和特性

# 2. 如果涉及 NPM 發布
cd create-ai-webapp
npm version patch          # 或 minor/major
npm publish
cd ..
vim NPM-PUBLISH-SUCCESS.md # 更新發布記錄

# 3. 驗證核心文檔
node scripts/check-docs-health.js

# 4. 確認 DOCUMENTATION-MAP.md 同步
vim DOCUMENTATION-MAP.md
```

### 文檔歸檔 (按需)

**何時歸檔**:
- 文檔內容已過時且不再需要
- 開發追蹤文檔（階段完成後）
- 已完成的計劃文檔
- 重複或被替代的文檔

**歸檔步驟**:

```bash
# 1. 移動到對應的歸檔目錄
mv Docs/OLD-DOC.md Docs/archive/old-status/

# 2. 更新 DOCUMENTATION-MAP.md 中的鏈接
vim DOCUMENTATION-MAP.md

# 3. 添加歸檔說明（在被移動的文檔位置）
# 可選：創建一個小的 redirect 文檔
echo "此文檔已歸檔到 Docs/archive/old-status/OLD-DOC.md" > Docs/OLD-DOC.md
```

### 新增文檔時

**清單**:

```bash
# 1. 確定文檔類型和位置
#    - 核心文檔 → 根目錄或 Docs/
#    - 參考文檔 → Docs/
#    - 模組文檔 → 02-modules/module-name/
#    - 歷史文檔 → Docs/archive/

# 2. 創建文檔，包含標準頭部
cat > Docs/NEW-DOC.md <<'EOF'
# 文檔標題

**版本**: v1.0
**最後更新**: YYYY-MM-DD
**狀態**: ✅ 當前 / 🗄️ 歸檔 / ⚠️ 草稿

---

[文檔內容...]
EOF

# 3. 更新 DOCUMENTATION-MAP.md
vim DOCUMENTATION-MAP.md
# 在適當的分類中添加新文檔的鏈接

# 4. 執行健康檢查，確保鏈接有效
node scripts/check-docs-health.js
```

---

## 🎨 文檔寫作規範

### 標準文件頭

每個文檔應該包含：

```markdown
# 文檔標題
# Document Title (英文)

**版本**: v1.0
**最後更新**: 2025-10-13
**狀態**: ✅ 當前 / 🗄️ 歸檔 / ⚠️ 草稿
**標籤**: #核心文檔 #參考文檔 #模組文檔

---
```

### 內部鏈接格式

使用相對路徑：

```markdown
✅ 正確：[PROJECT-STATUS.md](Docs/PROJECT-STATUS.md)
✅ 正確：[README.md](../README.md)

❌ 錯誤：[PROJECT-STATUS.md](/Docs/PROJECT-STATUS.md)  # 絕對路徑
❌ 錯誤：[PROJECT-STATUS.md](https://github.com/.../PROJECT-STATUS.md)  # URL
```

### 章節標題規範

使用清晰的層級結構：

```markdown
# H1 - 文檔標題 (只用一次)

## H2 - 主要章節

### H3 - 小節

#### H4 - 子小節

**粗體** - 強調重點
*斜體* - 次要強調
```

### 表情符號使用

統一使用以下表情符號：

| 符號 | 用途 | 示例 |
|------|------|------|
| ✅ | 已完成、正確 | ✅ 完成 |
| ❌ | 錯誤、缺失 | ❌ 缺失 |
| ⚠️ | 警告、注意 | ⚠️ 注意 |
| 🔴 | P0 高優先級 | 🔴 關鍵 |
| 🟡 | P1 中優先級 | 🟡 重要 |
| 🟢 | P2 低優先級 | 🟢 次要 |
| 📝 | 文檔相關 | 📝 文檔 |
| 🔧 | 配置相關 | 🔧 配置 |
| 🎨 | UI/設計相關 | 🎨 設計 |
| 📦 | 模組/套件 | 📦 模組 |
| 🚀 | 發布/部署 | 🚀 發布 |

---

## 🔍 常見問題

### Q1: 如何確定文檔是否應該歸檔？

**判斷標準**:
- ✅ 內容已過時（如舊版本狀態文檔）
- ✅ 計劃已完成（如提取計劃文檔）
- ✅ 被新文檔替代（如 CURRENT-STATUS.md → PROJECT-STATUS.md）
- ✅ 超過90天未更新且無人查閱

**不應歸檔**:
- ❌ 參考文檔（如源項目分析、設計文檔）
- ❌ 經常被引用的歷史記錄
- ❌ 模組 README（屬於功能文檔）

### Q2: 健康檢查報告顯示斷裂鏈接怎麼辦？

**處理步驟**:

```bash
# 1. 查看報告中的斷裂鏈接
cat Docs/doc-health-report-*.md | grep "斷裂的鏈接" -A 20

# 2. 確認目標文件是否存在
ls -la [目標路徑]

# 3. 修復方式：
#    a) 文件被移動 → 更新鏈接到新位置
#    b) 文件被刪除 → 移除鏈接或更新到替代文檔
#    c) 路徑錯誤 → 修正相對路徑

# 4. 重新檢查
node scripts/check-docs-health.js
```

### Q3: 如何手動觸發 GitHub Actions 檢查？

**步驟**:
1. 進入 GitHub repository
2. 點擊 **Actions** 標籤
3. 選擇左側 **Documentation Health Check** workflow
4. 點擊右上角 **Run workflow** 按鈕
5. 選擇 branch (通常是 main)
6. 點擊綠色 **Run workflow** 按鈕

### Q4: DOCUMENTATION-MAP.md 與實際文件不同步怎麼辦？

**解決方法**:

```bash
# 1. 執行健康檢查
node scripts/check-docs-health.js

# 2. 查看 DOCUMENTATION-MAP 檢查部分
cat Docs/doc-health-report-*.md | grep "DOCUMENTATION-MAP" -A 10

# 3. 手動更新 DOCUMENTATION-MAP.md
vim DOCUMENTATION-MAP.md

# 4. 驗證修復
node scripts/check-docs-health.js
```

---

## 📊 健康度評分說明

### 評分組成

**整體健康度** = (核心文檔完整性 + 鏈接有效性 + 文檔新鮮度) / 3

| 評分 | 等級 | 說明 | 行動 |
|------|------|------|------|
| 90%+ | 🟢 優秀 | 文檔系統健康 | 保持現狀 |
| 70-89% | 🟡 良好 | 有改進空間 | 按計劃優化 |
| < 70% | 🔴 需改進 | 存在嚴重問題 | 立即處理 |

### 各項指標說明

**1. 核心文檔完整性**
- 檢查 5 個核心文檔是否存在
- 缺失任何一個都會顯著影響評分

**2. 鏈接有效性**
- 掃描所有 Markdown 文檔中的內部鏈接
- 計算有效鏈接占比

**3. 文檔新鮮度**
- 檢查文檔最後更新時間
- 超過90天未更新的文檔視為過時

---

## 🛠️ 腳本配置

### check-docs-health.js 配置選項

編輯 `scripts/check-docs-health.js` 修改配置：

```javascript
const CONFIG = {
  // 文檔根目錄
  docsRoots: [
    'Docs',
    '01-base/docs',
    '02-modules',
    'create-ai-webapp'
  ],

  // 過時閾值（天數）
  staleDays: 90,  // 可修改為 60、120 等

  // 排除的目錄
  excludeDirs: [
    'node_modules',
    '.git',
    'Docs/archive',     // 歸檔目錄不檢查
    'test-projects',
    'examples'
  ],

  // 核心文檔（必須存在）
  criticalDocs: [
    'README.md',
    'CHANGELOG.md',
    'DOCUMENTATION-MAP.md',
    'Docs/PROJECT-STATUS.md',
    'CLAUDE.md'
  ]
};
```

### GitHub Actions 配置

編輯 `.github/workflows/docs-health-check.yml` 修改：

```yaml
# 修改執行頻率
schedule:
  - cron: '0 9 * * 1'  # 每週一 9:00
  # - cron: '0 9 * * *'  # 每天 9:00
  # - cron: '0 9 1 * *'  # 每月1日 9:00
```

---

## 📅 維護時間表

### 每週 (自動)

- ✅ GitHub Actions 自動執行健康檢查
- ✅ 生成報告並上傳

### 每週 (手動，15分鐘)

- 查看健康報告
- 修復斷裂的鏈接（如有）
- 更新過時的文檔（如有）

### 每月 (手動，30分鐘)

- 歸檔過時文檔
- 刪除重複文檔
- 更新 DOCUMENTATION-MAP.md

### 每次版本發布 (手動，30分鐘)

- 更新 CHANGELOG.md
- 更新 PROJECT-STATUS.md
- 更新 README.md
- 驗證所有核心文檔

---

## 🔗 相關資源

### 文檔系統
- [DOCUMENTATION-MAP.md](../DOCUMENTATION-MAP.md) - 文檔導航地圖
- [PROJECT-STATUS.md](PROJECT-STATUS.md) - 項目當前狀態
- [check-docs-health.js](../scripts/check-docs-health.js) - 健康檢查腳本
- [GitHub Actions Workflow](../.github/workflows/docs-health-check.yml) - 自動化配置

### NPM 發布相關
- [NPM-PUBLISH-SUCCESS.md](../NPM-PUBLISH-SUCCESS.md) - NPM 發布記錄與統計
- [NPX-IMPLEMENTATION-REPORT.md](../NPX-IMPLEMENTATION-REPORT.md) - NPX 實施完整報告
- [create-ai-webapp/PUBLISH-CHECKLIST.md](../create-ai-webapp/PUBLISH-CHECKLIST.md) - NPM 發布檢查清單

---

## 📝 更新記錄

| 版本 | 日期 | 變更說明 |
|------|------|---------|
| v1.0 | 2025-10-13 | 初始版本，創建完整的文檔維護指南 |

---

*本指南由 Claude Code 創建，維護者：AI Web App Template 團隊*

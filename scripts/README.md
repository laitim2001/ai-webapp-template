# 📜 腳本工具說明

這個目錄包含模板項目的工具腳本。

---

## 🔍 check-index-sync.js

**用途**: 檢查項目索引文件的同步狀態

**功能**:
- ✅ 掃描項目中的所有重要文件
- ✅ 檢查這些文件是否在索引中（TEMPLATE-INDEX.md, PROJECT-INDEX.md）
- ✅ 檢測遺漏的文件（應該索引但未索引）
- ✅ 檢測幽靈條目（索引中存在但文件不存在）
- ✅ 生成詳細的健康度報告

### 使用方法

#### 方法 1: 直接執行

```bash
node scripts/check-index-sync.js
```

#### 方法 2: 添加 npm script (推薦)

在你的項目 package.json 中添加：

```json
{
  "scripts": {
    "check:index": "node scripts/check-index-sync.js"
  }
}
```

然後執行：

```bash
npm run check:index
```

### 輸出示例

```
🔍 開始索引同步檢查...

📂 掃描項目文件...
   找到 150 個重要文件

📋 讀取索引文件...
   TEMPLATE-INDEX.md: 145 個條目
   PROJECT-INDEX.md: 85 個條目
   TEMPLATE-DEVELOPMENT-GUIDE.md: 30 個條目
   合併後: 148 個唯一條目

🔍 檢查核心文件...

======================================================================
📊 索引同步檢查報告
   Index Synchronization Check Report
======================================================================

📈 整體統計:
   實際文件總數: 150
   索引文件數: 148
   索引健康度: 98.7%

✅ 核心文件檢查: 全部已索引 (100%)

⚠️  遺漏索引: 2 個文件未索引

   📁 02-modules/
      ✗ module-email/README.md
      ✗ module-email/config.ts

✅ 索引準確性: 無幽靈條目

📊 目錄覆蓋率:

   01-base              ████████████████████ 100.0% (45/45)
   02-modules           ███████████████████░ 97.1% (34/35)
   00-monitoring        ████████████████████ 100.0% (17/17)
   Docs                 ████████████████░░░░ 85.0% (34/40)
   examples             ██████████████░░░░░░ 75.0% (9/12)
   scripts              ████████████████████ 100.0% (1/1)

======================================================================
✅ 索引狀態: 良好 (健康度 ≥90%, 核心文件100%)
======================================================================

💡 建議操作:

   🟡 優先級2: 更新 TEMPLATE-INDEX.md 添加遺漏文件
      參考: INDEX-MAINTENANCE-GUIDE.md 第5節「新增文件維護」

   詳細指南: 參考 INDEX-MAINTENANCE-GUIDE.md

✅ 退出碼: 0 (索引狀態良好)
```

### 退出碼

- **0**: 索引狀態良好（健康度 ≥80%，核心文件100%，遺漏 ≤10個）
- **1**: 需要改進或發現嚴重問題

### 配置

腳本會掃描以下目錄：
- `01-base/` - 基礎模板層
- `02-modules/` - 功能模組庫
- `00-monitoring/` - 監控系統
- `Docs/` - 技術文檔
- `examples/` - 示例數據
- `scripts/` - 工具腳本

支持的文件類型：
- `.md` - Markdown 文檔
- `.js` - JavaScript 文件
- `.ts`, `.tsx` - TypeScript 文件
- `.prisma` - Prisma Schema
- `.template` - 模板文件

核心文件（必須100%索引）：
- README.md
- CHANGELOG.md
- CLAUDE.md
- init-project.js
- TEMPLATE-DEVELOPMENT-GUIDE.md
- TEMPLATE-INDEX.md
- PROJECT-INDEX.md
- INDEX-MAINTENANCE-GUIDE.md

### 排除的目錄

以下目錄會被自動排除：
- `node_modules/`
- `.next/`
- `.git/`
- `dist/`
- `build/`
- `test-projects/`

### 維護建議

**每次開發任務後執行**:
```bash
# 創建新文件後
git add .
npm run check:index  # 檢查是否遺漏索引
# 如有遺漏，更新 TEMPLATE-INDEX.md
git add TEMPLATE-INDEX.md
git commit -m "feat: 新增功能並更新索引"
```

**定期執行（建議每週一次）**:
```bash
npm run check:index
```

詳細維護指南請參考：**INDEX-MAINTENANCE-GUIDE.md**

---

## 🚀 未來腳本

計劃添加的其他工具腳本：

- `validate-template-files.js` - 驗證 .template 文件的佔位符
- `test-init-workflow.js` - 測試 init-project.js 初始化流程
- `generate-module-list.js` - 自動生成模組清單
- `check-broken-links.js` - 檢查文檔中的斷開鏈接

---

**維護**: 模板開發團隊
**最後更新**: 2025-10-09

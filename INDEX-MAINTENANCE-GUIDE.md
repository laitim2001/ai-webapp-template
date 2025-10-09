# 📋 索引維護指南

> **目的**: 確保模板項目索引文件在開發過程中保持同步更新
> **重要性**: 防止 AI 助手和用戶因過期索引而找不到正確文件

---

## 🎯 模板項目索引架構

### 三層索引體系

```
📁 索引層級結構
├── TEMPLATE-DEVELOPMENT-GUIDE.md  # L1: AI助手快速參考（統一入口）
├── TEMPLATE-INDEX.md              # L2: 完整文件索引（詳細查找）
├── PROJECT-INDEX.md               # L3: 高層次導航（結構理解）
└── INDEX-MAINTENANCE-GUIDE.md     # L4: 維護指南（本文件）
```

### 📊 索引分層原則

| 層級 | 文件 | 目標受眾 | 更新頻率 | 維護優先級 |
|------|------|----------|----------|-----------|
| **L1** | `TEMPLATE-DEVELOPMENT-GUIDE.md` | AI 助手、模板開發者 | 低 | ⭐⭐⭐ |
| **L2** | `TEMPLATE-INDEX.md` | 需要找具體文件的人 | 高 | ⭐⭐⭐ |
| **L3** | `PROJECT-INDEX.md` | 需要理解結構的人 | 中 | ⭐⭐ |
| **L4** | `INDEX-MAINTENANCE-GUIDE.md` | 索引維護者 | 低 | ⭐ |

---

## 🔴 維護時機

### 必須立即更新（每次提交）

以下變更**必須**在同一次 commit 中更新索引：

#### 1. 核心文件變更
- ✅ 新增/修改/刪除 `.md` 文檔（README, 指南等）
- ✅ 新增/修改 `init-project.js` CLI 工具
- ✅ 新增/修改 `.template` 文件

**更新清單**:
- `TEMPLATE-INDEX.md` 第1節 - 核心文件索引
- `PROJECT-INDEX.md` 快速鏈接（如果是重要文檔）

#### 2. 模組變更（02-modules/）
- ✅ 新增模組目錄
- ✅ 模組重命名或刪除
- ✅ 模組 README.md 重大更新

**更新清單**:
- `TEMPLATE-INDEX.md` 第3節 - 模組索引
- `PROJECT-INDEX.md` 第3節 - 功能模組概覽
- `TEMPLATE-DEVELOPMENT-GUIDE.md` 已實現模組清單（如適用）

#### 3. 基礎層變更（01-base/）
- ✅ 新增 Prisma Schema 文件
- ✅ 新增數據庫適配器
- ✅ 新增 UI 組件
- ✅ 新增核心 lib/ 文件

**更新清單**:
- `TEMPLATE-INDEX.md` 第2節 - 基礎層索引
- `PROJECT-INDEX.md` UI/數據模型概覽（如適用）

#### 4. 監控系統變更（00-monitoring/）
- ✅ 新增監控配置文件
- ✅ 新增告警規則
- ✅ 新增 Grafana 儀表板

**更新清單**:
- `TEMPLATE-INDEX.md` 第4節 - 監控系統索引

#### 5. 文檔變更（Docs/）
- ✅ 新增分析報告
- ✅ 新增技術文檔
- ✅ 重大文檔更新

**更新清單**:
- `TEMPLATE-INDEX.md` 第5節 - 文檔索引
- `PROJECT-INDEX.md` 第5節 - 技術文檔（如果重要）

### 🟡 建議更新（Sprint/Phase 結束時）

- 新增工具腳本（scripts/）
- 新增示例數據（examples/）
- 新增測試文件
- 依賴包重大更新

### 🟢 定期檢查（每月一次）

- 清理過期引用
- 優化索引結構
- 更新文件重要性評級
- 驗證所有鏈接有效性

---

## 🔄 標準維護工作流程

### ⚡ 強制性 TODO 清單

**每次開發任務必須包含索引更新檢查**:

```markdown
## 開發任務 TODO 清單

### 實現階段
- [ ] 實現功能代碼
- [ ] 編寫單元測試
- [ ] 本地測試通過

### 📋 索引維護（⚠️ 強制必做）
- [ ] **檢查是否創建/修改了重要文件**
  - [ ] 核心文檔（.md）
  - [ ] 模組文件（02-modules/）
  - [ ] 基礎層文件（01-base/）
  - [ ] 配置文件（.template）

- [ ] **更新 TEMPLATE-INDEX.md**
  - [ ] 添加新文件到對應章節
  - [ ] 更新文件大小估計
  - [ ] 標註文件用途和重要性

- [ ] **更新 PROJECT-INDEX.md**（如果是高層次變更）
  - [ ] 更新模組概覽
  - [ ] 更新完成度統計

- [ ] **更新 TEMPLATE-DEVELOPMENT-GUIDE.md**（如果極重要）
  - [ ] 更新已實現模組清單
  - [ ] 更新關鍵統計數據

- [ ] **執行索引檢查**: `npm run check:index`

### 提交階段
- [ ] git add 所有文件**包括索引文件**
- [ ] 提交信息包含 "並更新索引"
- [ ] 推送到 GitHub
```

### ✅ 正確做法示例

```bash
# === 正確的開發流程 ===

# 1. 創建新模組
mkdir 02-modules/module-email
touch 02-modules/module-email/README.md
# ... 實現代碼 ...

# 2. 立即更新索引（不要等！）
# 編輯 TEMPLATE-INDEX.md 第3節，添加:
# | Email 模組 | module-email/ | 6 | ~800行 | 郵件發送服務 |

# 編輯 PROJECT-INDEX.md 第3節，添加:
# - module-email - 郵件發送系統

# 3. 一起提交
git add 02-modules/module-email/ TEMPLATE-INDEX.md PROJECT-INDEX.md
git commit -m "feat: 新增 Email 模組並更新索引"
git push origin main

# ✅ 索引和代碼同步提交！
```

### ❌ 錯誤做法

```bash
# Day 1: 創建模組 A
git commit -m "feat: 新增模組 A"

# Day 2: 創建模組 B
git commit -m "feat: 新增模組 B"

# Day 7: 才想起來更新索引 ❌
git commit -m "docs: 更新索引"
# 結果: 可能遺漏文件！索引已過時！
```

---

## 🛠️ 自動化檢查工具

### 1. 索引同步檢查腳本

**位置**: `scripts/check-index-sync.js`

**功能**:
- ✅ 檢查實際文件 vs 索引記錄
- ✅ 檢測遺漏的文件
- ✅ 檢測幽靈條目（索引存在但文件不存在）
- ✅ 生成詳細報告

**使用方法**:
```bash
# 執行完整檢查
npm run check:index

# 或手動執行
node scripts/check-index-sync.js
```

**輸出示例**:
```
📊 索引同步檢查報告

整體統計:
- 實際文件總數: 150
- 索引文件數: 145
- 索引健康度: 96.7%

⚠️ 發現問題:
- 遺漏索引: 5 個文件
  ✗ 02-modules/module-email/README.md
  ✗ 01-base/lib/new-util.ts
  ...

- 幽靈條目: 0 個

建議: 請更新 TEMPLATE-INDEX.md 添加遺漏文件
```

### 2. 快速檢查命令（手動）

```bash
# === 檢查最近新增的文件是否已索引 ===

# 1. 列出最近新增的重要文件
git diff --name-status HEAD~5 HEAD | \
  grep "^A" | \
  grep -E '\.(md|js|ts)$' | \
  grep -E '01-base/|02-modules/|00-monitoring/' | \
  awk '{print $2}'

# 2. 檢查這些文件是否在 TEMPLATE-INDEX.md 中
for file in $(上述文件列表); do
  if grep -q "$file" TEMPLATE-INDEX.md; then
    echo "✅ $file - 已索引"
  else
    echo "❌ $file - 未索引 ⚠️"
  fi
done
```

---

## 📋 特殊場景維護指南

### 1. 新增模組時

**完整檢查清單**:

```markdown
## 新增模組維護清單

### 代碼實現
- [ ] 創建模組目錄 `02-modules/module-{name}/`
- [ ] 編寫模組代碼
- [ ] 創建 README.md
- [ ] 編寫測試

### 索引更新（3個文件）
- [ ] **TEMPLATE-INDEX.md 第3節**
  ```markdown
  | {Name} | module-{name}/ | {N}文件 | {X}行 | {描述} | P{X} |
  ```

- [ ] **PROJECT-INDEX.md 第3節**
  ```markdown
  - module-{name} - {簡短描述}
  ```

- [ ] **TEMPLATE-DEVELOPMENT-GUIDE.md**（如果是重要模組）
  ```markdown
  已實現模組清單中添加
  ```

### init-project.js 同步
- [ ] 更新 MODULE_OPTIONS 數組
- [ ] 更新模組選擇邏輯

### 提交
- [ ] git add 模組文件 + 3個索引文件 + init-project.js
- [ ] commit -m "feat: 新增 {Name} 模組並更新索引"
```

### 2. 新增 .template 文件時

```markdown
## 新增模板文件維護清單

- [ ] 創建 `.template` 文件
- [ ] 更新 `TEMPLATE-INDEX.md` 第2.1節
- [ ] 更新 `init-project.js` 處理邏輯
- [ ] 測試初始化流程
- [ ] 一起提交所有變更
```

### 3. 重構目錄結構時

```markdown
## 目錄重構維護清單

### 執行重構
- [ ] 執行文件/目錄移動
- [ ] 更新代碼中的導入路徑

### 全面更新索引（3個文件）
- [ ] **TEMPLATE-INDEX.md**
  - [ ] 更新所有受影響章節的路徑
  - [ ] 檢查表格中的路徑

- [ ] **PROJECT-INDEX.md**
  - [ ] 更新目錄結構圖
  - [ ] 更新快速鏈接

- [ ] **TEMPLATE-DEVELOPMENT-GUIDE.md**
  - [ ] 檢查文件引用路徑

### 驗證
- [ ] 執行 `npm run check:index`
- [ ] 手動驗證重要路徑

### 提交
- [ ] 使用描述性 commit message
- [ ] 例如: "refactor: 重構模組結構並同步更新所有索引"
```

### 4. 刪除文件時

```markdown
## 文件刪除維護清單

- [ ] 從索引中移除條目
  - [ ] TEMPLATE-INDEX.md
  - [ ] PROJECT-INDEX.md（如適用）

- [ ] 檢查是否有其他文檔引用
  - [ ] TEMPLATE-DEVELOPMENT-GUIDE.md
  - [ ] README.md
  - [ ] CHANGELOG.md

- [ ] 一起提交刪除和索引更新
```

---

## 🎯 索引質量標準

### 完整性標準

- ✅ **100% 核心文件覆蓋** - 所有 .md, .js 核心文件必須索引
- ✅ **95%+ 模組文件覆蓋** - 02-modules/ 所有模組必須索引
- ✅ **90%+ 基礎層覆蓋** - 01-base/ 重要文件必須索引
- ⚠️ **可選**: examples/, test-projects/ 可部分索引

### 準確性標準

- ✅ **0 幽靈條目** - 索引中的文件必須實際存在
- ✅ **路徑準確性 100%** - 所有路徑必須正確
- ✅ **描述準確性** - 文件用途描述必須準確

### 時效性標準

- ✅ **24小時內同步** - 新文件必須在24小時內索引
- ✅ **推薦即時同步** - 與代碼同一 commit 提交

---

## 📊 月度維護檢查清單

**每月執行一次**:

```markdown
## 月度索引健康檢查

### 自動檢查
- [ ] 執行 `npm run check:index`
- [ ] 查看索引健康度（目標 >95%）
- [ ] 修復所有遺漏和幽靈條目

### 手動審查
- [ ] 審查 TEMPLATE-DEVELOPMENT-GUIDE.md
  - [ ] 統計數據是否準確
  - [ ] 最近更新日期
  - [ ] 模組清單完整性

- [ ] 審查 TEMPLATE-INDEX.md
  - [ ] 文件大小估計是否過時
  - [ ] 重要性標記是否合理
  - [ ] 章節組織是否合理

- [ ] 審查 PROJECT-INDEX.md
  - [ ] 完成度統計是否準確
  - [ ] 快速鏈接是否有效
  - [ ] 模組概覽是否最新

### 優化改進
- [ ] 識別可以改進的索引結構
- [ ] 更新文件重要性評級
- [ ] 添加新的索引章節（如需要）

### 文檔
- [ ] 記錄檢查結果
- [ ] 記錄改進措施
- [ ] 更新維護日誌
```

---

## 🚨 常見錯誤和解決方案

### 錯誤 1: 忘記更新索引

**症狀**: AI 助手找不到新創建的文件

**解決**:
```bash
# 1. 找出未索引的文件
npm run check:index

# 2. 立即補充到 TEMPLATE-INDEX.md
# 3. 提交索引更新
git add TEMPLATE-INDEX.md
git commit -m "docs: 補充遺漏的索引條目"
```

### 錯誤 2: 索引路徑錯誤

**症狀**: 索引中的文件路徑不正確

**解決**:
```bash
# 1. 檢查文件實際路徑
ls -la 02-modules/module-email/

# 2. 更正 TEMPLATE-INDEX.md 中的路徑
# 3. 提交更正
git add TEMPLATE-INDEX.md
git commit -m "fix: 更正索引中的文件路徑"
```

### 錯誤 3: 幽靈條目（文件已刪除但索引未移除）

**症狀**: `npm run check:index` 報告幽靈條目

**解決**:
```bash
# 1. 確認文件確實已刪除
# 2. 從所有索引文件中移除條目
# 3. 提交清理
git add TEMPLATE-INDEX.md PROJECT-INDEX.md
git commit -m "docs: 清理索引中的幽靈條目"
```

---

## 📝 維護日誌模板

建議在每次重大索引更新時記錄：

```markdown
## 索引維護日誌

### 2025-10-XX - 新增 Email 模組

**變更**:
- 新增 module-email/ 模組
- 更新 TEMPLATE-INDEX.md 第3節
- 更新 PROJECT-INDEX.md 模組清單
- 更新 init-project.js MODULE_OPTIONS

**索引健康度**: 96.5% → 97.2%

**未索引文件**: 5 → 3

**下次改進**: 無
```

---

## 🎉 最佳實踐總結

### ✅ 推薦做法

1. **提交時同步**: 每次提交重要文件時同時更新索引
2. **分層維護**: 根據文件重要性選擇適當的索引層級
3. **即時更新**: 創建文件時立即更新索引，不延遲
4. **定期檢查**: 每月執行健康檢查確保索引質量
5. **自動化工具**: 使用 check-index-sync.js 自動檢測問題
6. **清理幽靈**: 及時清理已刪除文件的索引條目
7. **路徑驗證**: 確保所有路徑都是正確且可訪問的
8. **描述準確**: 文件描述必須清晰反映實際用途

### ❌ 避免做法

1. **批次延遲更新**: 累積大量變更後才更新索引
2. **忽略小文件**: 認為小文件不重要而不納入索引
3. **路徑硬編碼**: 在索引中使用絕對路徑或環境特定路徑
4. **手動大量操作**: 面對大量文件仍堅持手動維護
5. **忽略健康度**: 不定期檢查索引健康度和覆蓋率
6. **過期不更新**: 文件已變更但索引描述未更新

---

## 🎯 模板項目特殊注意事項

### .template 文件的索引維護

**重要性**: ⭐⭐⭐ 最高優先級

**原因**:
- `.template` 文件是模板項目的核心
- 在 `init-project.js` 中被複製和處理
- 新增或修改會影響生成的項目

**維護流程**:
```bash
# 1. 新增 .template 文件
touch 01-base/newfile.template

# 2. 更新 TEMPLATE-INDEX.md 第2.1節
# 3. 更新 init-project.js 處理邏輯
# 4. 一起提交
git add 01-base/newfile.template TEMPLATE-INDEX.md init-project.js
git commit -m "feat: 新增 newfile.template 並更新索引和CLI"
```

### init-project.js 的索引維護

**重要性**: ⭐⭐⭐ 最高優先級

**原因**:
- 初始化工具是模板的核心功能
- 任何變更都會影響用戶體驗

**維護流程**:
```bash
# 1. 修改 init-project.js
# 2. 更新 TEMPLATE-INDEX.md 第1節
# 3. 更新 README.md（如果流程變更）
# 4. 測試初始化流程
npm run test:init

# 5. 一起提交
git add init-project.js TEMPLATE-INDEX.md README.md
git commit -m "feat: 改進CLI初始化流程並更新文檔"
```

### 模組文檔的索引維護

**重要性**: ⭐⭐ 高優先級

**原因**:
- 模組 README.md 是用戶了解模組的主要途徑
- 必須準確反映模組功能和使用方式

**維護流程**:
```bash
# 1. 更新模組 README.md
# 2. 檢查是否需要更新 TEMPLATE-INDEX.md 描述
# 3. 檢查是否需要更新 PROJECT-INDEX.md 功能概述
# 4. 提交
git add 02-modules/module-xxx/README.md TEMPLATE-INDEX.md
git commit -m "docs: 更新 module-xxx 文檔"
```

---

**版本**: 1.0 | **最後更新**: 2025-10-09

**核心原則**: 索引系統的價值在於幫助 AI 助手快速找到正確文件。保持索引的準確性和時效性比完整性更重要！模板項目的特性要求我們特別關注 .template 文件、init-project.js 和模組文檔的索引維護。

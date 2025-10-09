# 🤖 AI 助手指南 - AI Web App Template

**版本**: 5.0
**最後更新**: 2025-10-09
**項目類型**: Next.js 14 全棧應用模板
**GitHub**: https://github.com/laitim2001/ai-webapp-template

---

## 📋 快速導航

| 需求 | 查看文檔 | 用途 |
|------|---------|------|
| **快速了解項目** | 👉 本文件 | 5分鐘速覽項目全貌 |
| **完整項目索引** | [PROJECT-INDEX.md](PROJECT-INDEX.md) | 所有文件和功能詳細索引 |
| **開發指南** | [CLAUDE.md](CLAUDE.md) | Claude Code 開發指導 |
| **實施計劃** | [Docs/TEMPLATE-CREATION-FINAL-v5-COMPLETE.md](Docs/TEMPLATE-CREATION-FINAL-v5-COMPLETE.md) | 完整模板實施計劃 |
| **初始化模板** | `node init-project.js` | 創建新項目 |

---

## 🎯 項目概述

這是一個**生產就緒的 Next.js 14 全棧應用模板**，提供：

### 核心特性
- ✅ **多數據庫支持** - PostgreSQL/MySQL/MongoDB/SQLite 無縫切換
- ✅ **23個功能模組** - 可選擇性安裝的業務模組
- ✅ **114個UI組件** - 基於 Radix UI 的無障礙組件庫
- ✅ **82個API端點** - RESTful API 完整實現
- ✅ **企業級監控** - OpenTelemetry + Prometheus/Azure Monitor
- ✅ **完整認證系統** - JWT雙令牌 + Azure AD SSO
- ✅ **測試框架** - Jest + Playwright (120+ 測試)

### 項目規模
```
📊 代碼統計
├── 總代碼行數: 164,091 行
├── 生產文件: 476 個
├── Prisma模型: 34 個
├── 組件文件: 114 個
├── API路由: 82 個
└── 依賴包: 114 個
```

---

## 🚀 快速開始

### 1. 初始化新項目

```bash
# 克隆模板
git clone https://github.com/laitim2001/ai-webapp-template.git my-project
cd my-project

# 運行初始化 CLI
node init-project.js
```

### 2. CLI 引導流程

初始化 CLI 會引導你完成：

1. **項目信息** - 名稱、描述、作者
2. **數據庫選擇** - PostgreSQL (推薦) / MySQL / MongoDB / SQLite
3. **模組選擇** - 從23個模組中選擇需要的功能
4. **監控配置** - Prometheus / Azure Monitor / Both
5. **環境設置** - 自動生成 `.env.local`
6. **依賴安裝** - 自動 `npm install`
7. **數據庫初始化** - Prisma generate + migrate

### 3. 啟動開發服務器

```bash
npm run dev
# 打開 http://localhost:3000
```

---

## 🧩 項目架構（5層架構）

```
第零層: 監控與可觀測性基礎 (OpenTelemetry)
    ↓
第一層: 技術棧基礎設施 (Next.js + Prisma + 多數據庫)
    ↓
第二層: 功能模組庫 (23個可選模組)
    ↓
第三層: 開發工具鏈 (CLI + 測試 + 文檔)
    ↓
第四層: 部署與運維 (Docker + CI/CD)
```

---

## 📦 功能模組清單（23個）

### P0 - 必選模組（4個）
| 模組 | 代碼量 | 說明 |
|------|--------|------|
| **00-監控系統** | 2,776 行 | OpenTelemetry 完整堆疊 |
| **01-認證授權** | 2,500+ 行 | JWT + Azure AD SSO |
| **02-Security & RBAC** | 1,800+ 行 | 細粒度權限控制 |
| **03-API Gateway** | 4,884 行 | 12個企業級中間件 |

### P1 - 高優先級模組（7個）
| 模組 | 代碼量 | 說明 |
|------|--------|------|
| **知識庫系統** | 8,000+ 行 | 文檔管理 + 版本控制 |
| **AI 整合層** | 3,000+ 行 | Azure OpenAI 封裝 |
| **搜索引擎** | 2,800+ 行 | 多算法向量搜索 |
| **工作流程引擎** | 2,035 行 | 12狀態流程管理 |
| **通知系統** | 1,550 行 | 多渠道通知 |
| **緩存系統** | 1,500+ 行 | Redis 雙層緩存 |
| **Performance** | 600+ 行 | 性能優化服務 |
| **Resilience** | 600+ 行 | 斷路器 + 重試 |

### P2 - 可選模組（12個）
| 模組 | 代碼量 | 說明 |
|------|--------|------|
| **範本管理** | 1,150 行 | Handlebars 模板 |
| **PDF 生成** | 640 行 | Puppeteer PDF |
| **文件解析** | 1,280 行 | PDF/Word/Excel/OCR |
| **Dynamics 365** | 1,200+ 行 | CRM 整合 |
| **Customer 360** | 800+ 行 | 客戶360視圖 |
| **Analytics** | 482 行 | 用戶行為追蹤 |
| **Calendar** | 1,388 行 | Microsoft Graph 同步 |
| **Collaboration** | 487 行 | 編輯鎖定管理 |
| **Meeting** | 1,214 行 | AI 會議準備 |
| **Recommendation** | 631 行 | 個性化推薦 |
| **Reminder** | 674 行 | 提醒調度器 |

---

## 🎨 UI 組件系統

### 組件目錄（19個，114個文件）

```
components/
├── ui/              # 24個基礎組件（Radix UI）
├── knowledge/       # 35個知識庫組件
├── workflow/        # 12個工作流組件
├── dashboard/       # 6個儀表板組件
├── search/          # 8個搜索組件
├── meeting-prep/    # 5個會議準備組件
└── [其他13個目錄]  # 24個業務組件
```

**特性**:
- ✅ 完全無障礙（WCAG 2.1 AA級）
- ✅ 深色模式支持
- ✅ 響應式設計（6個斷點）
- ✅ TypeScript 類型安全
- ✅ 20+ 預定義動畫

---

## 🚀 API 路由系統

### API 域（23個，82個端點）

**核心 API**:
- **Knowledge Base** (17端點) - CRUD + 版本管理 + 高級搜索
- **Authentication** (7端點) - JWT + Azure AD + 刷新令牌
- **Templates** (8端點) - 範本管理 + PDF導出
- **Proposals** (6端點) - 提案 + 版本控制

**業務 API**:
- **AI Services** (2端點) - AI生成提案
- **Analytics** (3端點) - 用戶行為追蹤
- **Calendar** (3端點) - Microsoft Graph 同步
- **Collaboration** (3端點) - 編輯鎖定
- **Meeting** (2+3端點) - 智能分析 + 準備包
- **Recommendations** (3端點) - 個性化推薦
- **Reminders** (3端點) - 提醒管理
- **Notifications** (4端點) - 通知系統
- **[其他11個域]** (26端點)

---

## 🗄️ 數據庫架構

### Prisma Schema（34個模型）

**核心系統** (6個):
- User, Session, Role, Permission, RolePermission, UserRole

**知識庫系統** (9個):
- KnowledgeFolder, KnowledgeBase, KnowledgeChunk, KnowledgeTag, ProcessingTask, KnowledgeVersion, KnowledgeVersionComment, Document, AIAnalysis

**提案系統** (5個):
- Proposal, ProposalVersion, ProposalTemplate, ProposalTemplateUsage, ProposalWorkflow

**其他系統** (14個):
- 範本、工作流、通知、提醒、分析、客戶、會議等

### 多數據庫適配器

```typescript
// 統一接口，支援4種數據庫
import { databaseAdapter } from '@/lib/db/database-adapter';

const users = await databaseAdapter.findMany('users', {
  where: { active: true }
});
```

---

## 🔧 開發工作流

### 常用命令

```bash
# 開發
npm run dev              # 開發服務器 (localhost:3000)
npm run build            # 生產構建
npm start                # 生產服務器

# 代碼質量
npm run lint             # ESLint 檢查
npm run test             # Jest 單元測試
npm run test:e2e         # Playwright E2E測試

# 數據庫
npm run prisma:generate  # 生成 Prisma Client
npm run prisma:migrate   # 運行遷移
npm run prisma:studio    # 數據庫 GUI
npm run db:seed          # 種子數據

# 監控（如果選擇了監控模組）
npm run monitoring:start # 啟動 Prometheus/Grafana
npm run monitoring:stop  # 停止監控
```

### Git 工作流

```bash
# 創建功能分支
git checkout -b feature/my-feature

# 開發和提交
git add .
git commit -m "feat: add new feature"

# 推送和創建 PR
git push origin feature/my-feature
```

---

## 📊 監控與可觀測性

### OpenTelemetry 堆疊

**支持的後端**:
- ✅ **Prometheus + Grafana** (本地部署)
- ✅ **Azure Monitor** (雲端)
- ✅ **Console** (開發環境)

**監控內容**:
- 📈 應用性能指標（APM）
- 🔍 分佈式追踪（Tracing）
- 📊 業務指標（12個類別）
- ⚠️ 自動告警（46條規則，P1-P4級別）
- 📉 預建儀表板（4個 Grafana 儀表板）

**切換後端**: 5-10分鐘配置即可切換

---

## 🧪 測試策略

### 測試覆蓋

```
📋 測試框架
├── Jest - 單元測試（120+ 測試）
├── Playwright - E2E測試
├── 整合測試 - 5個場景自動化
└── UI驗證 - 23組件 + 20動畫驗證
```

**測試類型**:
- ✅ 單元測試 - 工具函數、邏輯層
- ✅ 集成測試 - API端點、數據庫
- ✅ E2E測試 - 用戶流程、頁面交互
- ✅ 可訪問性測試 - WCAG 2.1 合規

---

## 📚 文檔系統

### 核心文檔

| 文檔 | 用途 |
|------|------|
| [AI-ASSISTANT-GUIDE.md](AI-ASSISTANT-GUIDE.md) | AI 助手快速指南（本文件） |
| [PROJECT-INDEX.md](PROJECT-INDEX.md) | 完整項目索引 |
| [CLAUDE.md](CLAUDE.md) | Claude Code 開發指導 |
| [README.md](README.md) | 項目介紹和快速開始 |
| [Docs/](Docs/) | 詳細技術文檔 |

### 技術文檔（Docs/）

**實施文檔**:
- `TEMPLATE-CREATION-FINAL-v5-COMPLETE.md` - v5.0 完整實施計劃（3,266行）
- `SOURCE-PROJECT-SNAPSHOT.md` - 源項目完整快照
- `SOURCE-PROJECT-VERIFICATION.md` - 100% 驗證報告

**對比分析**:
- `TEMPLATE-VS-SOURCE-COMPARISON.md` - 模板與源項目對比
- `V4-V5-COMPARISON-ANALYSIS.md` - v4/v5 版本對比
- `VERIFICATION-SUMMARY.md` - 驗證摘要

**整合指南**:
- `V5-COMPLETE-INTEGRATION-GUIDE.md` - v5.0 整合指南
- `V5-ADDITIONS.md` - v5.0 新增內容
- `SCAN-COMPLETENESS-REPORT.md` - 掃描完整性報告

---

## 🎓 常見使用場景

### 場景 1: 創建知識管理系統

```bash
# 初始化時選擇：
✓ Knowledge Base 模組
✓ Search 模組
✓ AI Integration 模組（可選）
✓ Analytics 模組（可選）

# 獲得：
- 文檔CRUD + 版本控制
- 向量搜索 + 全文搜索
- AI輔助內容生成
- 用戶行為分析
```

### 場景 2: 創建企業內部系統

```bash
# 初始化時選擇：
✓ Authentication 模組（必選）
✓ RBAC 模組（必選）
✓ API Gateway 模組（必選）
✓ Workflow 模組
✓ Notification 模組
✓ Audit Log（內建）

# 獲得：
- 完整認證授權系統
- 細粒度權限控制
- 審批工作流
- 多渠道通知
- 審計日誌追踪
```

### 場景 3: 創建 AI 驅動應用

```bash
# 初始化時選擇：
✓ AI Integration 模組
✓ Meeting 模組
✓ Recommendation 模組
✓ Analytics 模組

# 獲得：
- Azure OpenAI 整合
- AI會議準備包
- 個性化推薦引擎
- 用戶行為追蹤
```

---

## 🔍 關鍵技術決策

### 為什麼選擇這些技術？

**Next.js 14 + App Router**:
- ✅ React 服務器組件 - 更好的性能
- ✅ 內建 API 路由 - 全棧開發
- ✅ 自動代碼分割 - 優化加載
- ✅ 圖片優化 - next/image

**Prisma ORM**:
- ✅ 類型安全 - TypeScript 集成
- ✅ 遷移管理 - 版本控制
- ✅ 多數據庫支持 - 靈活切換
- ✅ 關係處理 - 自動 JOIN

**Radix UI**:
- ✅ 無障礙優先 - WCAG 2.1 AA
- ✅ 無樣式組件 - 完全可定制
- ✅ 鍵盤導航 - 完整支持
- ✅ 焦點管理 - 自動處理

**OpenTelemetry**:
- ✅ 供應商中立 - 輕鬆切換後端
- ✅ 標準協議 - 行業標準
- ✅ 豐富生態 - 大量集成
- ✅ 自動埋點 - 減少手動工作

---

## 🚨 常見問題解答

### Q1: 如何選擇數據庫？

**推薦**: PostgreSQL（支持 pgvector 向量搜索）

| 數據庫 | 適用場景 | 限制 |
|--------|---------|------|
| **PostgreSQL** | 生產環境、需要向量搜索 | 需要安裝和配置 |
| **MySQL** | 生產環境、傳統關係型數據 | 不支持向量搜索 |
| **MongoDB** | NoSQL需求、靈活Schema | 需要特殊適配器處理 |
| **SQLite** | 開發/測試、快速原型 | **不適合生產環境** |

### Q2: 如何添加自定義模組？

1. 在 `02-modules/` 創建新目錄
2. 添加代碼文件和配置
3. 創建 `install.sh` 安裝腳本
4. 更新 `init-project.js` 的 `MODULE_OPTIONS`

### Q3: 如何切換監控後端？

編輯環境變量：
```env
MONITORING_BACKEND=prometheus  # 或 azure_monitor 或 console
```

重啟服務即可，無需修改代碼。

### Q4: 模組之間有依賴關係嗎？

有些模組有依賴：
- **Knowledge Base** 依賴 **Search** 模組
- **Meeting** 模組建議搭配 **AI Integration**
- **Recommendation** 依賴 **Analytics** 模組

CLI 會自動提示依賴關係。

### Q5: 如何升級到新版本？

```bash
# 查看變更日誌
cat CHANGELOG.md

# 備份當前項目
git commit -am "backup before upgrade"

# 拉取新版本
git pull origin main

# 合併變更
git merge --no-commit origin/main

# 解決衝突後提交
git commit
```

---

## 📖 進階學習

### 推薦閱讀順序

1. **快速開始** (5分鐘)
   - ✅ 閱讀本文件
   - ✅ 運行 `node init-project.js`
   - ✅ 啟動 `npm run dev`

2. **深入理解** (1小時)
   - 📖 閱讀 [CLAUDE.md](CLAUDE.md)
   - 📖 瀏覽 [PROJECT-INDEX.md](PROJECT-INDEX.md)
   - 📖 查看組件目錄 `components/`

3. **完整掌握** (1天)
   - 📚 研讀 [TEMPLATE-CREATION-FINAL-v5-COMPLETE.md](Docs/TEMPLATE-CREATION-FINAL-v5-COMPLETE.md)
   - 📚 理解架構設計決策
   - 📚 熟悉所有模組功能

4. **實戰開發** (持續)
   - 💻 根據需求選擇模組
   - 💻 參考使用範例開發
   - 💻 遇到問題查閱文檔

---

## 🤝 貢獻指南

歡迎貢獻！請遵循以下流程：

1. Fork 項目
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 創建 Pull Request

**提交規範**:
- `feat:` 新功能
- `fix:` Bug 修復
- `docs:` 文檔更新
- `style:` 代碼格式
- `refactor:` 重構
- `test:` 測試
- `chore:` 構建/工具

---

## 📞 支持與反饋

- **GitHub Issues**: https://github.com/laitim2001/ai-webapp-template/issues
- **GitHub Discussions**: https://github.com/laitim2001/ai-webapp-template/discussions
- **文檔**: 查閱 `Docs/` 目錄

---

## 📄 授權

查看 [LICENSE](LICENSE) 文件了解詳情。

---

**最後更新**: 2025-10-09
**版本**: 5.0
**狀態**: 🟢 生產就緒（Production Ready）

**下一步**: 查看 [PROJECT-INDEX.md](PROJECT-INDEX.md) 獲取完整項目索引

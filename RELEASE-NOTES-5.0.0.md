# Release Notes - v5.0.0 to v5.0.13

**初始發布**: 2025-10-11 (v5.0.0)
**當前版本**: 5.0.13 (Stable Release + Hotfix 週期)
**最後更新**: 2025-10-12
**NPM 包**: https://www.npmjs.com/package/create-ai-webapp
**狀態**: ✅ 生產就緒

---

## 🎉 重大更新

### 🚀 NPX 腳手架工具 (全新功能)

**一條命令創建企業級 Next.js 應用**:
```bash
npx create-ai-webapp my-awesome-app
```

**特點**:
- ✅ **零配置開始** - 無需 git clone，直接創建乾淨項目
- ✅ **互動式 CLI** - 友好的問答式配置流程
- ✅ **智能模組選擇** - 22個可選功能模組
- ✅ **多數據庫支持** - PostgreSQL/MySQL/MongoDB/SQLite
- ✅ **演示模式** - 15個完整演示頁面（零模組配置）
- ✅ **自動安裝依賴** - npm install + Prisma 初始化一條龍

### 📦 完整功能模組系統

**22個企業級功能模組**:
- 🔐 認證系統 (JWT + Azure AD SSO)
- 🌐 API Gateway (12個企業級中間件)
- 🔒 安全與 RBAC (角色權限 + 審計日誌)
- 📊 監控系統 (OpenTelemetry + Prometheus + Grafana)
- 📚 知識庫系統 (向量搜索 + 版本控制)
- 🔍 智能搜索 (多算法向量搜索)
- 🤖 AI 整合 (Azure OpenAI 封裝)
- ⚙️ 工作流引擎 (12狀態工作流)
- 🔔 通知系統 (多渠道通知)
- ⚡ 性能監控 (應用級性能追蹤)
- 🛡️ 韌性模組 (熔斷器 + 重試策略)
- 💾 緩存系統 (Redis 雙層緩存)
- 📄 模板引擎 (Handlebars + 20 Helpers)
- 📑 PDF 生成 (Puppeteer)
- 📂 文件解析器 (PDF/Word/Excel/OCR)
- 🔗 Dynamics 365 整合
- 👥 Customer 360 (客戶全景視圖)
- 📊 Analytics (行為追蹤)
- 📅 Calendar (日曆同步)
- 🤝 Collaboration (協作編輯)
- 📞 Meeting (會議智能)
- 💡 Recommendation (AI推薦)
- ⏰ Reminder (提醒系統)

### 🎨 完整 UI 設計系統

**26+ 精美組件** (v5.0.13 新增 Toast 通知):
- Button, Card, Dialog, Form
- Table, Pagination, Navigation
- Alert, Toast (含通知系統), Badge, Avatar
- Select, Input, Checkbox, Radio
- Tabs, Accordion, Popover, Tooltip
- 完整暗色模式支持
- 20+ 動畫效果
- 響應式設計 (6個斷點)

### 🎭 演示模式 (零模組配置)

**15個完整演示頁面**:
- 登錄/註冊頁面
- 主儀表板 (統計卡片 + 圖表)
- 知識庫管理
- 全局搜索
- 通知中心
- 客戶管理 CRM
- 任務管理系統
- AI 助手聊天
- 提案管理
- 模板管理
- 系統管理後台
- RESTful API 文檔
- 用戶設置
- 團隊管理
- 報表分析

訪問 `http://localhost:3000/(demo)/login` 立即體驗！

---

## ✨ 核心功能

### 🗄️ 多數據庫支持

**4種主流數據庫**:
- **PostgreSQL** (推薦) - 完整功能，pgvector 支持 (v5.0.10-11 修復)
- **MySQL** - 高性能，廣泛使用
- **MongoDB** - NoSQL 靈活性
- **SQLite** - 零配置，開發測試

**統一數據庫適配器層**:
- 一次編寫，任意切換
- 透明化數據庫操作
- 自動處理數據庫差異

### 📊 企業級監控系統

**OpenTelemetry 統一遙測**:
- 指標 (Metrics)
- 追蹤 (Traces)
- 日誌 (Logs)
- 46條智能告警規則

**雙後端支持**:
- **Prometheus + Grafana** - 本地部署，完全控制
- **Azure Monitor** - 雲端託管，零維護

**4個預建 Grafana 儀表板**:
- 應用概覽
- API 性能
- 數據庫性能
- 業務指標

### 🧪 完整測試覆蓋

**564+ 測試**:
- 單元測試 (Jest)
- E2E 測試 (Playwright)
- 集成測試
- 性能測試

### 📚 100% 中文文檔

**完整文檔系統**:
- 快速開始指南
- 詳細 API 文檔
- 模組使用指南
- UI 設計規範
- 部署指南
- 最佳實踐
- 故障排除

---

## 🔧 技術棧

### 核心框架
- **Next.js 14** - App Router + Server Components + Server Actions
- **React 18** - 最新特性
- **TypeScript 5** - 嚴格模式

### 樣式和 UI
- **Tailwind CSS 3** - 完整自定義主題
- **Radix UI** - 無障礙 UI 基礎組件
- **Lucide React** - 精美圖標庫

### 數據庫和 ORM
- **Prisma** - 類型安全的 ORM
- **PostgreSQL 15+** - 主推數據庫
- **MySQL 8+** - 備選方案
- **MongoDB 6+** - NoSQL 選項
- **SQLite 3+** - 開發測試

### 監控和觀測
- **OpenTelemetry** - 統一遙測標準
- **Prometheus** - 指標收集
- **Grafana** - 可視化儀表板
- **Jaeger** - 分佈式追蹤

### AI 和機器學習
- **Azure OpenAI** - GPT-4 整合
- **OpenAI SDK** - API 封裝
- **Vector Search** - pgvector 向量搜索

### 測試
- **Jest** - 單元測試
- **Playwright** - E2E 測試
- **Testing Library** - React 組件測試

---

## 📦 安裝和使用

### 方式 1: NPX (推薦) ⭐

```bash
# 創建新項目
npx create-ai-webapp my-awesome-app

# 進入項目
cd my-awesome-app

# 啟動開發服務器
npm run dev
```

### 方式 2: Git Clone

```bash
# 克隆倉庫
git clone https://github.com/laitim2001/ai-webapp-template.git
cd ai-webapp-template

# 運行初始化 CLI
node init-project.js

# 啟動開發服務器
npm run dev
```

---

## 📊 項目統計

### 代碼規模
- **總代碼行數**: 86,716+ (v5.0.13 新增 ~180行)
- **核心模組**: 22個
- **UI 組件**: 26個 (v5.0.13 新增 Toast)
- **測試**: 564+
- **文檔**: 15,000+ 字符

### 文件數量
- **模板文件**: 366個
- **NPX 包文件**: 7個核心文件
- **文檔文件**: 20+

### NPM 包信息
- **包名**: create-ai-webapp
- **版本**: 5.0.13 (當前)
- **包大小**: 3.2 MB
- **依賴項**: 4個 (chalk, fs-extra, inquirer, ora)

---

## 🎯 適用場景

### 最適合的項目類型
✅ **企業級 Web 應用**
✅ **AI 驅動的 SaaS 產品**
✅ **知識管理系統**
✅ **內容管理平台**
✅ **CRM / ERP 系統**
✅ **數據分析平台**

### 技術需求匹配
- 需要**快速啟動**企業級項目
- 需要**完整的監控**和可觀測性
- 需要**多數據庫**靈活性
- 需要**AI 整合**能力
- 需要**生產就緒**的代碼質量
- 需要**完整的中文文檔**

---

## 🆕 新功能亮點

### 1. NPX 一鍵創建
**之前**:
```bash
git clone ...
cd ai-webapp-template
node init-project.js
# 在模板倉庫內生成項目，文件混雜
```

**現在**:
```bash
npx create-ai-webapp my-app
# 在獨立目錄生成乾淨項目
```

### 2. 演示模式
**零模組配置** - 不選任何模組，獲得15個完整演示頁面:
- 立即查看效果
- 學習最佳實踐
- 快速原型開發

### 3. 智能依賴管理
**自動處理**:
- npm install 自動執行
- Prisma generate 自動執行
- 數據庫遷移自動執行
- 種子數據可選生成

### 4. 完整錯誤處理
**友好錯誤提示**:
- 清晰的錯誤信息
- 解決方案建議
- 失敗自動清理

---

## 🔄 版本更新

### 從之前版本升級

**v5.0-rc → v5.0.0**:
- ✅ 添加 NPX 支持
- ✅ 完善演示模式
- ✅ 優化 CLI 體驗
- ✅ 修復已知問題
- ✅ 完善文檔

### 破壞性變更
**無破壞性變更** - 向後完全兼容

---

## 🐛 已修復問題

- ✅ 修復 MongoDB 適配器初始化問題
- ✅ 修復某些模組依賴衝突
- ✅ 優化 CLI 互動體驗
- ✅ 改進錯誤處理和清理機制
- ✅ 完善 TypeScript 類型定義

---

## 📖 文檔

### 核心文檔
- [README.md](../README.md) - 項目概覽
- [NPX-IMPLEMENTATION-REPORT.md](../NPX-IMPLEMENTATION-REPORT.md) - NPX 實施報告
- [NPM-PUBLISH-SUCCESS.md](../NPM-PUBLISH-SUCCESS.md) - NPM 發布報告

### 使用指南
- [數據庫切換指南](../Docs/DATABASE-SWITCHING-GUIDE.md)
- [模組整合指南](../02-modules/MODULE-INTEGRATION-GUIDE.md)
- [監控系統文檔](../00-monitoring/README.md)

### 設計文檔
- [UI 設計系統](../01-base/UI-DESIGN-SYSTEM.md)
- [動畫指南](../01-base/docs/ANIMATION-GUIDE.md)
- [響應式設計指南](../01-base/docs/RESPONSIVE-DESIGN-GUIDE.md)

---

## 🤝 貢獻

歡迎貢獻！請查看 [貢獻指南](../CONTRIBUTING.md)。

### 貢獻方式
- 🐛 報告 Bug: https://github.com/laitim2001/ai-webapp-template/issues
- ✨ 提出新功能: https://github.com/laitim2001/ai-webapp-template/issues/new
- 📝 改進文檔: Pull Request
- 🔧 提交代碼: Pull Request

---

## 🙏 致謝

### 基於項目
本模板基於 [AI Sales Enablement Platform](https://github.com/laitim2001/ai-sales-enablement-webapp) 提取和優化。

### 技術棧
- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [OpenTelemetry](https://opentelemetry.io/)
- [Prometheus](https://prometheus.io/)
- [Grafana](https://grafana.com/)
- [shadcn/ui](https://ui.shadcn.com/)

---

## 📞 支持和反饋

### 獲取幫助
- **文檔**: https://github.com/laitim2001/ai-webapp-template/tree/main/docs
- **Issues**: https://github.com/laitim2001/ai-webapp-template/issues
- **Discussions**: https://github.com/laitim2001/ai-webapp-template/discussions

### 社群
- **GitHub**: https://github.com/laitim2001/ai-webapp-template
- **NPM**: https://www.npmjs.com/package/create-ai-webapp
- **Email**: laitim20012@gmail.com

---

## 🗺️ 下一步計劃

### v5.1 (1-2週)
- [ ] 完整 E2E 測試驗證
- [ ] 性能優化
- [ ] 包體積優化
- [ ] 更多示例項目
- [ ] 收集社群反饋

### v5.2 (3-4週)
- [ ] 補充進階 UI 組件
- [ ] 完整 API 端點提取
- [ ] 更多業務模組
- [ ] GraphQL 支持 (可選)

### v6.0 (未來)
- [ ] 多雲支持 (AWS/GCP/Azure)
- [ ] 微服務架構選項
- [ ] 插件系統
- [ ] CLI 圖形界面

---

## 📜 授權

MIT License - 查看 [LICENSE](../LICENSE) 文件

---

**🎉 感謝使用 create-ai-webapp v5.0.0！**

**立即開始**: `npx create-ai-webapp my-awesome-app`

**NPM**: https://www.npmjs.com/package/create-ai-webapp
**GitHub**: https://github.com/laitim2001/ai-webapp-template
**文檔**: https://github.com/laitim2001/ai-webapp-template/tree/main/docs

---

---

## 🔧 Hotfix 週期 (v5.0.10 - v5.0.13)

**時間**: 2025-10-12
**狀態**: ✅ 已完成

### v5.0.13 (2025-10-12) - Toast UI 組件

**新增功能**:
- ✅ 新增 `toast.tsx` Toast 核心組件 (143行)
- ✅ 新增 `toaster.tsx` Toast 容器組件 (35行)
- ✅ 基於 @radix-ui/react-toast 實現
- ✅ 完整的通知提示功能支持

**影響**:
- UI 組件數從 24 增加到 26
- 模板文件數從 366 增加到 368

### v5.0.12 (2025-10-12) - Tailwind 依賴修復

**修復問題**: 🔴 Critical
- ✅ 修復 "Cannot find module 'tailwindcss-animate'" 錯誤
- ✅ 添加 `tailwindcss-animate@^1.0.7` 到 package.json.template
- ✅ 確保 Tailwind CSS 動畫插件正常工作

**影響**:
- 修復應用無法啟動的致命問題
- 所有 Radix UI 組件動畫恢復正常

### v5.0.11 (2025-10-12) - Prisma Schema 修復

**修復問題**: 🔴 Critical
- ✅ 修復 "operator class vector_cosine_ops does not exist for access method gin" 錯誤
- ✅ 移除不正確的 pgvector GIN 索引定義
- ✅ 添加 pgvector 索引手動創建指南

**影響**:
- PostgreSQL 數據庫遷移恢復正常
- 向量搜索功能可用

### v5.0.10 (2025-10-12) - Docker 鏡像修復

**修復問題**: 🔴 Critical
- ✅ 修復 "could not open extension control file vector.control" 錯誤
- ✅ 使用 `ankane/pgvector:latest` Docker 鏡像
- ✅ 添加完整的 Docker 容器管理命令

**影響**:
- pgvector 擴展正確安裝
- PostgreSQL 向量搜索完全可用

### Hotfix 週期總結

**修復數量**: 4個版本
**修復類型**: 3個 Critical Fix + 1個 Feature
**主要改進**:
1. PostgreSQL pgvector 生態系統完整性 (Docker + Prisma)
2. Tailwind CSS 依賴完整性
3. UI 組件補充 (Toast 通知)

**建議**: 所有用戶應升級到 v5.0.13 或更高版本

---

**初始發布日期**: 2025-10-11
**當前版本**: 5.0.13
**最後更新**: 2025-10-12
**發布者**: laitim2001

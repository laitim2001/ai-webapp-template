# 監控系統提取計劃
# Monitoring System Extraction Plan

**日期**: 2025-10-05
**狀態**: 📋 計劃中
**預計完成**: Day 3

---

## 📊 源項目監控系統分析結果

### 系統架構

```
應用層 (Next.js + OpenTelemetry API)
    ↓
監控抽象層 (lib/monitoring/telemetry.ts)
    ↓
配置層 (lib/monitoring/config.ts)
    ↓
後端工廠 (lib/monitoring/backend-factory.ts)
    ↓
監控後端 (Prometheus / Azure Monitor / Jaeger / Console)
```

### 核心特點

✅ **廠商中立設計** - 基於 OpenTelemetry 標準 API
✅ **多後端支持** - Prometheus, Azure Monitor, Jaeger, Console
✅ **完整指標覆蓋** - 系統層 + 應用層 + 業務層
✅ **即開即用** - Docker Compose 一鍵部署
✅ **4個預配置儀表板** - Grafana 自動載入

---

## 📁 文件清單分析

### 1. TypeScript 核心代碼 (lib/monitoring/)

| 文件 | 行數 | 用途 | 優先級 |
|------|------|------|--------|
| `telemetry.ts` | 456 | 統一監控抽象層，OpenTelemetry API | 🔴 P0 |
| `config.ts` | 113 | 監控配置管理（4種後端） | 🔴 P0 |
| `backend-factory.ts` | 212 | 後端工廠，動態切換監控系統 | 🔴 P0 |
| `monitor-init.ts` | 315 | 監控初始化和生命週期管理 | 🔴 P0 |
| `performance-monitor.ts` | 1,051 | 性能監控服務 | 🟡 P1 |
| `middleware.ts` | 99 | Next.js 中間件集成 | 🟡 P1 |
| `connection-monitor.ts` | 543 | 數據庫連接監控 | 🟢 P2 |

**總計**: 2,789 行

### 2. Docker 監控堆疊 (monitoring/)

#### Prometheus 配置
| 文件 | 行數 | 用途 |
|------|------|------|
| `prometheus/prometheus.yml` | ~100 | Prometheus 主配置 |
| `prometheus/alerts.yml` | ~200 | 46條告警規則 |

#### Grafana 配置
| 文件 | 行數 | 用途 |
|------|------|------|
| `grafana/provisioning/datasources/prometheus.yml` | ~20 | 數據源配置 |
| `grafana/provisioning/dashboards/dashboards.yml` | ~15 | 儀表板配置 |
| `grafana/dashboards/01-system-overview.json` | ~500 | 系統概覽儀表板 |
| `grafana/dashboards/02-api-performance.json` | ~500 | API 性能儀表板 |
| `grafana/dashboards/03-business-metrics.json` | ~500 | 業務指標儀表板 |
| `grafana/dashboards/04-resource-usage.json` | ~500 | 資源使用儀表板 |

#### Alertmanager 配置
| 文件 | 行數 | 用途 |
|------|------|------|
| `alertmanager/alertmanager.yml` | ~50 | 告警路由配置 |

#### Docker Compose
| 文件 | 行數 | 用途 |
|------|------|------|
| `docker-compose.monitoring.yml` | ~150 | 監控堆疊部署配置 |

**總計配置**: ~2,535 行

### 3. 文檔 (docs/)

| 文件 | 預估行數 | 用途 | 是否提取 |
|------|---------|------|----------|
| `monitoring-operations-manual.md` | ~800 | 完整運維手冊 | ✅ 是 |
| `monitoring-usage-examples.md` | ~400 | 使用範例 | ✅ 是 |
| `monitoring-migration-strategy.md` | ~300 | 後端遷移指南 | ✅ 是 |
| `azure-monitor-migration-checklist.md` | ~200 | Azure Monitor 遷移清單 | ✅ 是 |

**總計文檔**: ~1,700 行

### 總代碼量統計

| 類別 | 行數 | 佔比 |
|------|------|------|
| TypeScript 代碼 | 2,789 | 41% |
| 配置文件 | 2,535 | 37% |
| 文檔 | 1,700 | 25% |
| **總計** | **7,024** | **100%** |

✅ **符合 v5 計劃的 7,000+ 行預期**

---

## 🎯 提取策略

### Phase 1: 核心代碼提取 (P0 - 必須)

**目標**: 提取關鍵監控代碼，確保基本功能可用

**文件清單**:
```
00-monitoring/
├── lib/
│   ├── telemetry.ts.template              # ✅ P0 - 456 行
│   ├── config.ts.template                 # ✅ P0 - 113 行
│   ├── backend-factory.ts.template        # ✅ P0 - 212 行
│   └── monitor-init.ts.template           # ✅ P0 - 315 行
└── types/
    └── opentelemetry.d.ts.template        # ✅ P0 - 類型定義
```

**依賴包** (需要添加到 `package.json.template`):
```json
{
  "@opentelemetry/api": "^1.4.0",
  "@opentelemetry/sdk-node": "^0.41.0",
  "@opentelemetry/exporter-prometheus": "^0.41.0",
  "@opentelemetry/exporter-jaeger": "^1.15.0",
  "@azure/monitor-opentelemetry-exporter": "^1.0.0"
}
```

**預計時間**: 2 小時

---

### Phase 2: Docker 監控堆疊 (P0 - 必須)

**目標**: 提取完整的 Docker 部署配置

**文件清單**:
```
00-monitoring/
├── docker-compose.monitoring.yml.template  # ✅ P0 - 150 行
├── prometheus/
│   ├── prometheus.yml.template            # ✅ P0 - 100 行
│   └── alerts.yml.template                # ✅ P0 - 200 行
├── grafana/
│   ├── provisioning/
│   │   ├── datasources/prometheus.yml     # ✅ P0 - 20 行
│   │   └── dashboards/dashboards.yml      # ✅ P0 - 15 行
│   └── dashboards/
│       ├── 01-system-overview.json        # ✅ P0 - 500 行
│       ├── 02-api-performance.json        # ✅ P0 - 500 行
│       ├── 03-business-metrics.json       # ✅ P0 - 500 行
│       └── 04-resource-usage.json         # ✅ P0 - 500 行
└── alertmanager/
    └── alertmanager.yml.template          # ✅ P0 - 50 行
```

**預計時間**: 2 小時

---

### Phase 3: 文檔和範例 (P1 - 重要)

**目標**: 提供完整的使用指南

**文件清單**:
```
00-monitoring/
├── README.md.template                     # ✅ P1 - 新建快速開始
└── docs/
    ├── monitoring-operations-manual.md    # ✅ P1 - 800 行
    ├── monitoring-usage-examples.md       # ✅ P1 - 400 行
    ├── monitoring-migration-strategy.md   # ✅ P1 - 300 行
    └── azure-monitor-migration.md         # ✅ P1 - 200 行
```

**預計時間**: 1 小時

---

### Phase 4: 增強功能 (P2 - 可選)

**目標**: 提取性能監控和連接監控

**文件清單**:
```
00-monitoring/
└── lib/
    ├── performance-monitor.ts.template    # ✅ P2 - 1,051 行
    ├── middleware.ts.template             # ✅ P2 - 99 行
    └── connection-monitor.ts.template     # ✅ P2 - 543 行
```

**預計時間**: 1 小時 (如時間允許)

---

## 🔄 模板化策略

### 佔位符替換規則

| 原始值 | 佔位符 | 說明 |
|--------|--------|------|
| `ai-sales-platform` | `{{SERVICE_NAME}}` | 服務名稱 |
| `ai-sales-enablement-webapp` | `{{PROJECT_NAME}}` | 項目名稱 |
| `localhost` | `{{MONITORING_HOST}}` | 監控主機 |
| `9090` | `{{PROMETHEUS_PORT}}` | Prometheus 端口 |
| `3001` | `{{GRAFANA_PORT}}` | Grafana 端口 |
| 特定業務指標 | 通用名稱 | 移除業務特定邏輯 |

### 需要清理的業務邏輯

**從 `telemetry.ts` 中移除的業務指標**:
- ❌ `dynamicsSyncOperations` - Dynamics 365 特定
- ❌ `customerEngagementScore` - 業務特定

**保留的通用指標**:
- ✅ HTTP 請求（請求數、時長、大小）
- ✅ 用戶活動（註冊、登入）
- ✅ 數據庫（查詢時長、連接池）
- ✅ 緩存（命中率、請求數）
- ✅ 文件上傳和處理

---

## ✅ 驗證清單

### 代碼完整性驗證
- [ ] 所有 P0 文件已提取
- [ ] TypeScript 代碼無語法錯誤
- [ ] 依賴包已添加到 package.json
- [ ] 佔位符替換正確

### Docker 堆疊驗證
- [ ] docker-compose.monitoring.yml 可正常啟動
- [ ] Prometheus 可訪問 (localhost:9090)
- [ ] Grafana 可訪問 (localhost:3001)
- [ ] 4個儀表板正確載入

### 文檔完整性驗證
- [ ] 快速開始指南可用
- [ ] 運維手冊包含關鍵操作
- [ ] 使用範例清晰易懂

---

## 📋 執行計劃

### Step 1: 準備目錄結構 (10分鐘)
```bash
mkdir -p C:\ai-webapp-template\00-monitoring\lib
mkdir -p C:\ai-webapp-template\00-monitoring\types
mkdir -p C:\ai-webapp-template\00-monitoring\prometheus
mkdir -p C:\ai-webapp-template\00-monitoring\grafana\{dashboards,provisioning\{datasources,dashboards}}
mkdir -p C:\ai-webapp-template\00-monitoring\alertmanager
mkdir -p C:\ai-webapp-template\00-monitoring\docs
```

### Step 2: 提取核心代碼 (2小時)
- 複製 `lib/monitoring/*.ts` → `00-monitoring/lib/*.ts.template`
- 替換佔位符
- 移除業務特定邏輯
- 添加註釋和使用說明

### Step 3: 提取 Docker 配置 (2小時)
- 複製 `docker-compose.monitoring.yml`
- 複製 `prometheus/` 配置
- 複製 `grafana/` 配置和儀表板
- 複製 `alertmanager/` 配置
- 替換佔位符

### Step 4: 提取文檔 (1小時)
- 複製監控文檔
- 創建 README.md
- 更新文檔中的項目特定引用

### Step 5: 驗證和測試 (1小時)
- 測試 Docker 堆疊啟動
- 驗證 Grafana 儀表板
- 檢查文檔連結和範例

**總預計時間**: 6 小時（含測試）

---

## 🎯 成功標準

✅ **代碼質量**:
- TypeScript 代碼零錯誤
- 所有依賴正確聲明
- 佔位符系統完整

✅ **部署可用性**:
- Docker 堆疊一鍵啟動
- 所有服務健康檢查通過
- Grafana 儀表板正確顯示

✅ **文檔完整性**:
- 快速開始 < 5分鐘可完成
- 運維手冊涵蓋關鍵場景
- 使用範例可直接執行

✅ **模板化質量**:
- 佔位符一致性
- 無硬編碼項目名稱
- CLI 可正確替換

---

## 📝 注意事項

### ⚠️ 已知問題

1. **OpenTelemetry 依賴未安裝**
   - 源項目 package.json 中未列出
   - 需要在模板中明確添加
   - 版本需要測試兼容性

2. **業務指標過於具體**
   - 需要移除 Dynamics 365 等特定指標
   - 保留通用的 HTTP、數據庫、緩存指標

3. **配置文件路徑**
   - 確保相對路徑正確
   - Docker volume 掛載路徑需要適配

### 💡 優化建議

1. **簡化後端選擇**
   - 預設只支持 Prometheus 和 Console
   - Azure Monitor 作為可選擴展

2. **減少儀表板複雜度**
   - 保留 2 個核心儀表板（系統概覽 + API 性能）
   - 其餘作為可選模板

3. **文檔精簡**
   - 合併運維手冊和使用範例
   - 快速開始獨立成 README

---

*本計劃基於源項目 commit: `9ddbd81fa1746ae54eff0d6eddb8f82b5bb14b94`*

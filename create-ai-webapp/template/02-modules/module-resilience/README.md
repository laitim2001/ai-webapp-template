# 韌性模組 (Resilience Module)

**版本**: 5.0
**狀態**: 生產就緒
**創建日期**: 2025-10-10

## 📋 概述

韌性模組為您的 Next.js 應用提供全面的故障恢復、容錯和健康檢查功能。實現了熔斷器模式、智能重試機制和系統健康監控，從 AI 銷售賦能平台提取，經過生產環境驗證。

## 🎯 功能特性

### 1. 熔斷器 (`lib/resilience/circuit-breaker.ts`)
- **防止級聯故障**: 當依賴服務失敗時自動熔斷，避免系統崩潰
- **快速失敗機制**: 熔斷狀態下立即返回錯誤，不浪費資源
- **自動故障恢復**: 定期測試服務是否恢復，自動切換狀態
- **半開狀態測試**: 逐步放行請求測試服務恢復情況
- **熔斷統計追蹤**: 詳細記錄成功、失敗、拒絕請求數量和錯誤率
- **狀態變更回調**: 支持自定義狀態變更處理邏輯
- **可配置閾值**: 支持失敗閾值、成功閾值、超時時間等配置

### 2. 智能重試 (`lib/resilience/retry.ts`)
- **多種重試策略**: 支持固定延遲、指數退避、線性退避
- **智能抖動**: 添加隨機延遲避免驚群效應
- **條件重試**: 可配置哪些錯誤需要重試
- **最大重試次數**: 防止無限重試
- **超時控制**: 每次重試可設置獨立超時時間
- **重試回調**: 支持重試前後的自定義處理
- **詳細統計**: 記錄重試次數、成功率、失敗原因

### 3. 健康檢查 (`lib/resilience/health-check.ts`)
- **系統健康監控**: 檢查數據庫、緩存、外部服務等組件健康狀態
- **自定義檢查器**: 支持添加任意健康檢查邏輯
- **健康狀態聚合**: 綜合所有組件的健康狀態
- **性能指標**: 記錄檢查耗時和最後檢查時間
- **健康等級**: 支持 healthy、degraded、unhealthy 三種狀態
- **定期檢查**: 自動定期執行健康檢查
- **健康端點**: 提供 HTTP 端點供監控系統調用

## 📦 安裝配置

### 1. 模組整合

複製模組到您的項目：
```bash
cp -r 02-modules/module-resilience/lib/resilience lib/
```

### 2. 環境變量

添加到您的 `.env.local`：
```bash
# 韌性模組配置（可選）
CIRCUIT_BREAKER_FAILURE_THRESHOLD=5
CIRCUIT_BREAKER_SUCCESS_THRESHOLD=2
CIRCUIT_BREAKER_RESET_TIMEOUT=60000
RETRY_MAX_ATTEMPTS=3
RETRY_INITIAL_DELAY=1000
HEALTH_CHECK_INTERVAL=30000
```

## 🚀 使用方法

### 熔斷器

#### 基本用法

```typescript
import { CircuitBreaker } from '@/lib/resilience/circuit-breaker';

// 創建熔斷器
const dbBreaker = new CircuitBreaker({
  name: 'database',
  failureThreshold: 5,      // 5次失敗後熔斷
  successThreshold: 2,      // 半開狀態2次成功後恢復
  resetTimeout: 60000,      // 60秒後嘗試恢復
  timeout: 30000            // 操作超時30秒
});

// 執行受保護的操作
try {
  const result = await dbBreaker.execute(async () => {
    return await db.query('SELECT * FROM users');
  });
  console.log('查詢成功:', result);
} catch (error) {
  if (error.name === 'CircuitBreakerError') {
    console.error('熔斷器開啟，請求被拒絕');
  } else {
    console.error('查詢失敗:', error);
  }
}
```

#### 狀態變更回調

```typescript
const breaker = new CircuitBreaker({
  name: 'api',
  failureThreshold: 3,
  resetTimeout: 30000,

  // 狀態變更回調
  onStateChange: (from, to) => {
    console.log(`熔斷器從 ${from} 變更為 ${to}`);

    if (to === 'OPEN') {
      // 熔斷開啟時發送警報
      sendAlert('API熔斷器已開啟，服務可能不可用');
    } else if (to === 'CLOSED') {
      // 恢復正常時通知
      sendNotification('API服務已恢復正常');
    }
  },

  // 成功回調
  onSuccess: () => {
    console.log('請求成功');
  },

  // 失敗回調
  onFailure: (error) => {
    console.error('請求失敗:', error.message);
  }
});
```

#### 獲取統計信息

```typescript
const stats = dbBreaker.getStats();

console.log(`熔斷器名稱: ${stats.name}`);
console.log(`當前狀態: ${stats.state}`);
console.log(`總請求數: ${stats.totalRequests}`);
console.log(`成功請求: ${stats.successfulRequests}`);
console.log(`失敗請求: ${stats.failedRequests}`);
console.log(`拒絕請求: ${stats.rejectedRequests}`);
console.log(`錯誤率: ${(stats.errorRate * 100).toFixed(2)}%`);
console.log(`可用時間: ${(stats.uptime * 100).toFixed(2)}%`);
```

#### 手動控制狀態

```typescript
// 強制開啟熔斷器（維護模式）
dbBreaker.forceOpen();

// 強制關閉熔斷器（緊急恢復）
dbBreaker.forceClose();

// 重置熔斷器統計
dbBreaker.reset();
```

### 智能重試

#### 基本重試

```typescript
import { retry } from '@/lib/resilience/retry';

// 使用默認配置（3次重試，指數退避）
const result = await retry(async () => {
  return await fetch('https://api.example.com/data');
});
```

#### 自定義重試策略

```typescript
import { retry, RetryStrategy } from '@/lib/resilience/retry';

// 指數退避策略
const result = await retry(
  async () => {
    return await apiCall();
  },
  {
    maxAttempts: 5,
    strategy: RetryStrategy.EXPONENTIAL_BACKOFF,
    initialDelay: 1000,      // 初始延遲1秒
    maxDelay: 30000,         // 最大延遲30秒
    backoffMultiplier: 2,    // 每次延遲翻倍
    jitter: true,            // 添加隨機抖動
    timeout: 60000           // 總超時60秒
  }
);

// 線性退避策略
const result2 = await retry(
  async () => {
    return await apiCall();
  },
  {
    maxAttempts: 3,
    strategy: RetryStrategy.LINEAR_BACKOFF,
    initialDelay: 1000,      // 第一次重試1秒
    maxDelay: 5000           // 遞增到5秒
  }
);

// 固定延遲策略
const result3 = await retry(
  async () => {
    return await apiCall();
  },
  {
    maxAttempts: 3,
    strategy: RetryStrategy.FIXED_DELAY,
    initialDelay: 2000       // 每次重試固定2秒
  }
);
```

#### 條件重試

```typescript
const result = await retry(
  async () => {
    const response = await fetch('https://api.example.com/data');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  },
  {
    maxAttempts: 3,
    shouldRetry: (error, attempt) => {
      // 只重試網絡錯誤和5xx錯誤
      if (error.message.includes('network')) return true;
      if (error.message.includes('500')) return true;
      if (error.message.includes('502')) return true;
      if (error.message.includes('503')) return true;

      // 4xx 錯誤不重試
      return false;
    }
  }
);
```

#### 重試回調

```typescript
const result = await retry(
  async () => {
    return await apiCall();
  },
  {
    maxAttempts: 5,
    onRetry: (error, attempt, delay) => {
      console.log(`第 ${attempt} 次重試，延遲 ${delay}ms`);
      console.log(`錯誤: ${error.message}`);
    }
  }
);
```

### 健康檢查

#### 設置健康檢查

```typescript
import { HealthChecker, HealthStatus } from '@/lib/resilience/health-check';

// 創建健康檢查器
const healthChecker = HealthChecker.getInstance();

// 註冊數據庫健康檢查
healthChecker.registerCheck('database', async () => {
  try {
    await db.$queryRaw`SELECT 1`;
    return {
      status: HealthStatus.HEALTHY,
      message: '數據庫連接正常'
    };
  } catch (error) {
    return {
      status: HealthStatus.UNHEALTHY,
      message: `數據庫連接失敗: ${error.message}`
    };
  }
});

// 註冊 Redis 健康檢查
healthChecker.registerCheck('redis', async () => {
  try {
    await redis.ping();
    return {
      status: HealthStatus.HEALTHY,
      message: 'Redis 連接正常'
    };
  } catch (error) {
    return {
      status: HealthStatus.UNHEALTHY,
      message: `Redis 連接失敗: ${error.message}`
    };
  }
});

// 註冊外部 API 健康檢查
healthChecker.registerCheck('external-api', async () => {
  try {
    const response = await fetch('https://api.example.com/health', {
      timeout: 5000
    });

    if (response.ok) {
      return {
        status: HealthStatus.HEALTHY,
        message: '外部API正常'
      };
    } else {
      return {
        status: HealthStatus.DEGRADED,
        message: `外部API響應異常: ${response.status}`
      };
    }
  } catch (error) {
    return {
      status: HealthStatus.UNHEALTHY,
      message: `外部API不可用: ${error.message}`
    };
  }
});
```

#### 執行健康檢查

```typescript
// 檢查所有組件
const overallHealth = await healthChecker.checkHealth();

console.log(`總體狀態: ${overallHealth.status}`);
console.log(`檢查時間: ${overallHealth.timestamp}`);
console.log(`詳細信息:`, overallHealth.checks);

// 檢查單個組件
const dbHealth = await healthChecker.checkComponent('database');
console.log(`數據庫狀態: ${dbHealth.status}`);
```

#### 健康檢查 API 端點

```typescript
// app/api/health/route.ts
import { HealthChecker } from '@/lib/resilience/health-check';
import { NextResponse } from 'next/server';

export async function GET() {
  const healthChecker = HealthChecker.getInstance();
  const health = await healthChecker.checkHealth();

  // 根據健康狀態返回適當的 HTTP 狀態碼
  const statusCode =
    health.status === 'healthy' ? 200 :
    health.status === 'degraded' ? 200 :
    503; // unhealthy

  return NextResponse.json(health, { status: statusCode });
}
```

#### 啟動健康監控

```typescript
// 啟動定期健康檢查（每30秒）
healthChecker.startMonitoring(30000);

// 停止監控
healthChecker.stopMonitoring();
```

## 📊 綜合使用示例

### 完整的韌性保護

```typescript
import { CircuitBreaker } from '@/lib/resilience/circuit-breaker';
import { retry, RetryStrategy } from '@/lib/resilience/retry';
import { HealthChecker } from '@/lib/resilience/health-check';

// 創建帶熔斷器的API客戶端
class ResilientApiClient {
  private breaker: CircuitBreaker;

  constructor() {
    this.breaker = new CircuitBreaker({
      name: 'api-client',
      failureThreshold: 5,
      resetTimeout: 60000,
      timeout: 30000
    });
  }

  async get(url: string) {
    // 使用熔斷器保護
    return await this.breaker.execute(async () => {
      // 使用重試機制
      return await retry(
        async () => {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          return response.json();
        },
        {
          maxAttempts: 3,
          strategy: RetryStrategy.EXPONENTIAL_BACKOFF,
          shouldRetry: (error) => {
            // 只重試5xx錯誤
            return error.message.includes('50');
          }
        }
      );
    });
  }
}

// 註冊健康檢查
const healthChecker = HealthChecker.getInstance();
const apiClient = new ResilientApiClient();

healthChecker.registerCheck('api-client', async () => {
  const stats = apiClient.breaker.getStats();

  if (stats.state === 'OPEN') {
    return {
      status: HealthStatus.UNHEALTHY,
      message: 'API熔斷器開啟',
      details: stats
    };
  } else if (stats.errorRate > 0.5) {
    return {
      status: HealthStatus.DEGRADED,
      message: `API錯誤率較高: ${(stats.errorRate * 100).toFixed(2)}%`,
      details: stats
    };
  } else {
    return {
      status: HealthStatus.HEALTHY,
      message: 'API服務正常',
      details: stats
    };
  }
});
```

### 數據庫操作保護

```typescript
import { CircuitBreaker } from '@/lib/resilience/circuit-breaker';
import { retry } from '@/lib/resilience/retry';

// 創建數據庫熔斷器
const dbBreaker = new CircuitBreaker({
  name: 'database',
  failureThreshold: 3,
  resetTimeout: 30000
});

// 帶重試和熔斷的數據庫查詢
async function queryWithResilience(query: string) {
  return await dbBreaker.execute(async () => {
    return await retry(
      async () => {
        return await db.$queryRaw(query);
      },
      {
        maxAttempts: 2,
        initialDelay: 500
      }
    );
  });
}

// 使用示例
try {
  const users = await queryWithResilience`SELECT * FROM users`;
  console.log('查詢成功:', users);
} catch (error) {
  console.error('查詢失敗:', error);
  // 使用備用數據源或返回緩存數據
}
```

## 🧪 測試

模組包含完整的測試套件（100+ 測試）：

```bash
# 運行所有韌性模組測試
npm test -- lib/resilience

# 運行特定測試文件
npm test -- lib/resilience/__tests__/circuit-breaker.test.ts
npm test -- lib/resilience/__tests__/retry.test.ts
npm test -- lib/resilience/__tests__/health-check.test.ts

# 運行測試覆蓋率
npm test -- --coverage lib/resilience
```

測試覆蓋包括：
- ✅ 熔斷器狀態轉換
- ✅ 失敗閾值觸發
- ✅ 自動恢復機制
- ✅ 超時處理
- ✅ 重試策略（固定、線性、指數）
- ✅ 重試條件判斷
- ✅ 抖動機制
- ✅ 健康檢查註冊
- ✅ 健康狀態聚合
- ✅ 定期監控

## ⚙️ 配置選項

### 熔斷器配置

```typescript
interface CircuitBreakerConfig {
  name: string;                      // 熔斷器名稱（必需）
  failureThreshold?: number;         // 失敗閾值（默認 5）
  successThreshold?: number;         // 成功閾值（默認 2）
  resetTimeout?: number;             // 重置超時（默認 60000ms）
  timeout?: number;                  // 操作超時（默認 30000ms）
  monitoringPeriod?: number;         // 監控週期（默認 10000ms）
  volumeThreshold?: number;          // 最小請求量（默認 10）
  errorThresholdPercentage?: number; // 錯誤率閾值（默認 50%）
  onStateChange?: (from, to) => void;// 狀態變更回調
  onSuccess?: () => void;            // 成功回調
  onFailure?: (error) => void;       // 失敗回調
}
```

### 重試配置

```typescript
interface RetryOptions {
  maxAttempts?: number;              // 最大重試次數（默認 3）
  strategy?: RetryStrategy;          // 重試策略（默認 EXPONENTIAL_BACKOFF）
  initialDelay?: number;             // 初始延遲（默認 1000ms）
  maxDelay?: number;                 // 最大延遲（默認 30000ms）
  backoffMultiplier?: number;        // 退避乘數（默認 2）
  jitter?: boolean;                  // 添加抖動（默認 true）
  timeout?: number;                  // 總超時
  shouldRetry?: (error, attempt) => boolean; // 重試條件
  onRetry?: (error, attempt, delay) => void; // 重試回調
}
```

### 健康檢查配置

```typescript
// 註冊檢查器時可配置超時
healthChecker.registerCheck('service', checkFunction, {
  timeout: 5000,  // 檢查超時5秒
  critical: true  // 標記為關鍵服務
});
```

## 🔧 高級用法

### 多層級熔斷器

```typescript
// 創建多個層級的熔斷器
const dbPrimaryBreaker = new CircuitBreaker({
  name: 'db-primary',
  failureThreshold: 3,
  resetTimeout: 30000
});

const dbReplicaBreaker = new CircuitBreaker({
  name: 'db-replica',
  failureThreshold: 5,
  resetTimeout: 60000
});

// 主庫失敗時自動切換到從庫
async function queryDatabase(query: string) {
  try {
    return await dbPrimaryBreaker.execute(() => db.primary.query(query));
  } catch (primaryError) {
    console.warn('主庫不可用，切換到從庫');
    return await dbReplicaBreaker.execute(() => db.replica.query(query));
  }
}
```

### 自適應重試

```typescript
import { retry } from '@/lib/resilience/retry';

// 根據服務負載動態調整重試策略
async function adaptiveRetry(fn: Function) {
  const serverLoad = await getServerLoad();

  const config = serverLoad > 0.8 ? {
    // 高負載時減少重試次數和延遲
    maxAttempts: 2,
    initialDelay: 2000
  } : {
    // 低負載時允許更多重試
    maxAttempts: 5,
    initialDelay: 500
  };

  return await retry(fn, config);
}
```

### 健康檢查依賴關係

```typescript
// 註冊有依賴關係的健康檢查
healthChecker.registerCheck('application', async () => {
  // 先檢查依賴服務
  const dbHealth = await healthChecker.checkComponent('database');
  const cacheHealth = await healthChecker.checkComponent('redis');

  if (dbHealth.status === HealthStatus.UNHEALTHY) {
    return {
      status: HealthStatus.UNHEALTHY,
      message: '應用不可用：數據庫連接失敗'
    };
  }

  if (cacheHealth.status === HealthStatus.UNHEALTHY) {
    return {
      status: HealthStatus.DEGRADED,
      message: '應用降級：緩存不可用'
    };
  }

  return {
    status: HealthStatus.HEALTHY,
    message: '應用運行正常'
  };
});
```

## 📈 最佳實踐

### 1. 熔斷器使用建議
- 為每個外部依賴創建獨立的熔斷器
- 根據服務的SLA設置合適的閾值
- 使用狀態變更回調發送告警
- 定期檢查熔斷器統計信息
- 為關鍵路徑設置更保守的閾值

### 2. 重試策略選擇
- **固定延遲**: 適用於快速失敗的場景
- **線性退避**: 適用於臨時性故障
- **指數退避**: 適用於需要時間恢復的服務
- 始終添加抖動避免驚群效應
- 為不同錯誤類型設置不同的重試策略

### 3. 健康檢查最佳實踐
- 檢查應該輕量級且快速
- 區分關鍵服務和非關鍵服務
- 提供詳細的健康狀態信息
- 定期但不要太頻繁（建議30-60秒）
- 健康端點應該可以被監控系統訪問

## 🔗 與其他模組整合

### 與性能監控模組整合

```typescript
import { CircuitBreaker } from '@/lib/resilience/circuit-breaker';
import { PerformanceMonitor } from '@/lib/performance/monitor';

const monitor = PerformanceMonitor.getInstance();
const breaker = new CircuitBreaker({
  name: 'api',
  onSuccess: () => {
    monitor.trackMetric({
      endpoint: '/circuit-breaker/api',
      method: 'EXECUTE',
      duration: 0,
      response_size: 0,
      status_code: 200
    });
  },
  onFailure: (error) => {
    monitor.trackMetric({
      endpoint: '/circuit-breaker/api',
      method: 'EXECUTE',
      duration: 0,
      response_size: 0,
      status_code: 500,
      error_message: error.message
    });
  }
});
```

### 與緩存模組整合

```typescript
import { retry } from '@/lib/resilience/retry';
import { cacheResponse } from '@/lib/performance/response-cache';

// 帶重試和緩存的數據獲取
async function fetchWithResilienceAndCache(key: string, fetchFn: Function) {
  return await cacheResponse(
    key,
    async () => {
      return await retry(fetchFn, {
        maxAttempts: 3,
        strategy: RetryStrategy.EXPONENTIAL_BACKOFF
      });
    },
    { ttl: 300 }
  );
}
```

## 📚 API 參考

### CircuitBreaker

- `execute(fn)`: 執行受保護的操作
- `getStats()`: 獲取統計信息
- `forceOpen()`: 強制開啟熔斷器
- `forceClose()`: 強制關閉熔斷器
- `reset()`: 重置統計信息

### Retry Functions

- `retry(fn, options)`: 執行帶重試的操作
- `RetryStrategy.FIXED_DELAY`: 固定延遲策略
- `RetryStrategy.LINEAR_BACKOFF`: 線性退避策略
- `RetryStrategy.EXPONENTIAL_BACKOFF`: 指數退避策略

### HealthChecker

- `getInstance()`: 獲取單例實例
- `registerCheck(name, fn, options)`: 註冊健康檢查
- `checkHealth()`: 檢查所有組件
- `checkComponent(name)`: 檢查單個組件
- `startMonitoring(interval)`: 啟動定期監控
- `stopMonitoring()`: 停止監控

## 🐛 故障排除

### 熔斷器未按預期工作
- 檢查失敗閾值設置是否合理
- 確認resetTimeout足夠長以讓服務恢復
- 查看熔斷器統計信息確認當前狀態
- 檢查是否有多個熔斷器實例

### 重試次數過多
- 降低maxAttempts
- 使用shouldRetry條件限制重試
- 檢查錯誤類型是否適合重試
- 考慮添加熔斷器保護

### 健康檢查超時
- 增加檢查函數的超時時間
- 簡化健康檢查邏輯
- 檢查依賴服務的響應時間
- 使用異步檢查避免阻塞

## 📄 授權

MIT 授權 - 查看根目錄 LICENSE 文件

## 🤝 貢獻

此模組從 AI 銷售賦能平台提取。如有問題或改進建議，請提交到主倉庫。

## 📞 支持

如有問題、疑問或貢獻：
- GitHub Issues: https://github.com/laitim2001/ai-webapp-template/issues
- 文檔：查看主項目的 `/docs` 目錄
